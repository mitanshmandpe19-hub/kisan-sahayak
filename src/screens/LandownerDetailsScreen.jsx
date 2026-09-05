import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useFarmer } from '../context/FarmerContext';
import { maharashtraDistricts, indianStates } from '../data/schemesData';
import StepProgress from '../components/StepProgress';
import { ArrowRight, Check, Sprout } from 'lucide-react';

export default function LandownerDetailsScreen({ onNext, onBack }) {
  const { t } = useLanguage();
  const { landownerDetails, setLandownerDetails } = useFarmer();
  const [formData, setFormData] = useState({ ...landownerDetails });

  const cropsList = [
    { id: 'Soybean', label: t('cropSoybean', 'Soybean') },
    { id: 'Cotton', label: t('cropCotton', 'Cotton') },
    { id: 'Wheat', label: t('cropWheat', 'Wheat') },
    { id: 'Rice', label: t('cropRice', 'Rice') },
    { id: 'Sugarcane', label: t('cropSugarcane', 'Sugarcane') },
    { id: 'Other', label: t('cropOther', 'Other') }
  ];

  const handleCropToggle = (cropId) => {
    setFormData(prev => {
      const exists = prev.crops.includes(cropId);
      const newCrops = exists
        ? prev.crops.filter(c => c !== cropId)
        : [...prev.crops, cropId];
      return { ...prev, crops: newCrops };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLandownerDetails(formData);
    onNext();
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] pb-24 max-w-md mx-auto">
      <StepProgress currentStep={1} totalSteps={3} title={t('stepBasic', 'Basic Details')} />

      <div className="p-4 space-y-4">
        {/* Intro */}
        <div className="bg-white p-4 rounded-3xl shadow-card border border-emerald-100 flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Sprout className="w-6 h-6 text-emerald-800" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {t('landownerTitle', 'Landowner Farmer')}
            </h2>
            <p className="text-xs text-gray-500">
              {t('formGuidance', 'Please fill these details to filter relevant schemes')}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-3xl shadow-card border border-emerald-100 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              {t('nameLabel', 'Full Name')}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 font-semibold text-gray-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-base"
              required
            />
          </div>

          {/* Age & Land Size side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                {t('ageLabel', 'Age (Years)')}
              </label>
              <input
                type="number"
                min="18"
                max="100"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })}
                placeholder="42"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 font-semibold text-gray-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-base"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                {t('landSizeLabel', 'Land (Acres)')}
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={formData.landSize}
                onChange={e => setFormData({ ...formData, landSize: e.target.value })}
                placeholder="3.5"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 font-semibold text-gray-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-base"
                required
              />
            </div>
          </div>

          {/* State */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              {t('stateLabel', 'State')}
            </label>
            <select
              value={formData.state}
              onChange={e => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 font-semibold text-gray-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-base bg-white"
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 font-semibold text-gray-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-base bg-white"
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 font-semibold text-gray-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-base"
              />
            )}
          </div>

          {/* Crops Multi-select Chips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              {t('cropsLabel', 'Crops Grown (Tap to select)')}
            </label>
            <div className="flex flex-wrap gap-2">
              {cropsList.map(crop => {
                const isSelected = formData.crops.includes(crop.id);
                return (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => handleCropToggle(crop.id)}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold border-2 transition-all flex items-center space-x-1.5 tap-target ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-100/90 text-emerald-900 shadow-sm'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-emerald-700" />}
                    <span>{crop.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Annual Income */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              {t('incomeLabel', 'Annual Family Income')}
            </label>
            <select
              value={formData.incomeRange}
              onChange={e => setFormData({ ...formData, incomeRange: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 font-semibold text-gray-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-base bg-white"
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
              className="w-full px-4 py-3 rounded-xl border border-gray-300 font-semibold text-gray-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-base bg-white"
            >
              <option value="General">{t('catGeneral', 'General')}</option>
              <option value="OBC">{t('catOBC', 'OBC')}</option>
              <option value="SC">{t('catSC', 'SC')}</option>
              <option value="ST">{t('catST', 'ST')}</option>
            </select>
          </div>

          {/* Next Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center space-x-2 transition-transform active:scale-[0.99] tap-target"
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
