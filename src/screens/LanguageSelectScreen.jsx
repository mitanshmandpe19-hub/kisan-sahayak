import React, { useState } from 'react';
import { useLanguage, availableLanguages } from '../context/LanguageContext';
import { Sprout, Check, ArrowRight, Wheat } from 'lucide-react';

export default function LanguageSelectScreen({ onNext }) {
  const { language, setLanguage, t } = useLanguage();
  const [selected, setSelected] = useState(language);

  const handleSelect = (code) => {
    setSelected(code);
    setLanguage(code);
  };

  const handleContinue = () => {
    setLanguage(selected);
    onNext();
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] flex flex-col justify-between p-5 max-w-md mx-auto">
      {/* Top Banner */}
      <div className="pt-6 text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-400 text-emerald-950 shadow-md ring-8 ring-amber-100/60 mb-2">
          <Wheat className="w-10 h-10 text-emerald-900" />
        </div>

        <div className="space-y-1">
          <div className="text-amber-700 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>{t('namaste', 'Namaste')}</span>
            <Sprout className="w-4 h-4 text-emerald-700" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {t('appName', 'Kisan Sahayak')}
          </h1>
          <p className="text-gray-600 text-sm font-medium max-w-xs mx-auto">
            {t('appSub', 'Government Scheme Eligibility Finder')}
          </p>
        </div>
      </div>

      {/* Language Selection Cards */}
      <div className="my-8 space-y-4">
        <div className="text-center mb-2">
          <h2 className="text-lg font-bold text-gray-900">
            {t('languageSelectTitle', 'Choose Your Preferred Language')}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {t('languageSelectSub', 'You can change this anytime from the top bar.')}
          </p>
        </div>

        <div className="space-y-3">
          {availableLanguages.map((lang) => {
            const isCurrent = selected === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-150 tap-target text-left ${
                  isCurrent
                    ? 'border-emerald-600 bg-white shadow-md ring-2 ring-emerald-500/30'
                    : 'border-gray-200 bg-white/70 hover:bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold ${
                      isCurrent
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {lang.code === 'en' ? 'A' : lang.code === 'hi' ? '?' : '?'}
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900 leading-tight">
                      {lang.nativeName}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      {lang.label} ? {lang.greeting}
                    </div>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isCurrent
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {isCurrent && <Check className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div className="pb-4">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center space-x-2 transition-transform active:scale-[0.99] tap-target"
        >
          <span>{t('continueBtn', 'Continue')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
