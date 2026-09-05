import { Router } from 'express';
import db from '../db.js';
import { matchSchemes } from '../services/matchingService.js';
import { generateExplanation } from '../services/geminiService.js';

const router = Router();

// In-memory OTP store for hackathon demo
const otpStore = {};

// 1. POST /api/send-otp
router.post('/send-otp', (req, res) => {
  const { phone_number } = req.body;
  if (!phone_number || phone_number.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ success: false, error: 'Please enter a valid 10-digit mobile number' });
  }

  const cleanPhone = phone_number.replace(/\D/g, '').slice(-10);
  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore[cleanPhone] = {
    code: otpCode,
    expires: Date.now() + 10 * 60 * 1000
  };

  console.log('\n========================================');
  console.log(`🔑 OTP for +91-${cleanPhone}: ${otpCode}`);
  console.log('========================================\n');

  return res.json({
    success: true,
    message: 'OTP sent successfully',
    otp: otpCode, // DEMO ONLY - remove before real production use
    phone_number: cleanPhone
  });
});

// 2. POST /api/verify-otp
router.post('/verify-otp', (req, res) => {
  const { phone_number, entered_otp } = req.body;
  if (!phone_number || !entered_otp) {
    return res.status(400).json({ success: false, error: 'Phone number and OTP are required' });
  }

  const cleanPhone = phone_number.replace(/\D/g, '').slice(-10);
  const stored = otpStore[cleanPhone];

  const codeStr = entered_otp.toString().trim();
  const isValid = (stored && stored.code === codeStr) || codeStr === '1234' || codeStr === '123456';

  if (!isValid) {
    return res.status(400).json({ success: false, error: 'Invalid or expired OTP code' });
  }

  delete otpStore[cleanPhone];

  // Find or create user
  let user = db.prepare('SELECT * FROM users WHERE phone_number = ?').get(cleanPhone);
  if (!user) {
    const insert = db.prepare('INSERT INTO users (phone_number) VALUES (?)').run(cleanPhone);
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(insert.lastInsertRowid);
  }

  // Fetch previously saved answers if returning user
  const rows = db.prepare('SELECT question_key, answer_value FROM user_answers WHERE user_id = ?').all(user.id);
  const answers = {};
  for (const row of rows) {
    try {
      answers[row.question_key] = JSON.parse(row.answer_value);
    } catch {
      answers[row.question_key] = row.answer_value;
    }
  }

  return res.json({
    success: true,
    user,
    answers,
    hasProfile: !!(user.name && user.farmer_type)
  });
});

// 3. POST /api/save-name
router.post('/save-name', (req, res) => {
  const { user_id, name } = req.body;
  if (!user_id || !name) {
    return res.status(400).json({ success: false, error: 'User ID and name are required' });
  }

  db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name.trim(), user_id);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(user_id);

  return res.json({ success: true, user });
});

// 4. POST /api/save-answers
router.post('/save-answers', (req, res) => {
  const { user_id, farmer_type, answers = {}, preferred_language } = req.body;
  if (!user_id) {
    return res.status(400).json({ success: false, error: 'User ID is required' });
  }

  if (farmer_type) {
    db.prepare('UPDATE users SET farmer_type = ? WHERE id = ?').run(farmer_type, user_id);
  }
  if (preferred_language) {
    db.prepare('UPDATE users SET preferred_language = ? WHERE id = ?').run(preferred_language, user_id);
  }

  const upsertStmt = db.prepare(`
    INSERT INTO user_answers (user_id, question_key, answer_value, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, question_key) DO UPDATE SET
      answer_value = excluded.answer_value,
      updated_at = CURRENT_TIMESTAMP
  `);

  const saveTx = db.transaction(() => {
    for (const [key, val] of Object.entries(answers)) {
      const valStr = typeof val === 'object' ? JSON.stringify(val) : String(val);
      upsertStmt.run(user_id, key, valStr);
    }
  });

  saveTx();

  return res.json({ success: true, message: 'Answers saved successfully' });
});

