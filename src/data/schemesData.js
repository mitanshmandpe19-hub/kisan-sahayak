import { landownerSchemes } from './landownerSchemes';
import { landlessSchemes } from './landlessSchemes';

export { landownerSchemes, landlessSchemes };

export const maharashtraDistricts = [
  'Ahmednagar (Ahilyanagar)',
  'Akola',
  'Amravati',
  'Chhatrapati Sambhajinagar (Aurangabad)',
  'Beed',
  'Bhandara',
  'Buldhana',
  'Chandrapur',
  'Dhule',
  'Gadchiroli',
  'Gondia',
  'Hingoli',
  'Jalgaon',
  'Jalna',
  'Kolhapur',
  'Latur',
  'Mumbai City',
  'Mumbai Suburban',
  'Nagpur',
  'Nanded',
  'Nandurbar',
  'Nashik',
  'Dharashiv (Osmanabad)',
  'Palghar',
  'Parbhani',
  'Pune',
  'Raigad',
  'Ratnagiri',
  'Sangli',
  'Satara',
  'Sindhudurg',
  'Solapur',
  'Thane',
  'Wardha',
  'Washim',
  'Yavatmal'
];

export const indianStates = [
  'Maharashtra',
  'Madhya Pradesh',
  'Gujarat',
  'Karnataka',
  'Andhra Pradesh',
  'Telangana',
  'Rajasthan',
  'Uttar Pradesh',
  'Punjab',
  'Haryana',
  'Other State'
];

export function evaluateSchemes(farmerType, answers) {
  const schemeList = farmerType === 'landowner' ? landownerSchemes : landlessSchemes;
  return schemeList.map(scheme => {
    const evaluation = scheme.evaluate(answers);
    return {
      ...scheme,
      status: evaluation.status,
      why: evaluation.why,
      steps: evaluation.steps
    };
  });
}
