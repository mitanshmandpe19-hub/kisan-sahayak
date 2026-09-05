import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useFarmer } from '../context/FarmerContext';
import StepProgress from '../components/StepProgress';
import {
  ArrowRight,
  Check,
  X,
  ShieldCheck,
  CreditCard,
  FileText,
  FileSpreadsheet,
  Landmark,
  Sprout
} from 'lucide-react';

import { api } from '../services/api';

export default function LandownerDetectiveScreen({ onNext, onBack }) {
  const { language, t } = useLanguage();
  const { user, landownerDetails, landownerDetective, setLandownerDetective, setServerMatchedSchemes } = useFarmer();
  const [answers, setAnswers] = useState({ ...landownerDetective });
  const [loading, setLoading] = useState(false);

  const questions = [
    {
      id: 'kcc',
      text: t('q_kcc', 'Do you have a Kisan Credit Card (KCC)?'),
      hint: t('q_kcc_hint', 'Low-interest institutional credit at 4%'),
      icon: CreditCard
    },
    {
      id: 'aadhaar',
      text: t('q_aadhaar', 'Is your Aadhaar linked to your bank account (DBT)?'),
      hint: t('q_aadhaar_hint', 'Required for direct cash subsidies'),
      icon: FileText
    },
    {
      id: 'landPapers',
      text: t('q_landPapers', 'Do you have land ownership papers (7/12 extract)?'),
      hint: t('q_landPapers_hint', 'Official proof of land title in revenue records'),
      icon: FileSpreadsheet
    },
    {
      id: 'loan',
      text: t('q_loan', "Have you taken a crop loan (are you a 'loanee' farmer)?"),
      hint: t('q_loan_hint', 'Enables automatic insurance coverage'),
      icon: Landmark
    },
    {
      id: 'pmKisan',
      text: t('q_pmKisan', 'Have you applied for PM-KISAN before?'),
      hint: t('q_pmKisan_hint', '₹6,000/yr central direct income support'),
      icon: Sprout
    },
    {
      id: 'insurance',
      text: t('q_insurance', 'Do you currently have crop insurance (PMFBY)?'),
      hint: t('q_insurance_hint', 'Compensates loss from flood, drought, or hail'),
      icon: ShieldCheck
    }
  ];

  const handleToggle = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleFinish = async (e) => {
    e.preventDefault();
    setLandownerDetective(answers);
    const fullAnswers = { ...landownerDetails, ...answers };

    setLoading(true);
    try {
      if (user.id) {
        await api.saveAnswers(user.id, 'landowner', fullAnswers, language);
        const res = await api.matchSchemes(user.id, 'landowner', fullAnswers, language);
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
        <div className="bg-emerald-800 text-white p-4 rounded-3xl shadow-card space-y-1">
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('detectiveTitle', 'Quick Eligibility Questions')}</span>
          </div>
          <h2 className="text-lg font-bold text-white leading-snug">
            {t('detectiveSub', "Answer these 6 simple Yes/No questions to check your exact eligibility")}
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
                className="bg-white rounded-2xl p-4 shadow-card border border-emerald-100/90 space-y-3 transition-all"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <IconComponent className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
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
              className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center space-x-2 transition-transform active:scale-[0.99] tap-target disabled:opacity-60"
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
