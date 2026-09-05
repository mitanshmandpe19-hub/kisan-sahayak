import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useFarmer } from '../context/FarmerContext';
import { ChevronRight, ArrowRight, Sprout, Users, Sparkles } from 'lucide-react';

export default function FarmerTypeScreen({ onSelectType }) {
  const { t } = useLanguage();
  const { user, setFarmerType } = useFarmer();

  const handleSelect = (type) => {
    setFarmerType(type);
    onSelectType(type);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] flex flex-col justify-between p-5 max-w-md mx-auto">
      <div className="pt-4 space-y-5">
        {/* Personalized greeting */}
        <div className="bg-amber-100/70 border border-amber-200/80 rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-950" />
            </div>
            <span className="text-sm font-bold text-amber-950">
              {t('namaste', 'Namaste')}, {user.name || t('farmer', 'Farmer')}!
            </span>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-white/90 px-2.5 py-1 rounded-full border border-emerald-200 shadow-sm">
            {t('step', 'Step')} 1 {t('of', 'of')} 3
          </span>
        </div>

        {/* Heading */}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight font-sans">
            {t('farmerTypeTitle', 'Tell us about yourself')}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed font-normal">
            {t('farmerTypeSub', 'Select the option that best matches your agricultural work:')}
          </p>
        </div>

        {/* The Two Big Tappable Cards */}
        <div className="space-y-4 pt-2">
          {/* Card A: Landowner */}
          <button
            type="button"
            onClick={() => handleSelect('landowner')}
            className="w-full text-left bg-white rounded-3xl p-5 border-2 border-emerald-200 hover:border-emerald-600 active:border-emerald-700 shadow-card hover:shadow-card-hover transition-all duration-200 tap-target group active:scale-[0.98]"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors text-emerald-800 flex items-center justify-center shrink-0 shadow-inner">
                <Sprout className="w-9 h-9" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-1">
                  {t('pathATag', 'Landowner Path')}
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-800 transition-colors leading-snug">
                  {t('landownerTitle', 'I own farming land')}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {t('landownerSub', 'Landowner farmer with 7/12 extract or title deeds in family / own name.')}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-emerald-100 flex items-center justify-center shrink-0 self-center transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-700" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-emerald-800 font-semibold">
              <span>PM-KISAN, Namo Shetkari, PMFBY, KCC, Solar Pump</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Card B: Landless */}
          <button
            type="button"
            onClick={() => handleSelect('landless')}
            className="w-full text-left bg-white rounded-3xl p-5 border-2 border-amber-200 hover:border-amber-600 active:border-amber-700 shadow-card hover:shadow-card-hover transition-all duration-200 tap-target group active:scale-[0.98]"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-colors text-amber-800 flex items-center justify-center shrink-0 shadow-inner">
                <Users className="w-9 h-9" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="inline-block px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wider mb-1">
                  {t('pathBTag', 'Laborer / Landless Path')}
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-800 transition-colors leading-snug">
                  {t('landlessTitle', "I work on someone else's land / I have no land")}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {t('landlessSub', 'Agricultural laborer, tenant farmer, sharecropper, or seasonal worker.')}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-amber-100 flex items-center justify-center shrink-0 self-center transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-700" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-amber-900 font-semibold">
              <span>e-Shram Card, MGNREGA, PM-SYM Pension, Land-Purchase Grant</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      <div className="text-center py-4 text-xs text-gray-400">
        Choose either category • You can switch anytime from the menu
      </div>
    </div>
  );
}
