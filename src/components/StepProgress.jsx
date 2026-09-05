import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Check } from 'lucide-react';

export default function StepProgress({ currentStep = 1, totalSteps = 3, title = '' }) {
  const { t } = useLanguage();

  const stepLabels = [
    t('stepBasic', 'Basic Details'),
    t('stepDetective', 'Eligibility Check'),
    t('stepResults', 'Matched Schemes')
  ];

  return (
    <nav aria-label="Progress" className="w-full bg-white/90 backdrop-blur-sm border-b border-emerald-100/80 px-4 py-3 shadow-sm">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between text-xs font-semibold text-emerald-950 mb-2">
          <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
            {t('step', 'Step')} {currentStep} {t('of', 'of')} {totalSteps}
          </span>
          <span className="text-gray-700 font-medium">
            {title || stepLabels[currentStep - 1] || ''}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((stepNum) => {
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div key={stepNum} className="space-y-1">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-600'
                      : isCurrent
                      ? 'bg-amber-500 ring-2 ring-amber-300/60'
                      : 'bg-gray-200'
                  }`}
                />
                <div className="flex items-center space-x-1">
                  {isCompleted ? (
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  ) : null}
                  <p
                    className={`text-[10px] truncate leading-tight ${
                      isCurrent
                        ? 'font-bold text-amber-900'
                        : isCompleted
                        ? 'font-medium text-emerald-800'
                        : 'text-gray-400'
                    }`}
                  >
                    {stepLabels[stepNum - 1]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