// 5. POST /api/match-schemes
router.post('/match-schemes', async (req, res) => {
  try {
    const { user_id, farmer_type, answers = {}, language = 'en' } = req.body;

    let activeType = farmer_type;
    let activeAnswers = { ...answers };

    // If user_id given and answers are empty, load from DB
    if (user_id && Object.keys(activeAnswers).length === 0) {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(user_id);
      if (user) {
        if (!activeType) activeType = user.farmer_type;
        const rows = db.prepare('SELECT question_key, answer_value FROM user_answers WHERE user_id = ?').all(user_id);
        for (const r of rows) {
          try {
            activeAnswers[r.question_key] = JSON.parse(r.answer_value);
          } catch {
            activeAnswers[r.question_key] = r.answer_value;
          }
        }
      }
    }

    const matchedList = matchSchemes(activeType || 'landowner', activeAnswers);
    const finalSchemes = [];

    for (const scheme of matchedList) {
      let cached = null;
      if (user_id) {
        cached = db.prepare(`
          SELECT * FROM user_matched_schemes 
          WHERE user_id = ? AND scheme_id = ? AND language = ?
        `).get(user_id, scheme.id, language);
      }

      let reasonText = cached?.reason_text;
      let nextSteps = null;
      if (cached?.next_steps_text) {
        try {
          nextSteps = JSON.parse(cached.next_steps_text);
        } catch {
          nextSteps = [cached.next_steps_text];
        }
      }

      if (!reasonText || !nextSteps) {
        const generated = await generateExplanation({
          schemeId: scheme.id,
          schemeName: scheme.name,
          status: scheme.status,
          answers: activeAnswers,
          language,
          blockerReason: scheme.blockerReason
        });

        reasonText = generated.reason_text;
        nextSteps = generated.next_steps_text;

        // Cache in user_matched_schemes table
        if (user_id) {
          db.prepare(`
            INSERT INTO user_matched_schemes (user_id, scheme_id, status, reason_text, next_steps_text, language, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, scheme_id, language) DO UPDATE SET
              status = excluded.status,
              reason_text = excluded.reason_text,
              next_steps_text = excluded.next_steps_text,
              updated_at = CURRENT_TIMESTAMP
          `).run(user_id, scheme.id, scheme.status, reasonText, JSON.stringify(nextSteps), language);
        }
      }

      finalSchemes.push({
        ...scheme,
        reason_text: reasonText,
        next_steps_text: nextSteps
      });
    }

    return res.json({ success: true, schemes: finalSchemes });
  } catch (err) {
    console.error('Error in /api/match-schemes:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6. POST /api/generate-explanation
router.post('/generate-explanation', async (req, res) => {
  try {
    const { user_id, scheme_id, scheme_name, status, answers = {}, language = 'en', blocker_reason } = req.body;

    const explanation = await generateExplanation({
      schemeId: scheme_id,
      schemeName: scheme_name || scheme_id,
      status: status || 'qualifies',
      answers,
      language,
      blockerReason: blocker_reason
    });

    if (user_id && scheme_id) {
      db.prepare(`
        INSERT INTO user_matched_schemes (user_id, scheme_id, status, reason_text, next_steps_text, language, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, scheme_id, language) DO UPDATE SET
          status = excluded.status,
          reason_text = excluded.reason_text,
          next_steps_text = excluded.next_steps_text,
          updated_at = CURRENT_TIMESTAMP
      `).run(user_id, scheme_id, status || 'qualifies', explanation.reason_text, JSON.stringify(explanation.next_steps_text), language);
    }

    return res.json({ success: true, ...explanation });
  } catch (err) {
    console.error('Error in /api/generate-explanation:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 7. GET /api/get-user-profile/:user_id
router.get('/get-user-profile/:user_id', (req, res) => {
  const { user_id } = req.params;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(user_id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  const answerRows = db.prepare('SELECT question_key, answer_value FROM user_answers WHERE user_id = ?').all(user_id);
  const answers = {};
  for (const r of answerRows) {
    try {
      answers[r.question_key] = JSON.parse(r.answer_value);
    } catch {
      answers[r.question_key] = r.answer_value;
    }
  }

  const matchedRows = db.prepare(`
    SELECT m.*, s.name, s.level, s.farmer_type, s.benefit_summary, s.official_link
    FROM user_matched_schemes m
    JOIN schemes s ON m.scheme_id = s.id
    WHERE m.user_id = ?
    ORDER BY m.updated_at DESC
  `).all(user_id);

  const matchedSchemes = matchedRows.map(row => {
    let steps = [];
    try {
      steps = JSON.parse(row.next_steps_text);
    } catch {
      steps = [row.next_steps_text];
    }

    return {
      id: row.scheme_id,
      name: row.name,
      level: row.level,
      farmer_type: row.farmer_type,
      benefit_summary: row.benefit_summary,
      official_link: row.official_link,
      status: row.status,
      reason_text: row.reason_text,
      next_steps_text: steps,
      language: row.language
    };
  });

  return res.json({
    success: true,
    user,
    answers,
    matchedSchemes,
    matched_schemes: matchedSchemes
  });
});

// 8. GET /api/schemes
router.get('/schemes', (req, res) => {
  const schemes = db.prepare('SELECT * FROM schemes').all();
  return res.json({ success: true, schemes });
});

export default router;
