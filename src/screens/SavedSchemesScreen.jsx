import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useFarmer } from '../context/FarmerContext';
import { evaluateSchemes } from '../data/schemesData';
import SchemeCard from '../components/SchemeCard';
import { Bookmark, ArrowRight, UserCheck, Sprout, Users, CheckCircle2 } from 'lucide-react';

export default function SavedSchemesScreen({ onNavigateResults, onNavigateProfile }) {
  const { t } = useLanguage();
  const {
    user,
    farmerType,
    landownerDetails,
    landownerDetective,
    landlessDetails,
    landlessDetective,
    bookmarkedSchemes
  } = useFarmer();

  const isLandowner = farmerType === 'landowner';
  const details = isLandowner ? landownerDetails : landlessDetails;
  const detective = isLandowner ? landownerDetective : landlessDetective;

  const evaluated = useMemo(() => {
    return evaluateSchemes(farmerType || 'landowner', { ...details, ...detective });
  }, [farmerType, details, detective]);

  const savedList = evaluated.filter(s => bookmarkedSchemes.includes(s.id));

  return (
    <div className="min-h-screen bg-[#F8F5EE] pb-24 max-w-md mx-auto">
      <div className="p-4 space-y-4 pt-4">
        {/* Top mini-profile banner linking to Profile */}
        <div className="bg-white rounded-3xl p-4 shadow-card border border-emerald-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
              {isLandowner ? <Sprout className="w-6 h-6 text-emerald-800" /> : <Users className="w-6 h-6 text-amber-800" />}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 leading-tight text-sm">
                {user.name || t('farmer', 'Farmer')}
              </h3>
              <p className="text-xs text-emerald-700 font-semibold">
                {isLandowner ? t('landownerBadge', 'Landowner') : t('landlessBadge', 'Landless')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateProfile}
            className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1 transition tap-target"
          >
            <span>{t('myProfileBtn', 'My Profile')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Heading */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Bookmark className="w-4 h-4 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight font-sans">
                {t('savedSchemesTitle', 'Bookmarked Schemes')}
              </h2>
              <p className="text-xs text-gray-500">
                {savedList.length} {t('savedBtn', 'Saved')}
              </p>
            </div>
          </div>
        </div>

        {/* Schemes list or Empty State */}
        {savedList.length > 0 ? (
          <div className="space-y-4 pt-1">
            {savedList.map(scheme => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center shadow-card border border-dashed border-gray-300 space-y-4 my-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <Bookmark className="w-8 h-8 text-amber-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">
                {t('noSavedSchemes', 'No schemes bookmarked yet')}
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                {t('noSavedDesc', 'Tap the bookmark icon on any scheme card on the Matched Schemes page to save schemes here for quick access.')}
              </p>
            </div>
            <button
              type="button"
              onClick={onNavigateResults}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-md inline-flex items-center space-x-2 tap-target transition"
            >
              <span>{t('viewResultsBtn', 'View Matched Schemes')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
