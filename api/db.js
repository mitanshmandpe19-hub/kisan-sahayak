import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.TURSO_DATABASE_URL || 'file:database.sqlite';
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db = createClient({
  url,
  authToken: authToken || undefined,
});

let dbInitialized = false;

export async function initDB() {
  if (dbInitialized) return;

  try {
    // 1. Create tables
    await db.batch([
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone_number TEXT UNIQUE NOT NULL,
        name TEXT,
        preferred_language TEXT DEFAULT 'en',
        farmer_type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS user_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        question_key TEXT NOT NULL,
        answer_value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, question_key)
      )`,
      `CREATE TABLE IF NOT EXISTS schemes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        level TEXT NOT NULL,
        farmer_type TEXT NOT NULL,
        benefit_summary TEXT NOT NULL,
        eligibility_rules TEXT NOT NULL,
        official_link TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS user_matched_schemes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        scheme_id TEXT NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
        status TEXT NOT NULL,
        reason_text TEXT,
        next_steps_text TEXT,
        language TEXT NOT NULL DEFAULT 'en',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, scheme_id, language)
      )`
    ], 'write');

    // 2. Seed schemes if needed
    await seedSchemes();
    dbInitialized = true;
    console.log('✓ Turso Database initialized and verified.');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

async function seedSchemes() {
  const countRes = await db.execute('SELECT COUNT(*) as total FROM schemes');
  const total = Number(countRes.rows[0]?.total || 0);
  if (total >= 9) {
    return;
  }

  const schemes = [
    {
      id: 'pm-kisan',
      name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      level: 'Central',
      farmer_type: 'landowner',
      benefit_summary: '₹6,000/year direct cash transfer in 3 equal installments of ₹2,000',
      official_link: 'https://pmkisan.gov.in',
      eligibility_rules: JSON.stringify({
        schemeId: 'pm-kisan',
        required: { landPapers: 'yes' },
        qualify: { landPapers: 'yes', aadhaar: 'yes', pmKisan: 'yes' },
        blockers: [
          { field: 'landPapers', expected: 'yes', blockerKey: 'no_land_papers', reason: 'Land ownership records (7/12 extract) required' },
          { field: 'aadhaar', expected: 'yes', blockerKey: 'aadhaar_not_linked', reason: 'Aadhaar not linked to bank account (DBT disabled)' },
          { field: 'pmKisan', expected: 'yes', blockerKey: 'not_applied', reason: 'Application not yet registered on PM-KISAN portal' }
        ]
      })
    },
    {
      id: 'namo-shetkari',
      name: 'Namo Shetkari Mahasanman Nidhi Yojana',
      level: 'Maharashtra',
      farmer_type: 'landowner',
      benefit_summary: 'Additional ₹6,000/year state top-up for Maharashtra farmers',
      official_link: 'https://mahadbt.maharashtra.gov.in',
      eligibility_rules: JSON.stringify({
        schemeId: 'namo-shetkari',
        required: { state: 'Maharashtra', landPapers: 'yes' },
        qualify: { state: 'Maharashtra', landPapers: 'yes', aadhaar: 'yes', pmKisan: 'yes' },
        blockers: [
          { field: 'state', expected: 'Maharashtra', blockerKey: 'other_state', reason: 'Only applicable for farmers in Maharashtra' },
          { field: 'landPapers', expected: 'yes', blockerKey: 'no_land_papers', reason: 'Land ownership papers required' },
          { field: 'aadhaar', expected: 'yes', blockerKey: 'aadhaar_not_linked', reason: 'Aadhaar DBT linking pending at bank' },
          { field: 'pmKisan', expected: 'yes', blockerKey: 'pm_kisan_pending', reason: 'Must be receiving PM-KISAN installments to qualify for state top-up' }
        ]
      })
    },
    {
      id: 'pmfby',
      name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
      level: 'Central',
      farmer_type: 'landowner',
      benefit_summary: 'Comprehensive crop insurance against droughts, floods, and unseasonal rains',
      official_link: 'https://pmfby.gov.in',
      eligibility_rules: JSON.stringify({
        schemeId: 'pmfby',
        required: { landPapers: 'yes' },
        qualify: { landPapers: 'yes', insurance: 'yes' },
        blockers: [
          { field: 'insurance', expected: 'yes', blockerKey: 'no_insurance', reason: 'Currently not enrolled in active crop insurance protection' },
          { field: 'landPapers', expected: 'yes', blockerKey: 'no_land_papers', reason: 'Land ownership records required for insurance verification' }
        ]
      })
    },
    {
      id: 'kcc',
      name: 'Kisan Credit Card (KCC)',
      level: 'Central',
      farmer_type: 'landowner',
      benefit_summary: 'Subsidized crop credit up to ₹3 Lakh at 4% interest rate upon timely repayment',
      official_link: 'https://myscheme.gov.in/schemes/kcc',
      eligibility_rules: JSON.stringify({
        schemeId: 'kcc',
        required: { landPapers: 'yes' },
        qualify: { landPapers: 'yes', kcc: 'yes' },
        blockers: [
          { field: 'kcc', expected: 'yes', blockerKey: 'no_kcc', reason: 'Has not yet applied for or activated Kisan Credit Card' }
        ]
      })
    },
    {
      id: 'pm-kusum',
      name: 'PM-KUSUM Solar Pump Scheme',
      level: 'Central',
      farmer_type: 'landowner',
      benefit_summary: 'Up to 90% government subsidy for standalone solar agricultural water pumps',
      official_link: 'https://pmkusum.mnre.gov.in',
      eligibility_rules: JSON.stringify({
        schemeId: 'pm-kusum',
        required: { minLandSize: 1.0 },
        qualify: { minLandSize: 1.0 },
        blockers: [
          { field: 'landSize', min: 1.0, blockerKey: 'land_too_small', reason: 'Requires at least 1 acre of farming land' }
        ]
      })
    },
    {
      id: 'eshram',
      name: 'e-Shram Card Registration & Social Security',
      level: 'Central',
      farmer_type: 'landless',
      benefit_summary: 'National identity for unorganized workers with ₹2 Lakh free accidental insurance',
      official_link: 'https://eshram.gov.in',
      eligibility_rules: JSON.stringify({
        schemeId: 'eshram',
        required: { minAge: 16, maxAge: 59 },
        qualify: { minAge: 16, maxAge: 59, eshram: 'yes' },
        blockers: [
          { field: 'eshram', expected: 'yes', blockerKey: 'no_eshram', reason: 'Not registered on e-Shram portal — primary gateway for all labor welfare' },
          { field: 'age', min: 16, max: 59, blockerKey: 'age_ineligible', reason: 'Age must be between 16 and 59 years' }
        ]
      })
    },
    {
      id: 'mgnrega',
      name: 'MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act)',
      level: 'Central',
      farmer_type: 'landless',
      benefit_summary: 'Guaranteed 100 days of wage employment per rural household per financial year',
      official_link: 'https://nrega.nic.in',
      eligibility_rules: JSON.stringify({
        schemeId: 'mgnrega',
        required: { minAge: 18 },
        qualify: { minAge: 18, mgnrega: 'yes' },
        blockers: [
          { field: 'mgnrega', expected: 'yes', blockerKey: 'no_mgnrega', reason: 'Has not yet applied for Job Card at local Gram Panchayat' }
        ]
      })
    },
    {
      id: 'pm-sym',
      name: 'PM-SYM (Pradhan Mantri Shram Yogi Maan-dhan) Pension',
      level: 'Central',
      farmer_type: 'landless',
      benefit_summary: 'Assured lifelong pension of ₹3,000/month after attaining age 60',
      official_link: 'https://maandhan.in',
      eligibility_rules: JSON.stringify({
        schemeId: 'pm-sym',
        required: { minAge: 18, maxAge: 40 },
        qualify: { minAge: 18, maxAge: 40, eshram: 'yes' },
        blockers: [
          { field: 'eshram', expected: 'yes', blockerKey: 'no_eshram_first', reason: 'Must possess an active e-Shram card before PM-SYM pension enrollment' },
          { field: 'age', min: 18, max: 40, blockerKey: 'age_over_limit', reason: 'Entry age must be between 18 and 40 years' }
        ]
      })
    },
    {
      id: 'landless-labourer-mh',
      name: 'Maharashtra Landless Labourer Land-Purchase Subsidy (Karmaveer Dadasaheb Gaikwad Scheme)',
      level: 'Maharashtra',
      farmer_type: 'landless',
      benefit_summary: '100% government grant to purchase up to 4 acres dryland or 2 acres irrigated land',
      official_link: 'https://sjsa.maharashtra.gov.in',
      eligibility_rules: JSON.stringify({
        schemeId: 'state-landless',
        required: { state: 'Maharashtra', category: 'SC' },
        qualify: { state: 'Maharashtra', category: 'SC' },
        blockers: [
          { field: 'state', expected: 'Maharashtra', blockerKey: 'other_state', reason: 'Only for agricultural laborers in Maharashtra state' },
          { field: 'category', expected: 'SC', blockerKey: 'not_sc_category', reason: 'Specifically reserved for Scheduled Caste (SC) landless farm workers' }
        ]
      })
    }
  ];

  const batchInserts = schemes.map(s => ({
    sql: `INSERT OR REPLACE INTO schemes (id, name, level, farmer_type, benefit_summary, eligibility_rules, official_link)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [s.id, s.name, s.level, s.farmer_type, s.benefit_summary, s.eligibility_rules, s.official_link]
  }));

  await db.batch(batchInserts, 'write');
  console.log('✓ Seeded 9 schemes to Turso database successfully.');
}

export default db;
