import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useFarmer } from '../context/FarmerContext';
import { evaluateSchemes } from '../data/schemesData';
import SchemeCard from '../components/SchemeCard';
import {
  User,
  Share2,
  Edit3,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  Wheat,
  RotateCcw,
  Check,
  Coins,
  Sprout,
  Users
} from 'lucide-react';

export default function ProfileSummaryScreen({ onEditAnswers, onReset }) {
  const { language, t } = useLanguage();
  const {
    user,
    farmerType,
    landownerDetails,
    landownerDetective,
    landlessDetails,
    landlessDetective,
    bookmarkedSchemes,
    serverMatchedSchemes,
    loadUserProfile
  } = useFarmer();

  const [shareToast, setShareToast] = useState(false);

  // Sync profile on mount if user.id is set
  useEffect(() => {
    if (user?.id && typeof loadUserProfile === 'function') {
      loadUserProfile(user.id);
    }
  }, [user?.id]);

  // Active form data
  const isLandowner = farmerType === 'landowner';
  const details = isLandowner ? (landownerDetails || {}) : (landlessDetails || {});
  const detective = isLandowner ? (landownerDetective || {}) : (landlessDetective || {});

  const evaluated = useMemo(() => {
    if (serverMatchedSchemes && serverMatchedSchemes.length > 0) {
      return serverMatchedSchemes;
    }
    return evaluateSchemes(farmerType || 'landowner', { ...details, ...detective });
  }, [serverMatchedSchemes, farmerType, details, detective]);

  const bookmarkedList = (evaluated || []).filter(s => (bookmarkedSchemes || []).includes(s.id));
  const qualifyList = (evaluated || []).filter(s => s.status === 'qualify' || s.status === 'qualifies');
  const missingList = (evaluated || []).filter(s => s.status === 'missing' || s.status === 'missing_out');

  const handleShareWhatsApp = () => {
    const qualifyNames = qualifyList
      .map(s => (typeof s.name === 'object' ? (s.name?.[language] || s.name?.en || '') : s.name || s.id))
      .filter(Boolean)
      .join(', ');
    const missingNames = missingList
      .map(s => (typeof s.name === 'object' ? (s.name?.[language] || s.name?.en || '') : s.name || s.id))
      .filter(Boolean)
      .join(', ');

    const message =
      `I checked my eligibility on Kisan Sahayak!\n\n` +
      `Farmer: ${user?.name || 'Farmer'} (${isLandowner ? 'Landowner' : 'Agricultural Laborer'})\n` +
      `Location: ${details?.district || 'Maharashtra'}, ${details?.state || 'India'}\n\n` +
      (qualifyList.length > 0 ? `I qualify for (${qualifyList.length}): ${qualifyNames}\n\n` : '') +
      (missingList.length > 0 ? `Action needed to unlock (${missingList.length}): ${missingNames}\n\n` : '') +
      `Check your farmer schemes too on Kisan Sahayak!`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setShareToast(true);
    setTimeout(() => setShareToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] pb-24 max-w-md mx-auto">
      <div className="p-4 space-y-4 pt-4">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-emerald-100 space-y-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              {user.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-1.5">
                <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                  {user.name || t('farmer', 'Farmer')}
                </h2>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                +91 {user.phone || '9876543210'}
              </p>
              <div className="mt-1.5 inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                {isLandowner ? (
                  <Sprout className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                ) : (
                  <Users className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                )}
                <span>{isLandowner ? t('landownerBadge', 'Landowner') : t('landlessBadge', 'Landless')}</span>
              </div>
            </div>
          </div>

          {/* Quick specs grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
            <div className="bg-gray-50 p-2.5 rounded-xl">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">{t('districtLabel', 'District')}</span>
              <span className="font-bold text-gray-800">{details?.district || 'Maharashtra'}</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-xl">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">{t('ageLabel', 'Age')}</span>
              <span className="font-bold text-gray-800">{details?.age || '40'} Years</span>
            </div>
            {isLandowner ? (
              <>
                <div className="bg-gray-50 p-2.5 rounded-xl">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">{t('landSizeLabel', 'Landholding')}</span>
                  <span className="font-bold text-gray-800">{landownerDetails?.landSize || '3.5'} Acres</span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">{t('cropsLabel', 'Crops')}</span>
                  <span className="font-bold text-gray-800 truncate block">
                    {Array.isArray(landownerDetails?.crops) ? landownerDetails.crops.join(', ') : (landownerDetails?.crops || 'Wheat, Soybean')}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-50 p-2.5 rounded-xl col-span-2">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">{t('workTypeLabel', 'Work Type')}</span>
                  <span className="font-bold text-gray-800">{t(landlessDetails?.workType || 'workFarmLabor', 'Agricultural Laborer')}</span>
                </div>
              </>
            )}
          </div>

          {/* Share and Edit Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-3 rounded-2xl font-bold text-sm shadow-md flex items-center justify-center space-x-1.5 transition tap-target"
            >
              <Share2 className="w-4 h-4" />
              <span>{t('shareWhatsAppBtn', 'WhatsApp')}</span>
            </button>

            <button
              type="button"
              onClick={onEditAnswers}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-3 rounded-2xl font-bold text-sm border border-gray-200 flex items-center justify-center space-x-1.5 transition tap-target"
            >
              <Edit3 className="w-4 h-4 text-gray-600" />
              <span>{t('editBtn', 'Edit Answers')}</span>
            </button>
          </div>

          {shareToast && (
            <p className="text-xs text-center text-emerald-800 font-bold bg-emerald-50 py-1.5 rounded-xl animate-in fade-in flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{t('shareToast', 'WhatsApp share link opened!')}</span>
            </p>
          )}
        </div>

        {/* Bookmarked Schemes Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="font-bold text-lg text-gray-900">
                {t('savedSchemesTitle', 'Bookmarked Schemes')}
              </h3>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
              {bookmarkedList.length}
            </span>
          </div>

          {bookmarkedList.length > 0 ? (
            <div className="space-y-3">
              {bookmarkedList.map(scheme => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 text-center shadow-card border border-dashed border-gray-300 space-y-2">
              <Bookmark className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                {t('noSavedSchemes', 'No schemes bookmarked yet. Tap the bookmark icon on any scheme card to save it here.')}
              </p>
            </div>
          )}
        </div>

        {/* All Matched Schemes Section */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-lg text-gray-900">
              {t('matchedSchemesTitle', 'All Evaluated Schemes')}
            </h3>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
              {evaluated.length}
            </span>
          </div>

          <div className="space-y-3">
            {evaluated.map(scheme => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        </div>

        {/* Start Over Button */}
        <div className="pt-6">
          <button
            type="button"
            onClick={onReset}
            className="w-full bg-white hover:bg-red-50 text-red-700 border border-red-200 py-3.5 px-4 rounded-2xl font-bold text-sm shadow-sm flex items-center justify-center space-x-2 tap-target transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('logoutBtn', 'Start Over / New Search')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
