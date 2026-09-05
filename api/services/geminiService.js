import dotenv from 'dotenv';
import { landownerSchemes } from '../../src/data/landownerSchemes.js';
import { landlessSchemes } from '../../src/data/landlessSchemes.js';

dotenv.config();

const allSchemes = [...landownerSchemes, ...landlessSchemes];
const schemeMap = Object.fromEntries(allSchemes.map(s => [s.id, s]));

export async function generateExplanation({ schemeId, schemeName, status, answers = {}, language = 'en', blockerReason = null }) {
  const lang = ['en', 'hi', 'mr'].includes(language) ? language : 'en';
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey && apiKey.trim().length > 10) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

      const langNames = { en: 'English', hi: 'Hindi in Devanagari script', mr: 'Marathi in Devanagari script' };
      const targetLang = langNames[lang] || 'English';

      const prompt = [
        'You are an empathetic agricultural advisor for rural Indian farmers using Kisan Sahayak.',
        'Generate a simple explanation for why the farmer qualifies or is missing out on this scheme, and exact next steps.',
        '',
        `Scheme: ${schemeName} (${schemeId})`,
        `Status: ${status === 'qualifies' ? 'Farmer Qualifies' : 'Farmer Missing Out'}`,
        `Key Reason: ${blockerReason || 'Evaluated based on criteria'}`,
        `Farmer Details: ${JSON.stringify(answers)}`,
        `Target Language: ${targetLang}`,
        '',
        'STRICT RULES:',
        '1. Write in extremely simple, friendly, respectful language suitable for basic rural literacy.',
        '2. Short, punchy sentences.',
        '3. If Hindi or Marathi, use strictly Devanagari script (NO Latin Hinglish).',
        '4. Return ONLY a valid JSON object without markdown code blocks, with exactly these keys:',
        '{',
        '  "reason_text": "1-2 short sentences explaining why they qualify or what is blocking them",',
        '  "next_steps_text": ["Action step 1", "Action step 2", "Action step 3"]',
        '}'
      ].join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text ? response.text.trim() : '';
      if (responseText) {
        const cleaned = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.reason_text && parsed.next_steps_text) {
          return {
            reason_text: parsed.reason_text,
            next_steps_text: Array.isArray(parsed.next_steps_text) ? parsed.next_steps_text : [parsed.next_steps_text],
            source: 'gemini'
          };
        }
      }
    } catch (err) {
      console.warn('[Gemini API Warning]: Could not fetch live explanation, using curated fallback:', err.message);
    }
  }

  // Curated multilingual fallback
  const schemeObj = schemeMap[schemeId];
  if (schemeObj && typeof schemeObj.evaluate === 'function') {
    const evalResult = schemeObj.evaluate(answers);
    const whyObj = evalResult.why || {};
    const stepsObj = evalResult.steps || {};

    return {
      reason_text: whyObj[lang] || whyObj.en || 'Evaluation complete based on your profile.',
      next_steps_text: stepsObj[lang] || stepsObj.en || ['Review eligibility details with local agricultural officer.'],
      source: 'curated'
    };
  }

  return {
    reason_text: blockerReason || 'Your profile was evaluated for this scheme.',
    next_steps_text: ['Visit your nearest Gram Panchayat or CSC center for application assistance.'],
    source: 'default'
  };
}
