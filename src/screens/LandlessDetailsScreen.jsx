import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useFarmer } from '../context/FarmerContext';
import { maharashtraDistricts, indianStates } from '../data/schemesData';
import StepProgress from '../components/StepProgress';
import { ArrowRight, Users } from 'lucide-react';

export default function LandlessDetailsScreen({ onNext, onBack }) {
  const { t } = useLanguage();
  const { landlessDetails, setLandlessDetails } = useFarmer();
  const [formData, setFormData] = useState({ ...landlessDetails });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLandlessDetails(formData);
    onNext();
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] pb-24 max-w-md mx-auto">
      <StepProgress currentStep={1} totalSteps={3} title={t('stepBasic', 'Basic Details')} />

      <div className="p-4 space-y-4">
        {/* Intro */}
        <div className="bg-white p-4 rounded-3xl shadow-card border border-amber-100 flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-amber-800" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {t('landlessTitle', 'Agricultural Laborer / Landless')}
            </h2>
            <p className="text-xs text-gray-500">
              {t('formGuidance', 'Please fill these details to find social welfare & job schemes')}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-3xl shadow-card border border-amber-100 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              {t('nameLabel', 'Full Name')}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 font-semibold text-gray-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none text-base"
              required
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              {t('ageLabel', 'Age (Years)')}
            </label>
            <input
              type="number"
              min="16"
              max="90"
              value={formData.age}
              onChange={e => setFormData({ ...formData, age: e.target.value })}
              placeholder="35"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 font-semibold text-gray-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none text-base"
              required
            />
          </div>

          {/* Type of Work */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              {t('workTypeLabel', 'Type of Agricultural Work')}
            </label>
            <select
              value={formData.workType}
              onChange={e => setFormData({ ...formData, workType: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 font-semibold text-gray-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none text-base bg-white"
            >
              <option value="workFarmLabor">
                {t('workFarmLabor', "Works on others' farm (Agricultural Laborer)")}
              </option>
              <option value="workSharecropper">
                {t('workSharecropper', 'Sharecropper / Tenant Farmer (Bataidar)')}
              </option>
              <option value="workSeasonal">
                {t('workSeasonal', 'Seasonal Migrant Laborer')}
              </option>
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              {t('stateLabel', 'State')}
            </label>
            <select
              value={formData.state}
              onChange={e => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 font-semibold text-gray-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none text-base bg-white"
            >
              {indianStates.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              {t('districtLabel', 'District')}
            </label>
            {formData.state === 'Maharashtra' ? (
              <select
                value={formData.district}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 font-semibold text-gray-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none text-base bg-white"
              >
                {maharashtraDistricts.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={formData.district}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                placeholder="Enter your district"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 font-semibold text-gray-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none text-base"
              />
            )}
          </div>

          {/* Annual Income */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              {t('incomeLabel', 'Annual Family Income')}
            </label>
            <select
              value={formData.incomeRange}
              onChange={e => setFormData({ ...formData, incomeRange: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 font-semibold text-gray-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none text-base bg-white"
            >
              <option value="income1">{t('income1', 'Less than ?1 Lakh')}</option>
              <option value="income2">{t('income2', '?1 Lakh - ?3 Lakh')}</option>
              <option value="income3">{t('income3', '?3 Lakh - ?5 Lakh')}</option>
              <option value="income4">{t('income4', 'More than ?5 Lakh')}</option>
            </select>
          </div>

          {/* Social Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              {t('categoryLabel', 'Social Category')}
            </label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 font-semibold text-gray-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none text-base bg-white"
            >
              <option value="SC">{t('catSC', 'SC')}</option>
              <option value="ST">{t('catST', 'ST')}</option>
              <option value="OBC">{t('catOBC', 'OBC')}</option>
              <option value="General">{t('catGeneral', 'General')}</option>
            </select>
          </div>

          {/* Next Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center space-x-2 transition-transform active:scale-[0.99] tap-target"
            >
              <span>{t('nextBtn', 'Next')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
