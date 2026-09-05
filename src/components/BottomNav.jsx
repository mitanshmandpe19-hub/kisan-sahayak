import React, { useState } from 'react';
import { useLanguage, availableLanguages } from '../context/LanguageContext';
import { useFarmer } from '../context/FarmerContext';
import { Home, FileText, Bookmark, UserCheck, Globe, RotateCcw, X, Check } from 'lucide-react';

export default function BottomNav({ currentScreen, onNavigate }) {
  const { language, setLanguage, t } = useLanguage();
  const { bookmarkedSchemes, resetAll } = useFarmer();
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  return (
    <>
      <nav aria-label="Bottom Navigation" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-200/80 shadow-lg">
        <div className="max-w-md mx-auto px-1 h-16 flex items-center justify-around">
          {/* Home / Search */}
          <button
            type="button"
            onClick={() => onNavigate('farmerType')}
            className={`flex flex-col items-center justify-center flex-1 h-full tap-target transition-colors px-0.5 ${
              currentScreen === 'farmerType' || currentScreen.includes('Details') || currentScreen.includes('Detective')
                ? 'text-emerald-700 font-bold'
                : 'text-gray-500 hover:text-emerald-800'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight truncate">{t('homeBtn', 'Home')}</span>
          </button>

          {/* Results / Matched Schemes */}
          <button
            type="button"
            onClick={() => onNavigate('results')}
            className={`flex flex-col items-center justify-center flex-1 h-full tap-target transition-colors px-0.5 ${
              currentScreen === 'results'
                ? 'text-emerald-700 font-bold'
                : 'text-gray-500 hover:text-emerald-800'
            }`}
          >
            <FileText className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight truncate">{t('matchedSchemesNav', 'Matched')}</span>
          </button>

          {/* My Schemes (Bookmarked / Saved) */}
          <button
            type="button"
            onClick={() => onNavigate('saved')}
            className={`flex flex-col items-center justify-center flex-1 h-full tap-target transition-colors px-0.5 ${
              currentScreen === 'saved'
                ? 'text-emerald-700 font-bold'
                : 'text-gray-500 hover:text-emerald-800'
            }`}
          >
            <div className="relative">
              <Bookmark className={`w-5 h-5 mb-0.5 ${currentScreen === 'saved' ? 'fill-emerald-700' : ''}`} />
              {bookmarkedSchemes.length > 0 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-amber-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {bookmarkedSchemes.length}
                </span>
              )}
            </div>
            <span className="text-[10px] leading-tight truncate">{t('mySchemesBtn', 'My Schemes')}</span>
          </button>

          {/* My Profile */}
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className={`flex flex-col items-center justify-center flex-1 h-full tap-target transition-colors px-0.5 ${
              currentScreen === 'profile'
                ? 'text-emerald-700 font-bold'
                : 'text-gray-500 hover:text-emerald-800'
            }`}
          >
            <UserCheck className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight truncate">{t('myProfileBtn', 'My Profile')}</span>
          </button>

          {/* Language Switch */}
          <button
            type="button"
            onClick={() => setLangModalOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full tap-target text-gray-500 hover:text-emerald-800 transition-colors px-0.5"
          >
            <Globe className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight truncate">{t('changeLangBtn', 'Language')}</span>
          </button>

          {/* Reset / Start Over */}
          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full tap-target text-gray-400 hover:text-red-700 transition-colors px-0.5"
          >
            <RotateCcw className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight truncate">{t('logoutBtn', 'Reset')}</span>
          </button>
        </div>
      </nav>

      {/* Language Switcher Modal */}
      {langModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-gray-900">
                  {t('languageSelectTitle', 'Choose Language')}
                </h3>
              </div>
              <button
                onClick={() => setLangModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-full tap-target"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
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
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-gray-200 hover:border-emerald-300 text-gray-700'
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

      {/* Reset Confirmation Modal */}
      {resetModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {t('resetModalTitle', 'Start a New Scheme Search?')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('resetModalSub', 'This will clear all filled answers and take you back to the beginning.')}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold tap-target"
              >
                {t('cancelBtn', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setResetModalOpen(false);
                  resetAll();
                  onNavigate('langSelect');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-semibold shadow-md tap-target"
              >
                {t('confirmReset', 'Yes, Reset')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
