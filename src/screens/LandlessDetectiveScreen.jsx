import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useFarmer } from '../context/FarmerContext';
import StepProgress from '../components/StepProgress';
import {
  ArrowRight,
  Check,
  X,
  ShieldCheck,
  BadgeCheck,
  HardHat,
  FileText,
  FileCheck,
  Landmark
} from 'lucide-react';

import { api } from '../services/api';

export default function LandlessDetectiveScreen({ onNext, onBack }) {
  const { language, t } = useLanguage();
  const { user, landlessDetails, landlessDetective, setLandlessDetective, setServerMatchedSchemes } = useFarmer();
  const [answers, setAnswers] = useState({ ...landlessDetective });
  const [loading, setLoading] = useState(false);

  const questions = [
    {
      id: 'eshram',
      text: t('q_eshram', 'Do you have an e-Shram card?'),
      hint: t('q_eshram_hint', 'National identity card with ₹2 Lakh accident cover'),
      icon: BadgeCheck
    },
    {
      id: 'mgnrega',
      text: t('q_mgnrega', 'Do you have a job card under MGNREGA?'),
      hint: t('q_mgnrega_hint', 'Guarantees 100 days of paid wage employment per year'),
      icon: HardHat
    },
    {
      id: 'aadhaar',
      text: t('q_aadhaar_landless', 'Is your Aadhaar linked to your bank account?'),
      hint: t('q_aadhaar_landless_hint', 'Wages & benefits are transferred directly to your bank'),
      icon: FileText
    },
    {
      id: 'sharecropper',
      text: t('q_sharecropper', 'Are you registered as a sharecropper in any government record?'),
      hint: t('q_sharecropper_hint', 'Proves you cultivate land under tenancy or crop-share'),
      icon: FileCheck
    },
    {
      id: 'ownBank',
      text: t('q_ownBank', 'Do you have a bank account in your own name?'),
      hint: t('q_ownBank_hint', 'Active savings account in any rural or commercial bank'),
      icon: Landmark
    }
  ];

  const handleToggle = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleFinish = async (e) => {
    e.preventDefault();
    setLandlessDetective(answers);
    const fullAnswers = { ...landlessDetails, ...answers };

    setLoading(true);
    try {
      if (user.id) {
        await api.saveAnswers(user.id, 'landless', fullAnswers, language);
        const res = await api.matchSchemes(user.id, 'landless', fullAnswers, language);
        if (res && res.success && res.schemes) {
          setServerMatchedSchemes(res.schemes);
        }
      }
    } catch (err) {
      console.warn('Backend match call error:', err);
    } finally {
      setLoading(false);
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] pb-24 max-w-md mx-auto">
      <StepProgress currentStep={2} totalSteps={3} title={t('stepDetective', 'Eligibility Check')} />

      <div className="p-4 space-y-4">
        {/* Banner */}
        <div className="bg-amber-700 text-white p-4 rounded-3xl shadow-card space-y-1">
          <div className="flex items-center space-x-2 text-amber-200 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('detectiveLandlessTitle', 'Laborer Welfare Check')}</span>
          </div>
          <h2 className="text-lg font-bold text-white leading-snug">
            {t('detectiveLandlessSub', 'Answer these 5 quick questions to unlock financial aid and social security')}
          </h2>
        </div>

        {/* Question Cards */}
        <form onSubmit={handleFinish} className="space-y-3">
          {questions.map((q, idx) => {
            const currentVal = answers[q.id];
            const isYes = currentVal === 'yes';
            const isNo = currentVal === 'no';
            const IconComponent = q.icon;

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-4 shadow-card border border-amber-100/90 space-y-3 transition-all"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <IconComponent className="w-5 h-5 text-amber-800" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                      Q{idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 leading-snug">
                      {q.text}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 leading-tight">
                      {q.hint}
                    </p>
                  </div>
                </div>

                {/* Yes/No Toggle Pill Pair */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleToggle(q.id, 'yes')}
                    className={`py-2.5 px-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-1.5 transition-all border-2 tap-target ${
                      isYes
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-[1.02]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <Check className={`w-4 h-4 ${isYes ? 'text-white' : 'text-gray-400'}`} />
                    <span>{t('yes', 'Yes')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggle(q.id, 'no')}
                    className={`py-2.5 px-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-1.5 transition-all border-2 tap-target ${
                      isNo
                        ? 'bg-amber-600 text-white border-amber-700 shadow-md scale-[1.02]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <X className={`w-4 h-4 ${isNo ? 'text-white' : 'text-gray-400'}`} />
                    <span>{t('no', 'No')}</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Submit / View Results Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center space-x-2 transition-transform active:scale-[0.99] tap-target disabled:opacity-60"
            >
              <span>{loading ? t('loading', 'Matching Schemes...') : t('viewResultsBtn', 'View Matched Schemes')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
