import db from '../db.js';

export function matchSchemes(farmerType, answers = {}) {
  const type = farmerType || 'landowner';
  const schemes = db.prepare('SELECT * FROM schemes WHERE farmer_type = ?').all(type);

  return schemes.map(scheme => {
    const rules = JSON.parse(scheme.eligibility_rules);
    const evaluation = evaluateSchemeRules(scheme.id, rules, answers);

    return {
      id: scheme.id,
      name: scheme.name,
      level: scheme.level,
      farmer_type: scheme.farmer_type,
      benefit_summary: scheme.benefit_summary,
      official_link: scheme.official_link,
      status: evaluation.status,
      blockerReason: evaluation.blockerReason
    };
  });
}

export function evaluateSchemeRules(schemeId, rules, answers = {}) {
  const landPapers = (answers.landPapers || answers.has_land_papers || 'no').toLowerCase();
  const aadhaar = (answers.aadhaar || answers.aadhaar_linked || 'no').toLowerCase();
  const pmKisan = (answers.pmKisan || answers.applied_pm_kisan || 'no').toLowerCase();
  const insurance = (answers.insurance || answers.has_crop_insurance || 'no').toLowerCase();
  const kcc = (answers.kcc || answers.has_kcc || 'no').toLowerCase();
  const landSize = parseFloat(answers.landSize || answers.land_size || 0);
  const state = answers.state || 'Maharashtra';
  const age = parseInt(answers.age || 40, 10);
  const category = answers.category || 'General';
  const eshram = (answers.eshram || answers.has_eshram || 'no').toLowerCase();
  const mgnrega = (answers.mgnrega || answers.has_mgnrega || 'no').toLowerCase();

  switch (schemeId) {
    case 'pm-kisan':
      if (landPapers === 'yes' && aadhaar === 'yes' && pmKisan === 'yes') {
        return { status: 'qualifies', blockerReason: null };
      }
      if (landPapers === 'yes') {
        const blocker = aadhaar !== 'yes'
          ? 'Your Aadhaar is not linked to your bank account (DBT is disabled).'
          : 'Your registration is not completed on the PM-KISAN portal.';
        return { status: 'missing_out', blockerReason: blocker };
      }
      return { status: 'missing_out', blockerReason: 'Updated 7/12 land records are required to claim agricultural cash transfers.' };

    case 'namo-shetkari':
      if (state !== 'Maharashtra') {
        return { status: 'missing_out', blockerReason: 'This top-up benefit is exclusively available for Maharashtra residents.' };
      }
      if (landPapers === 'yes' && aadhaar === 'yes' && pmKisan === 'yes') {
        return { status: 'qualifies', blockerReason: null };
      }
      return { status: 'missing_out', blockerReason: 'Must qualify and receive PM-KISAN installments to receive this additional ₹6,000 state grant.' };

    case 'pmfby':
      if (insurance === 'yes') {
        return { status: 'qualifies', blockerReason: null };
      }
      return { status: 'missing_out', blockerReason: 'You currently have no active crop insurance policy against weather losses.' };

    case 'kcc':
      if (kcc === 'yes') {
        return { status: 'qualifies', blockerReason: null };
      }
      return { status: 'missing_out', blockerReason: 'You have not yet applied for a Kisan Credit Card to access low-interest 4% crop loans.' };

    case 'pm-kusum':
      if (landSize >= 1.0) {
        return { status: 'qualifies', blockerReason: null };
      }
      return { status: 'missing_out', blockerReason: 'Minimum 1.0 acre of cultivable farmland is needed for solar pump subsidies.' };

    case 'eshram':
      if (eshram === 'yes') {
        return { status: 'qualifies', blockerReason: null };
      }
      return { status: 'missing_out', blockerReason: 'You do not have an e-Shram card, which is the foundational national ID for all worker schemes.' };

    case 'mgnrega':
      if (mgnrega === 'yes') {
        return { status: 'qualifies', blockerReason: null };
      }
      return { status: 'missing_out', blockerReason: 'You have not yet applied for an MGNREGA Job Card at your local Gram Panchayat.' };

    case 'pm-sym':
    case 'pmsym':
      if (eshram === 'yes' && age >= 18 && age <= 40) {
        return { status: 'qualifies', blockerReason: null };
      }
      if (eshram !== 'yes') {
        return { status: 'missing_out', blockerReason: 'An active e-Shram card is mandatory before you can enroll in PM-SYM pension.' };
      }
      return { status: 'missing_out', blockerReason: 'Entry age must be between 18 and 40 years for PM-SYM pension.' };

    case 'landless-labourer-mh':
    case 'state-landless':
      if (state === 'Maharashtra' && category === 'SC') {
        return { status: 'qualifies', blockerReason: null };
      }
      return { status: 'missing_out', blockerReason: 'This 100% land purchase subsidy is specifically reserved for SC agricultural laborers in Maharashtra.' };

    default:
      return { status: 'qualifies', blockerReason: null };
  }
}
