import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useFarmer } from '../context/FarmerContext';
import { evaluateSchemes } from '../data/schemesData';
import StepProgress from '../components/StepProgress';
import SchemeCard from '../components/SchemeCard';
import { api } from '../services/api';
import { UserCheck, Sparkles, SlidersHorizontal, ArrowRight, Share2, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

export default function ResultsScreen({ onNavigateProfile, onEditAnswers }) {
  const { language, t } = useLanguage();
  const {
    farmerType,
    landownerDetails,
    landownerDetective,
    landlessDetails,
    landlessDetective,
    user,
    serverMatchedSchemes,
    setServerMatchedSchemes
  } = useFarmer();
  const [filter, setFilter] = useState('all'); // 'all' | 'qualify' | 'missing'
  const [loading, setLoading] = useState(false);

  // Determine current active answers based on farmerType
  const currentAnswers = useMemo(() => {
    if (farmerType === 'landowner') {
      return { ...landownerDetails, ...landownerDetective };
    } else {
      return { ...landlessDetails, ...landlessDetective };
    }
  }, [farmerType, landownerDetails, landownerDetective, landlessDetails, landlessDetective]);

  // Load from backend if not already loaded
  useEffect(() => {
    async function fetchBackendMatches() {
      if (!serverMatchedSchemes || serverMatchedSchemes.length === 0) {
        setLoading(true);
        try {
          const res = await api.matchSchemes(user.id, farmerType || 'landowner', currentAnswers, language);
          if (res && res.success && res.schemes && res.schemes.length > 0) {
            setServerMatchedSchemes(res.schemes);
          }
        } catch (err) {
          console.warn('Could not load backend matches:', err);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchBackendMatches();
  }, [user.id, farmerType, currentAnswers, language]);

  // Use server evaluated schemes if present, otherwise fallback
  const evaluatedSchemes = useMemo(() => {
    if (serverMatchedSchemes && serverMatchedSchemes.length > 0) {
      return serverMatchedSchemes;
    }
    return evaluateSchemes(farmerType || 'landowner', currentAnswers);
  }, [serverMatchedSchemes, farmerType, currentAnswers]);

  const qualifyCount = evaluatedSchemes.filter(s => s.status === 'qualify' || s.status === 'qualifies').length;
  const missingCount = evaluatedSchemes.filter(s => s.status === 'missing' || s.status === 'missing_out').length;

  const filteredSchemes = useMemo(() => {
    if (filter === 'qualify') return evaluatedSchemes.filter(s => s.status === 'qualify' || s.status === 'qualifies');
    if (filter === 'missing') return evaluatedSchemes.filter(s => s.status === 'missing' || s.status === 'missing_out');
    return evaluatedSchemes;
  }, [evaluatedSchemes, filter]);

  return (
    <div className="min-h-screen bg-[#F8F5EE] pb-24 max-w-md mx-auto">
      <StepProgress currentStep={3} totalSteps={3} title={t('stepResults', 'Matched Schemes')} />

      <div className="p-4 space-y-4">
        {/* Top Summary Banner */}
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-5 rounded-3xl shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider bg-amber-400 text-emerald-950 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{farmerType === 'landowner' ? t('landownerBadge', 'Landowner') : t('landlessBadge', 'Landless')}</span>
            </span>
            <span className="text-xs text-emerald-200">
              {evaluatedSchemes.length} {t('schemesFound', 'Schemes Evaluated')}
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold leading-tight">
              {t('resultsTitle', "Here's what we found for you")}
            </h2>
            <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
              {t('resultsSub', 'Based on your answers, here are schemes you qualify for or can unlock.')}
            </p>
          </div>

          {/* Quick Counter Badges */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setFilter(filter === 'qualify' ? 'all' : 'qualify')}
              className={`p-2.5 rounded-2xl flex items-center space-x-2 transition tap-target text-left ${
                filter === 'qualify'
                  ? 'bg-emerald-600 ring-2 ring-emerald-300'
                  : 'bg-emerald-900/60 hover:bg-emerald-900'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <div className="text-lg font-extrabold leading-none">{qualifyCount}</div>
                <div className="text-[10px] text-emerald-200 uppercase font-semibold">
                  {t('qualifyBadge', 'You Qualify')}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFilter(filter === 'missing' ? 'all' : 'missing')}
              className={`p-2.5 rounded-2xl flex items-center space-x-2 transition tap-target text-left ${
                filter === 'missing'
                  ? 'bg-amber-600 ring-2 ring-amber-300'
                  : 'bg-amber-950/40 hover:bg-amber-950/60'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/30 text-amber-300 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="text-lg font-extrabold leading-none">{missingCount}</div>
                <div className="text-[10px] text-amber-200 uppercase font-semibold">
                  {t('missingBadge', 'Missing Out')}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 tap-target ${
              filter === 'all'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {t('allFilter', 'All Schemes')} ({evaluatedSchemes.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('qualify')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 tap-target flex items-center gap-1 ${
              filter === 'qualify'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-emerald-800 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t('qualifyBadge', 'Qualify')} ({qualifyCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('missing')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 tap-target flex items-center gap-1 ${
              filter === 'missing'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-amber-800 border border-amber-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t('missingBadge', 'Action Needed')} ({missingCount})</span>
          </button>
        </div>

        {/* Scheme Cards List */}
        <div className="space-y-4 pt-1">
          {filteredSchemes.map(scheme => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>

        {/* Bottom CTA to Profile / Summary */}
        <div className="pt-4 space-y-3">
          <button
            type="button"
            onClick={onNavigateProfile}
            className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center space-x-2 transition-transform active:scale-[0.99] tap-target"
          >
            <UserCheck className="w-5 h-5" />
            <span>{t('viewProfileBtn', 'View Full Summary & Profile')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onEditAnswers}
            className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 py-3 px-4 rounded-2xl font-semibold text-sm flex items-center justify-center space-x-1.5 tap-target"
          >
            <span>{t('editBtn', 'Edit My Answers')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
