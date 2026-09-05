import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useFarmer } from '../context/FarmerContext';
import { Phone, ArrowRight, ShieldCheck, Sprout } from 'lucide-react';

import { api } from '../services/api';

export default function PhoneLoginScreen({ onNext }) {
  const { t } = useLanguage();
  const { user, setUser } = useFarmer();
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length <= 10) {
      setPhoneNumber(raw);
      if (error) setError('');
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      setError(t('phoneError', 'Please enter a valid 10-digit phone number'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.sendOtp(phoneNumber);
      if (res && res.success) {
        setUser(prev => ({
          ...prev,
          phone: phoneNumber,
          demoOtp: res.otp
        }));
        onNext();
      } else {
        setError(res?.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      // Demo fallback in case of network issue
      setUser(prev => ({ ...prev, phone: phoneNumber, demoOtp: '123456' }));
      onNext();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] flex flex-col justify-between p-5 max-w-md mx-auto">
      {/* Top Section */}
      <div className="pt-8 space-y-6">
        <div className="flex items-center space-x-2 text-emerald-800">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center font-bold shadow-sm">
            <Sprout className="w-6 h-6 text-emerald-950" />
          </div>
          <div>
            <span className="font-bold text-lg text-gray-900 block leading-tight font-sans">
              {t('appName', 'Kisan Sahayak')}
            </span>
            <span className="text-xs text-emerald-700 font-medium">
              {t('appSub', 'Scheme Finder')}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
            {t('phoneLoginTitle', 'Welcome to Kisan Sahayak')}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed font-normal">
            {t('phoneLoginSub', "Enter your 10-digit mobile number to discover farmer welfare schemes.")}
          </p>
        </div>

        {/* Input Card */}
        <form onSubmit={handleSendOtp} className="bg-white p-5 rounded-3xl shadow-card border border-emerald-100 space-y-4">
          <label htmlFor="phone-input" className="block text-sm font-bold text-gray-800">
            {t('phoneLabel', 'Mobile Number')}
          </label>

          <div className="relative flex items-center">
            <div className="absolute left-3.5 flex items-center space-x-1.5 text-gray-500 font-semibold text-base select-none border-r border-gray-200 pr-2.5">
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded tracking-wider">IND</span>
              <span className="text-gray-700">+91</span>
            </div>

            <input
              id="phone-input"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder={t('phonePlaceholder', 'e.g. 9876543210')}
              className="w-full pl-24 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 text-lg font-bold tracking-wider text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition"
              required
            />
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-600 bg-red-50 p-2 rounded-xl">
              {error}
            </p>
          )}

          <div className="flex items-center space-x-2 text-xs text-gray-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t('safeDataTag', 'Your number is safe and only used to retrieve scheme status.')}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center space-x-2 transition-transform active:scale-[0.99] tap-target disabled:opacity-60"
          >
            <Phone className="w-5 h-5" />
            <span>{loading ? t('loading', 'Sending OTP...') : t('sendOtpBtn', 'Send OTP')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Trust Footer */}
      <div className="text-center py-4 text-xs text-gray-500 space-y-1">
        <p className="font-medium text-emerald-800 flex items-center justify-center gap-1.5">
          <Sprout className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>{t('govtDataTrust', 'Direct guidance based on Central & Maharashtra Govt schemes')}</span>
        </p>
        <p className="text-[11px] text-gray-400">
          PM-KISAN • Namo Shetkari • PMFBY • e-Shram • MGNREGA
        </p>
      </div>
    </div>
  );
}
