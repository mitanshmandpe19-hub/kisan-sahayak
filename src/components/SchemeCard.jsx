import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useFarmer } from '../context/FarmerContext';
import {
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Landmark,
  Coins,
  ShieldCheck,
  Check,
  HelpCircle
} from 'lucide-react';

export default function SchemeCard({ scheme }) {
  const { language, t } = useLanguage();
  const { isBookmarked, toggleBookmark } = useFarmer();

  const [whyOpen, setWhyOpen] = useState(true);
  const [stepsOpen, setStepsOpen] = useState(false);

  const bookmarked = isBookmarked(scheme.id);
  const isQualify = scheme.status === 'qualify' || scheme.status === 'qualifies';

  // Localized texts
  const schemeName = (typeof scheme.name === 'object' ? (scheme.name?.[language] || scheme.name?.en) : scheme.name) || scheme.id;
  const benefitText = (typeof scheme.benefit === 'object' ? (scheme.benefit?.[language] || scheme.benefit?.en) : (scheme.benefit || scheme.benefit_summary)) || '';
  const whyText = scheme.reason_text || (typeof scheme.why === 'object' ? (scheme.why?.[language] || scheme.why?.en) : scheme.why) || '';
  const stepsList = scheme.next_steps_text || (typeof scheme.steps === 'object' ? (scheme.steps?.[language] || scheme.steps?.en) : scheme.steps) || [];

  const isStateLevel = String(scheme.level).toLowerCase().includes('state') || String(scheme.level).toLowerCase().includes('maharashtra');

  return (
    <article
      className={`bg-white rounded-3xl p-5 shadow-card border-2 transition-all duration-200 ${
        isQualify
          ? 'border-emerald-200 hover:border-emerald-400'
          : 'border-amber-200 hover:border-amber-400'
      }`}
    >
      {/* Top badges and bookmark button */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Level badge */}
          <span
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isStateLevel
                ? 'bg-orange-100 text-orange-800 border border-orange-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>
              {isStateLevel
                ? t('stateBadge', 'Maharashtra State')
                : t('centralBadge', 'Central Scheme')}
            </span>
          </span>

          {/* Status badge */}
          {isQualify ? (
            <span className="inline-flex items-center space-x-1.5 bg-emerald-100/90 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t('qualifyBadge', 'You likely qualify')}</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{t('missingBadge', 'You may be missing out')}</span>
            </span>
          )}
        </div>

        {/* Bookmark button */}
        <button
          type="button"
          onClick={() => toggleBookmark(scheme.id)}
          aria-label={bookmarked ? t('savedBtn', 'Saved') : t('saveBtn', 'Save Scheme')}
          className={`p-2.5 rounded-2xl border transition-all tap-target flex items-center justify-center shrink-0 ${
            bookmarked
              ? 'bg-amber-500 border-amber-600 text-white shadow-md scale-105'
              : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-amber-600 hover:bg-amber-50'
          }`}
          title={bookmarked ? t('savedBtn', 'Saved') : t('saveBtn', 'Save Scheme')}
        >
          <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Scheme Title */}
      <h3 className="text-xl font-bold text-gray-900 leading-snug mb-2 font-sans">
        {schemeName}
      </h3>

      {/* Benefit summary box */}
      <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-3.5 flex items-start space-x-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 font-bold mt-0.5 shadow-sm">
          <Coins className="w-4 h-4 text-emerald-950" />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-900">
            {t('benefitLabel', 'Scheme Benefit')}
          </div>
          <div className="text-sm font-semibold text-emerald-950 leading-snug mt-0.5">
            {benefitText}
          </div>
        </div>
      </div>

      {/* Accordion 1: Why? (AI Placeholder block) */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden mb-3 bg-white transition-all">
        <button
          type="button"
          onClick={() => setWhyOpen(!whyOpen)}
          aria-expanded={whyOpen}
          className="w-full flex items-center justify-between p-3.5 text-left bg-gray-50 hover:bg-gray-100/80 transition tap-target"
        >
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5 text-white" />
            </span>
            <span className="font-bold text-sm text-gray-900">
              {t('whyTitle', "Why did we match this?")}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              AI
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                whyOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {whyOpen && (
          <div className="p-4 border-t border-gray-200 space-y-2 bg-gradient-to-b from-white to-gray-50/50">
            <p className="text-sm text-gray-800 leading-relaxed font-normal">
              {whyText}
            </p>
            <div className="pt-2 flex items-center justify-between border-t border-dashed border-gray-200 text-[11px] text-gray-500">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t('aiPlaceholderTag', 'Gemini AI Explanation Slot')}
              </span>
              <span className="italic text-gray-400 font-sans">
                Confidence: High
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: What to do next (Actionable steps) */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white transition-all">
        <button
          type="button"
          onClick={() => setStepsOpen(!stepsOpen)}
          aria-expanded={stepsOpen}
          className="w-full flex items-center justify-between p-3.5 text-left bg-gray-50 hover:bg-gray-100/80 transition tap-target"
        >
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-amber-500 text-amber-950 flex items-center justify-center text-xs font-bold">
              <ArrowRight className="w-3.5 h-3.5 text-amber-950" />
            </span>
            <span className="font-bold text-sm text-gray-900">
              {t('nextStepsTitle', 'Simple next steps to claim')}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-gray-500">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              {stepsList.length} {t('step', 'steps')}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                stepsOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {stepsOpen && (
          <div className="p-4 border-t border-gray-200 space-y-3 bg-white">
            <ol className="space-y-2.5">
              {stepsList.map((step, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-emerald-300">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-gray-800 leading-snug">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
            <div className="pt-2 border-t border-dashed border-gray-200 flex items-center justify-end">
              <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                {t('whyMissingAction', 'Action Required')}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
