import React, { useState } from 'react';
import { Shield, Phone, KeyRound, CheckCircle2, ArrowRight, Lock, Sparkles, X, Smartphone } from 'lucide-react';
import { UserProfile } from '../types';

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
  const [telefono, setTelefono] = useState(userProfile.telefonoWhatsapp || '');
  const [grado, setGrado] = useState(userProfile.grado || 'S3 PNP');
  const [nombre, setNombre] = useState(userProfile.nombre || 'Efectivo Policial');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [inputOtp, setInputOtp] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!telefono || telefono.trim().length < 9) {
      setErrorMsg('Ingresa un número de celular de 9 dígitos válido.');
      return;
    }

    // Generate random 6 digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setErrorMsg('');
    setStep('OTP');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputOtp.trim() === generatedOtp || inputOtp.trim() === '123456') {
      onLoginSuccess(telefono, grado, nombre);
    } else {
      setErrorMsg('Código OTP incorrecto. Prueba usando el código generado arriba o 123456.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in duration-200 text-slate-900 dark:text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors"
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
                  Número de Celular / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="telefono-input"
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ej. 987654321"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-base font-mono focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white"
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
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black py-3.5 rounded-2xl text-sm shadow-lg transition-all flex items-center justify-center gap-2 active-scale"
            >
              <span>ENVIAR CÓDIGO DE ACCESO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-2xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> SMS / WhatsApp Enviado
                </span>
                <span className="bg-emerald-600 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                  SIMULADO
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Se envió el código de verificación al número <strong>{telefono}</strong>.
              </p>
              <div className="bg-white dark:bg-slate-950 border border-emerald-500/40 p-2.5 rounded-xl font-mono text-center relative">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                  Código de Pruebas OTP:
                </p>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-widest my-0.5">
                  {generatedOtp}
                </p>
                <button
                  type="button"
                  onClick={() => setInputOtp(generatedOtp)}
                  className="mt-1 text-[11px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-lg font-bold hover:bg-emerald-500/30 transition-colors"
                >
                  Pegar código aquí
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="otp-input" className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ingresa el Código OTP (6 dígitos)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="otp-input"
                  type="text"
                  maxLength={6}
                  required
                  value={inputOtp}
                  onChange={(e) => setInputOtp(e.target.value)}
                  placeholder="Ej. 852914"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-center text-lg font-mono font-bold tracking-widest focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white"
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
                className="w-1/3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold py-3 rounded-2xl transition-colors"
              >
                Cambiar N°
              </button>
              <button
                type="submit"
                className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white font-display font-black py-3 rounded-2xl text-sm shadow-lg transition-all flex items-center justify-center gap-2 active-scale"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>INGRESAR AL PORTAL</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
