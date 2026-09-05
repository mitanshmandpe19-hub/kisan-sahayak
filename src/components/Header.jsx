import React, { useState } from 'react';
import { useLanguage, availableLanguages } from '../context/LanguageContext';
import { Sprout, Globe, ArrowLeft, Check, X } from 'lucide-react';

export default function Header({ currentScreen, onNavigateBack, showBack = false }) {
  const { language, setLanguage, t } = useLanguage();
  const [langModalOpen, setLangModalOpen] = useState(false);

  const currentLangObj = availableLanguages.find(l => l.code === language) || availableLanguages[0];

  return (
    <>
      <header className="sticky top-0 z-40 bg-emerald-800 text-white shadow-md transition-colors">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {showBack && (
              <button
                type="button"
                onClick={onNavigateBack}
                aria-label={t('backBtn', 'Back')}
                className="p-1.5 -ml-1 rounded-full hover:bg-emerald-700 active:bg-emerald-900 transition-colors flex items-center justify-center tap-target"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-emerald-900 font-bold shadow-inner">
                <Sprout className="w-5 h-5 text-emerald-900" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight tracking-wide font-sans">
                  {t('appName', 'Kisan Sahayak')}
                </h1>
                <p className="text-[11px] text-emerald-200 font-medium leading-none">
                  {t('appSub', 'Scheme Finder')}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLangModalOpen(true)}
            className="flex items-center space-x-1.5 bg-emerald-700/80 hover:bg-emerald-700 active:bg-emerald-900 border border-emerald-600/60 px-2.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition tap-target"
            title={t('changeLangBtn', 'Change Language')}
          >
            <Globe className="w-4 h-4 text-amber-300" />
            <span className="text-white font-medium">{currentLangObj.nativeName}</span>
          </button>
        </div>
      </header>

      {/* Quick Language Switcher Modal */}
      {langModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lang-dialog-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div
            className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 border border-emerald-100"
          >
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-emerald-700" />
                <h2 id="lang-dialog-title" className="text-lg font-bold text-gray-900">
                  {t('languageSelectTitle', 'Choose Language')}
                </h2>
              </div>
              <button
                onClick={() => setLangModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-full tap-target flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 pt-1">
              {availableLanguages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition text-left tap-target ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold'
                        : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div>
                      <div className="text-base font-semibold">{lang.nativeName}</div>
                      <div className="text-xs text-gray-500">{lang.label}</div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
