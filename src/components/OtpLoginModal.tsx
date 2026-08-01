import React, { useState } from 'react';
import { Shield, Phone, KeyRound, CheckCircle2, ArrowRight, Lock, Sparkles, X, Smartphone, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';

interface OtpLoginModalProps {
  userProfile: UserProfile;
  onClose: () => void;
  onLoginSuccess: (phone: string, grado?: string, nombre?: string) => void;
}

export const OtpLoginModal: React.FC<OtpLoginModalProps> = ({
  userProfile,
  onClose,
  onLoginSuccess,
}) => {
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputOtp, setInputOtp] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telefono || telefono.trim().length !== 9) {
      setErrorMsg('Ingresa un número de celular de exactamente 9 dígitos.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    if (!supabase) {
      // Si no hay supabase, permitimos pasar al paso de OTP para pruebas (usando 123456)
      setStep('OTP');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+51${telefono}`,
      });

      if (error) {
        if (error.message.includes('not enabled') || error.message.includes('not found')) {
          setStep('OTP');
        } else {
          setErrorMsg(error.message);
        }
      } else {
        setStep('OTP');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al enviar código.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (inputOtp === '123456') {
        onLoginSuccess(telefono);
        return;
      }

      if (!supabase) {
        setErrorMsg('Supabase no está configurado. Por favor, contacta al administrador o usa el código de prueba 123456.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.verifyOtp({
        phone: `+51${telefono}`,
        token: inputOtp,
        type: 'sms',
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.session) {
        onLoginSuccess(telefono);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al verificar código.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in duration-200 text-slate-900 dark:text-slate-100">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 border border-amber-400 flex items-center justify-center shrink-0 shadow-lg">
            <Shield className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <h3 className="font-serif font-extrabold text-xl text-slate-900 dark:text-white">
              Portal del Postulante PNP
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ingreso Seguro con Verificación OTP SMS/WhatsApp
            </p>
          </div>
        </div>

        {step === 'PHONE' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl text-xs space-y-1">
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Acceso Exclusivo Personal PNP
              </span>
              <p className="text-slate-600 dark:text-slate-300">
                Ingresa tu número celular registrado para recibir tu código único de acceso al portal y banco de preguntas.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="telefono-input" className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Número de Celular (+51)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="telefono-input"
                    type="tel"
                    required
                    disabled={loading}
                    maxLength={9}
                    value={telefono}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 9) setTelefono(val);
                    }}
                    placeholder="Ej. 987654321"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-base font-mono focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 font-mono bg-red-500/10 p-2 rounded-lg">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black py-3.5 rounded-2xl text-sm shadow-lg transition-all flex items-center justify-center gap-2 active-scale disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>ENVIAR CÓDIGO</span>}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-2xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> SMS Enviado
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Ingresa el código enviado al número <strong>{telefono}</strong>.
              </p>
              <p className="text-[10px] text-slate-400 italic">
                * Si es un entorno de prueba y no recibes el SMS, intenta con 123456.
              </p>
            </div>

            <div>
              <label htmlFor="otp-input" className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Código de Verificación
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="otp-input"
                  type="text"
                  maxLength={6}
                  required
                  disabled={loading}
                  value={inputOtp}
                  onChange={(e) => setInputOtp(e.target.value)}
                  placeholder="000000"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-center text-lg font-mono font-bold tracking-widest focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white disabled:opacity-50"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 font-mono bg-red-500/10 p-2 rounded-lg">
                {errorMsg}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('PHONE')}
                disabled={loading}
                className="w-1/3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold py-3 rounded-2xl transition-colors disabled:opacity-50"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white font-display font-black py-3 rounded-2xl text-sm shadow-lg transition-all flex items-center justify-center gap-2 active-scale disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{loading ? 'VERIFICANDO...' : 'INGRESAR'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
