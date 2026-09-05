import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useFarmer } from '../context/FarmerContext';
import { ShieldCheck, ArrowRight, RotateCw, KeyRound, ArrowLeft, Lightbulb } from 'lucide-react';

import { api } from '../services/api';

export default function OtpVerificationScreen({ onNext, onBack }) {
  const { t } = useLanguage();
  const { user, setUser, loadUserProfile } = useFarmer();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendMessage, setResendMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    if (error) setError('');

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const enteredCode = otp.join('').trim() || user.demoOtp || '123456';

    setLoading(true);
    setError('');

    try {
      const res = await api.verifyOtp(user.phone || '9876543210', enteredCode);
      if (res && res.success) {
        setUser(prev => ({
          ...prev,
          id: res.user.id,
          name: res.user.name || prev.name,
          otpVerified: true
        }));

        if (res.user.id) {
          await loadUserProfile(res.user.id);
        }

        onNext();
      } else {
        setError(res?.error || 'Invalid OTP code. Please try again.');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      // Demo fallback
      setUser(prev => ({ ...prev, otpVerified: true }));
      onNext();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await api.sendOtp(user.phone || '9876543210');
      if (res && res.success) {
        setUser(prev => ({ ...prev, demoOtp: res.otp }));
        setResendMessage(`${t('resendSuccess', 'New OTP sent!')} Code: ${res.otp}`);
      }
    } catch {
      setResendMessage(t('resendSuccess', 'OTP re-sent successfully (Use 123456)'));
    }
    setTimeout(() => setResendMessage(''), 5000);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] flex flex-col justify-between p-5 max-w-md mx-auto">
      {/* Top section */}
      <div className="pt-8 space-y-6">
        <button
          type="button"
          onClick={onBack}
          className="text-emerald-800 font-semibold text-sm flex items-center gap-1.5 hover:underline tap-target"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backBtn', 'Change number')}</span>
        </button>

        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl shadow-sm">
            <KeyRound className="w-6 h-6 text-amber-800" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
            {t('otpTitle', 'Verify Your Number')}
          </h2>
          <p className="text-sm text-gray-600">
            {t('otpSub', 'We sent a 6-digit OTP to')}{' '}
            <span className="font-bold text-gray-900">+91 {user.phone || '9876543210'}</span>
          </p>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleVerify} className="bg-white p-5 rounded-3xl shadow-card border border-emerald-100 space-y-5">
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => (inputsRef.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(idx, e.target.value)}
                onKeyDown={e => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center text-2xl font-bold text-gray-900 rounded-xl border-2 border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition bg-gray-50/50"
                placeholder="-"
                autoFocus={idx === 0}
              />
            ))}
          </div>

          {user.demoOtp && (
            <div
              onClick={() => {
                if (user.demoOtp && user.demoOtp.length === 6) {
                  setOtp(user.demoOtp.split(''));
                }
              }}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center cursor-pointer hover:bg-amber-100 transition active:scale-[0.99]"
              title="Click to auto-fill OTP"
            >
              <span className="text-xs text-amber-800 font-semibold block">Demo OTP Code Generated (Tap to fill):</span>
              <span className="text-xl font-black tracking-widest text-amber-950 font-mono">{user.demoOtp}</span>
            </div>
          )}

          {error && (
            <p className="text-xs font-semibold text-red-600 bg-red-50 p-2 rounded-xl text-center">
              {error}
            </p>
          )}

          <p className="text-xs text-center text-emerald-800 font-medium bg-emerald-50 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{t('otpHelper', '(Demo Mode: Generated code or 123456 will verify)')}</span>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center space-x-2 transition-transform active:scale-[0.99] tap-target disabled:opacity-60"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{loading ? t('loading', 'Verifying...') : t('verifyOtpBtn', 'Verify OTP & Continue')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleResend}
              className="text-sm font-semibold text-emerald-800 hover:text-emerald-950 flex items-center justify-center gap-1.5 mx-auto tap-target"
            >
              <RotateCw className="w-4 h-4" />
              <span>{t('resendOtp', "Didn't receive OTP? Resend OTP")}</span>
            </button>
            {resendMessage && (
              <p className="text-xs text-green-700 font-semibold mt-1 animate-in fade-in">
                {resendMessage}
              </p>
            )}
          </div>
        </form>
      </div>

      <div className="text-center py-4 text-xs text-gray-400">
        Secure OTP Verification • Kisan Sahayak
      </div>
    </div>
  );
}
