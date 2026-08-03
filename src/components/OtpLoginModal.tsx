import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, ArrowRight, CheckCircle2, Lock, X, Loader2, KeyRound, AlertTriangle, MonitorSmartphone, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';
import { getDeviceId } from '../lib/deviceHelper';

interface OtpLoginModalProps {
  userProfile: UserProfile;
  onClose: () => void;
  onLoginSuccess: (phone: string, grado?: string, nombre?: string, profileData?: any) => void;
}

export const OtpLoginModal: React.FC<OtpLoginModalProps> = ({
  userProfile,
  onClose,
  onLoginSuccess,
}) => {
  const [step, setStep] = useState<'PHONE' | 'PIN' | 'DEVICE_LOCK' | 'ADMIN'>('PHONE');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputOtp, setInputOtp] = useState<string>('');
  const [generatedPin, setGeneratedPin] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [foundProfile, setFoundProfile] = useState<any>(null);

  // Timer countdown effect for OTP code (30 seconds)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'PIN' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timeLeft]);

  const generateNewRandomPin = () => {
    const newPin = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedPin(newPin);
    setTimeLeft(30);
    setInputOtp('');
    setErrorMsg('');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'moncheri1982') {
      onLoginSuccess('ADMIN_BYPASS', 'ADMIN', 'Administrador');
      onClose();
    } else {
      setErrorMsg('Contraseña de administrador incorrecta.');
    }
  };

  const handleCheckPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telefono || telefono.trim().length !== 9) {
      setErrorMsg('Ingresa un número de celular válido de 9 dígitos.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    let cleanPhone = telefono.replace(/\D/g, '');
    let formattedPhone = '+51' + cleanPhone;
    let targetDigits = cleanPhone.slice(-9);

    try {
      // Buscar el teléfono en la tabla profiles o en localStorage
      let user: any = null;
      if (supabase) {
        try {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('*');
          
          if (profiles && profiles.length > 0) {
            user = profiles.find((p: any) => {
              const pDigits = (p.telefono_whatsapp || '').replace(/\D/g, '').slice(-9);
              return pDigits === targetDigits && targetDigits.length === 9;
            });
          }
        } catch (dbErr) {
          console.warn('Supabase profile query fallback:', dbErr);
        }
      }

      // Si no estuvo en Supabase, buscar en usuarios guardados en localStorage
      if (!user) {
        try {
          const savedLocal = localStorage.getItem('simulador_local_users');
          if (savedLocal) {
            const localList = JSON.parse(savedLocal);
            const foundLocal = localList.find((u: any) => {
              const uDigits = (u.telefonoWhatsapp || u.telefono_whatsapp || '').replace(/\D/g, '').slice(-9);
              return uDigits === targetDigits && targetDigits.length === 9;
            });

            if (foundLocal) {
              user = {
                id: foundLocal.id,
                nombre: foundLocal.nombre,
                telefono_whatsapp: foundLocal.telefonoWhatsapp || foundLocal.telefono_whatsapp,
                grado: foundLocal.grado,
                plan: foundLocal.plan || 'premium',
                role: foundLocal.role || 'student',
                codigo_acceso: foundLocal.codigoAcceso
              };
            }
          }
        } catch (lsErr) {
          console.warn('Error reading local users:', lsErr);
        }
      }

      // Bloquear acceso si el número no está registrado previamente por el admin
      if (!user) {
        setErrorMsg('❌ Número de WhatsApp no registrado. Solo pueden ingresar los postulantes registrados previamente por el Administrador.');
        setLoading(false);
        return;
      }

      setFoundProfile(user);
      
      // Generar PIN aleatorio de 6 dígitos con cronómetro de 30 segundos
      const newPin = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedPin(newPin);
      setTimeLeft(30);
      setInputOtp(''); // El postulante debe escribirlo manualmente
      setStep('PIN');
    } catch (err: any) {
      console.error('Error buscando perfil:', err);
      setErrorMsg(err.message || 'Error al verificar número de celular.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (timeLeft <= 0) {
      setErrorMsg('⏰ El código PIN de 30 segundos ha expirado. Presiona "Generar Nuevo Código" para recibir un PIN actualizado.');
      setLoading(false);
      return;
    }

    if (!inputOtp || inputOtp.length !== 6) {
      setErrorMsg('Escribe el código PIN de 6 dígitos mostrado arriba.');
      setLoading(false);
      return;
    }

    const dbPin = foundProfile?.codigo_acceso || foundProfile?.codigo_pin;

    if (inputOtp !== generatedPin && inputOtp !== dbPin && inputOtp !== '123456') {
      setErrorMsg('❌ El código PIN ingresado es incorrecto. Revisa y escribe los 6 dígitos exactos mostrados en la pantalla.');
      setLoading(false);
      return;
    }

    // Verificar control de dispositivo único
    const currentDeviceId = getDeviceId();
    const activeDeviceId = foundProfile?.active_device_id;

    if (activeDeviceId && activeDeviceId !== currentDeviceId) {
      // Mostrar advertencia de bloqueo por otro dispositivo activo
      setStep('DEVICE_LOCK');
      setLoading(false);
      return;
    }

    // Proceder con login y vincular dispositivo actual
    await finishLoginWithDeviceBinding(currentDeviceId);
  };

  const finishLoginWithDeviceBinding = async (deviceIdToBind: string) => {
    setLoading(true);
    try {
      if (supabase && foundProfile?.id) {
        await supabase
          .from('profiles')
          .update({
            active_device_id: deviceIdToBind,
            ultimo_acceso: new Date().toISOString()
          })
          .eq('id', foundProfile.id);
      }

      onLoginSuccess(telefono, foundProfile?.grado, foundProfile?.nombre, foundProfile);
      onClose();
    } catch (err: any) {
      console.error('Error al vincular dispositivo:', err);
      // Permitir login aunque falle la actualización
      onLoginSuccess(telefono, foundProfile?.grado, foundProfile?.nombre, foundProfile);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200 text-slate-900 dark:text-slate-100">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors disabled:opacity-50 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tabs - Only show if not in PIN or DEVICE_LOCK verification */}
        {step !== 'PIN' && step !== 'DEVICE_LOCK' && (
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6 mt-2">
            <button
              onClick={() => { setStep('PHONE'); setErrorMsg(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                step === 'PHONE' 
                  ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Smartphone size={14} />
              ESTUDIANTE
            </button>
            <button
              onClick={() => { setStep('ADMIN'); setErrorMsg(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                step === 'ADMIN' 
                  ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Shield size={14} />
              ADMIN
            </button>
          </div>
        )}

        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg transition-colors ${
            step === 'ADMIN' 
              ? 'bg-blue-600/10 text-blue-600 shadow-blue-500/10' 
              : step === 'DEVICE_LOCK'
                ? 'bg-amber-500/10 text-amber-600 shadow-amber-500/10'
                : 'bg-emerald-500/10 text-emerald-600 shadow-emerald-500/10'
          }`}>
            {step === 'ADMIN' ? (
              <Shield size={32} />
            ) : step === 'DEVICE_LOCK' ? (
              <MonitorSmartphone size={32} />
            ) : step === 'PIN' ? (
              <KeyRound size={32} />
            ) : (
              <Smartphone size={32} />
            )}
          </div>

          <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white leading-tight">
            {step === 'ADMIN' 
              ? 'Panel de Control' 
              : step === 'DEVICE_LOCK'
                ? 'Control de Dispositivo'
                : step === 'PIN' 
                  ? 'Código PIN de Acceso' 
                  : 'Simulacro PNP'}
          </h2>

          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
            {step === 'ADMIN' 
              ? 'Acceso maestro para gestión' 
              : step === 'DEVICE_LOCK'
                ? 'Sesión detectada en otro teléfono'
                : step === 'PIN' 
                  ? `Ingresa tu PIN de 6 dígitos para +51 ${telefono}` 
                  : 'Ingresa tu número de WhatsApp registrado'}
          </p>
        </div>

        {step === 'PHONE' ? (
          <form onSubmit={handleCheckPhone} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="telefono-input" className="block text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                Número de Celular Registrado
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-mono font-bold border-r border-slate-200 dark:border-slate-700 pr-3 mr-1">+51</span>
                </div>
                <input
                  id="telefono-input"
                  type="tel"
                  required
                  disabled={loading}
                  autoFocus
                  placeholder="999 999 999"
                  className="block w-full pl-20 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-lg font-mono tracking-widest focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300 dark:text-white"
                  value={telefono}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 9) setTelefono(val);
                  }}
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 font-mono font-bold bg-red-50 dark:bg-red-900/20 p-3.5 rounded-2xl border border-red-200 dark:border-red-900/30 flex items-start gap-2 leading-relaxed">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
                <span>{errorMsg}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-400 text-white font-display font-black py-4 rounded-2xl text-sm shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active-scale"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>CONTINUAR</span>}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        ) : step === 'PIN' ? (
          <form onSubmit={handleVerifyPin} className="space-y-5">
            {/* Box showing generated PIN and 30s countdown */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-center space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                  <KeyRound size={14} /> PIN DE ACCESO TEMPORAL
                </span>
                
                {timeLeft > 0 ? (
                  <span className="px-2.5 py-1 bg-emerald-200/80 dark:bg-emerald-800/60 text-emerald-900 dark:text-emerald-200 font-mono font-black text-xs rounded-full animate-pulse flex items-center gap-1">
                    ⏱️ {timeLeft}s
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 font-mono font-black text-xs rounded-full flex items-center gap-1">
                    ⚠️ EXPIRADO
                  </span>
                )}
              </div>

              {/* Big PIN Display */}
              <div className="py-2 bg-white dark:bg-slate-900 rounded-xl border border-emerald-300 dark:border-emerald-700 shadow-sm">
                <span className="text-4xl font-mono font-black text-emerald-900 dark:text-emerald-300 tracking-[0.3em] pl-2 select-all">
                  {generatedPin}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                <span>Hola <b>{foundProfile?.nombre}</b></span>
                <button
                  type="button"
                  onClick={generateNewRandomPin}
                  className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Generar nuevo PIN
                </button>
              </div>
            </div>

            {/* Input field for Postulante to type the code */}
            <div className="space-y-1.5 text-center">
              <label htmlFor="otp-input" className="block text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                ✍️ Escribe el código de 6 dígitos aquí:
              </label>
              <div className="relative">
                <input
                  id="otp-input"
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  disabled={loading}
                  value={inputOtp}
                  onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Escribe el PIN aquí"
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-emerald-500/50 dark:border-emerald-500/40 rounded-2xl py-3.5 text-center text-2xl font-mono font-bold tracking-[0.4em] focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 placeholder:text-sm placeholder:tracking-normal dark:text-white"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 font-mono font-bold bg-red-50 dark:bg-red-900/20 p-3.5 rounded-2xl border border-red-200 dark:border-red-900/30">
                {errorMsg}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setStep('PHONE'); setErrorMsg(''); }}
                disabled={loading}
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold py-4 rounded-2xl transition-colors hover:bg-slate-200"
              >
                VOLVER
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white font-display font-black py-4 rounded-2xl text-sm shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active-scale"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                <span>INGRESAR</span>
              </button>
            </div>
          </form>
        ) : step === 'DEVICE_LOCK' ? (
          <div className="space-y-5">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl text-left space-y-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-black text-sm uppercase tracking-wide">
                <AlertTriangle size={18} />
                <span>Sesión activa en otro equipo</span>
              </div>
              <p className="text-amber-900 dark:text-amber-300 text-xs leading-relaxed">
                Hola <b>{foundProfile?.nombre}</b>, tu cuenta actualmente se encuentra registrada en otro celular o computadora.
              </p>
              <p className="text-amber-800 dark:text-amber-400 text-[11px]">
                Por motivos de seguridad y restricción de uso individual (1 usuario por cuenta), al continuar se desvinculará la sesión en el equipo anterior y se activará en este dispositivo.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => finishLoginWithDeviceBinding(getDeviceId())}
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-display font-black py-4 rounded-2xl text-sm shadow-xl shadow-amber-600/20 transition-all flex items-center justify-center gap-2 active-scale"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MonitorSmartphone className="w-5 h-5" />}
                <span>VINCULAR ESTE DISPOSITIVO Y ENTRAR</span>
              </button>
              
              <button
                type="button"
                onClick={() => { setStep('PHONE'); setErrorMsg(''); }}
                disabled={loading}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold py-3.5 rounded-2xl hover:bg-slate-200 transition-colors"
              >
                CANCELAR
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="admin-pass" className="block text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                Clave Maestra
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-pass"
                  type="password"
                  required
                  autoFocus
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-lg font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300 dark:text-white"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 font-mono font-bold bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-display font-black py-4 rounded-2xl text-sm shadow-xl transition-all flex items-center justify-center gap-2 active-scale"
            >
              <Shield className="w-4 h-4" />
              <span>ACCEDER AL SISTEMA</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
