import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useFarmer } from '../context/FarmerContext';
import { User, ArrowRight, Sparkles } from 'lucide-react';

import { api } from '../services/api';

export default function NameEntryScreen({ onNext }) {
  const { t } = useLanguage();
  const { user, setUser } = useFarmer();
  const [name, setName] = useState(user.name || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError(t('nameError', 'Please enter your name to continue'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (user.id) {
        await api.saveName(user.id, cleanName);
      }
      setUser(prev => ({ ...prev, name: cleanName }));
      onNext();
    } catch (err) {
      console.error('Error saving name:', err);
      setUser(prev => ({ ...prev, name: cleanName }));
      onNext();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] flex flex-col justify-between p-5 max-w-md mx-auto">
      <div className="pt-8 space-y-6">
        <div className="space-y-2">
          <div className="w-14 h-14 rounded-3xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-sm">
            <User className="w-8 h-8 text-emerald-950" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
            {t('nameTitle', 'What should we call you?')}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed font-normal">
            {t('nameSub', 'Please enter your name so we can tailor the schemes for you.')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-3xl shadow-card border border-emerald-100 space-y-4">
          <label htmlFor="name-input" className="block text-sm font-bold text-gray-800">
            {t('nameLabel', 'Your Full Name')}
          </label>

          <div className="relative flex items-center">
            <User className="w-5 h-5 text-gray-400 absolute left-3.5" />
            <input
              id="name-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder={t('namePlaceholder', 'e.g. Ramesh Patil')}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 text-lg font-semibold text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-600 bg-red-50 p-2 rounded-xl">
              {error}
            </p>
          )}

          <div className="flex items-center space-x-2 text-xs text-gray-500 pt-1">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{t('nameHelper', 'We address you respectfully across all application summaries.')}</span>
          </div>

          <button
            type="submit"
            className="w-full mt-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center space-x-2 transition-transform active:scale-[0.99] tap-target"
          >
            <span>{t('continueBtn', 'Continue')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="text-center py-4 text-xs text-gray-400">
        Personalized Farmer Support ? Kisan Sahayak
      </div>
    </div>
  );
}
