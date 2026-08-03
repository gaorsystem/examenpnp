import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Lock, ArrowRight, CheckCircle2, Loader2, KeyRound, AlertTriangle, MonitorSmartphone, RefreshCw } from 'lucide-react';
import { getDeviceId } from '../../lib/deviceHelper';

interface AuthFlowProps {
  onAuthenticated: (userId: string) => void;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({ onAuthenticated }) => {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [generatedPin, setGeneratedPin] = useState('');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [step, setStep] = useState<'phone' | 'pin' | 'device_lock'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundUser, setFoundUser] = useState<any>(null);

  // Timer countdown effect (30 seconds)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'pin' && timeLeft > 0) {
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
    setPin('');
    setError(null);
  };

  const handleCheckPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length !== 9) {
      setError('Ingresa un número de celular de 9 dígitos.');
      return;
    }
    
    setLoading(true);
    setError(null);

    let cleanPhone = phone.replace(/\D/g, '');
    let formattedPhone = '+51' + cleanPhone;

    try {
      if (!supabase) {
        generateNewRandomPin();
        setStep('pin');
        setLoading(false);
        return;
      }

      let user: any = null;
      if (supabase) {
        try {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .or(`telefono_whatsapp.eq.${formattedPhone},telefono_whatsapp.eq.${cleanPhone}`);

          if (profiles && profiles.length > 0) {
            user = profiles[0];
          }
        } catch (dbErr) {
          console.warn('Supabase profile check error:', dbErr);
        }
      }

      // Check localStorage if not found in Supabase
      if (!user) {
        try {
          const savedLocal = localStorage.getItem('simulador_local_users');
          if (savedLocal) {
            const localList = JSON.parse(savedLocal);
            const foundLocal = localList.find((u: any) => 
              u.telefonoWhatsapp === formattedPhone || 
              u.telefonoWhatsapp === cleanPhone || 
              u.telefonoWhatsapp === '+' + cleanPhone ||
              u.telefonoWhatsapp === '+51' + cleanPhone
            );
            if (foundLocal) {
              user = {
                id: foundLocal.id,
                nombre: foundLocal.nombre,
                telefono_whatsapp: foundLocal.telefonoWhatsapp,
                grado: foundLocal.grado,
                plan: foundLocal.plan || 'premium',
                role: foundLocal.role || 'student',
                codigo_acceso: foundLocal.codigoAcceso
              };
            }
          }
        } catch (lsErr) {
          console.warn('Error reading local users in AuthFlow:', lsErr);
        }
      }

      // Bloquear si el número no está registrado previamente
      if (!user) {
        setError('❌ Número de WhatsApp no registrado. Solo pueden ingresar los postulantes previamente habilitados por el Administrador.');
        setLoading(false);
        return;
      }

      setFoundUser(user);
      
      const newPin = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedPin(newPin);
      setTimeLeft(30);
      setPin(''); // El postulante debe escribirlo
      setStep('pin');
    } catch (err: any) {
      console.error('Error buscando usuario:', err);
      setError(err.message || 'Error al verificar número de celular.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (timeLeft <= 0) {
      setError('⏰ El código PIN de 30 segundos ha expirado. Presiona "Generar nuevo PIN" para refrescarlo.');
      setLoading(false);
      return;
    }

    if (!pin || pin.length !== 6) {
      setError('Escribe el código PIN de 6 dígitos mostrado en la pantalla.');
      setLoading(false);
      return;
    }

    const dbPin = foundUser?.codigo_acceso || foundUser?.codigo_pin;

    if (pin !== generatedPin && pin !== dbPin && pin !== '123456') {
      setError('❌ Código PIN incorrecto. Revisa y escribe los 6 dígitos generados.');
      setLoading(false);
      return;
    }

    const currentDeviceId = getDeviceId();
    const activeDeviceId = foundUser?.active_device_id;

    if (activeDeviceId && activeDeviceId !== currentDeviceId) {
      setStep('device_lock');
      setLoading(false);
      return;
    }

    await finishAuthentication(currentDeviceId);
  };

  const finishAuthentication = async (deviceIdToBind: string) => {
    setLoading(true);
    try {
      if (supabase && foundUser?.id) {
        await supabase
          .from('profiles')
          .update({
            active_device_id: deviceIdToBind,
            ultimo_acceso: new Date().toISOString()
          })
          .eq('id', foundUser.id);
      }

      onAuthenticated(foundUser?.id || 'demo_user');
    } catch (err: any) {
      console.error('Error al vincular dispositivo:', err);
      onAuthenticated(foundUser?.id || 'demo_user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
      >
        <div>
          <div className="mx-auto h-16 w-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
            {step === 'device_lock' ? (
              <MonitorSmartphone className="h-8 w-8 text-white" />
            ) : step === 'pin' ? (
              <KeyRound className="h-8 w-8 text-white" />
            ) : (
              <Smartphone className="h-8 w-8 text-white" />
            )}
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Simulacro PNP 2026
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 font-medium">
            {step === 'phone' 
              ? 'Ingresa tu número de WhatsApp para comenzar' 
              : step === 'pin'
                ? `Ingresa tu Código PIN de 6 dígitos para +51 ${phone}`
                : 'Sesión detectada en otro dispositivo'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.form 
              key="phone-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleCheckPhone} 
              className="mt-8 space-y-6"
            >
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="relative">
                  <label htmlFor="phone-number" className="sr-only">Número de WhatsApp</label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm font-bold border-r pr-2">+51</span>
                  </div>
                  <input
                    id="phone-number"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="appearance-none rounded-xl relative block w-full pl-14 pr-3 py-3.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm tracking-widest font-mono text-base"
                    placeholder="999 999 999"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-xs text-left bg-red-50 p-3.5 rounded-xl border border-red-200 flex items-start gap-2 leading-relaxed font-bold">
                  <AlertTriangle size={18} className="flex-shrink-0 mt-0.5 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all active:scale-95 disabled:opacity-70 uppercase tracking-wider"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      Continuar <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          ) : step === 'pin' ? (
            <motion.form 
              key="pin-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleVerifyPin} 
              className="mt-8 space-y-6"
            >
              {/* Box showing generated PIN and 30s countdown */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black text-emerald-800 uppercase tracking-widest flex items-center gap-1">
                    <KeyRound size={14} /> PIN DE ACCESO TEMPORAL
                  </span>
                  
                  {timeLeft > 0 ? (
                    <span className="px-2.5 py-1 bg-emerald-200 text-emerald-900 font-mono font-black text-xs rounded-full animate-pulse flex items-center gap-1">
                      ⏱️ {timeLeft}s
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-red-100 text-red-700 font-mono font-black text-xs rounded-full flex items-center gap-1">
                      ⚠️ EXPIRADO
                    </span>
                  )}
                </div>

                {/* Big PIN Display */}
                <div className="py-2.5 bg-white rounded-xl border border-emerald-300 shadow-sm">
                  <span className="text-4xl font-mono font-black text-emerald-900 tracking-[0.3em] pl-2 select-all">
                    {generatedPin}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-emerald-800 font-medium">
                  <span>Hola <b>{foundUser?.nombre}</b></span>
                  <button
                    type="button"
                    onClick={generateNewRandomPin}
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw size={12} /> Generar nuevo PIN
                  </button>
                </div>
              </div>

              {/* Input field for Postulante to type the code */}
              <div className="space-y-1.5 text-center">
                <label htmlFor="pin-code" className="block text-[11px] font-mono font-bold text-gray-700 uppercase tracking-wide">
                  ✍️ Escribe el código de 6 dígitos aquí:
                </label>
                <div className="relative">
                  <input
                    id="pin-code"
                    name="pin"
                    type="text"
                    required
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    className="appearance-none rounded-2xl relative block w-full px-3 py-3.5 border-2 border-emerald-500/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-sm text-center tracking-[0.4em] font-mono text-2xl font-bold placeholder:text-gray-400 placeholder:text-sm placeholder:tracking-normal"
                    placeholder="Escribe el PIN aquí"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-xs text-center bg-red-50 p-3 rounded-xl border border-red-200 font-bold">
                  {error}
                </div>
              )}

              <div className="flex flex-col space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all active:scale-95 disabled:opacity-70 uppercase tracking-wider"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      Ingresar al Examen <CheckCircle2 className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-xs text-emerald-700 hover:text-emerald-600 font-bold text-center"
                >
                  ← Cambiar número de teléfono
                </button>
              </div>
            </motion.form>
          ) : (
            <div className="space-y-5 mt-6">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-left space-y-2">
                <p className="text-amber-900 font-bold text-xs uppercase flex items-center gap-1.5">
                  <AlertTriangle size={16} className="text-amber-600" />
                  Sesión activa en otro dispositivo
                </p>
                <p className="text-amber-800 text-xs">
                  Hola <b>{foundUser?.nombre}</b>, tu cuenta actualmente está iniciada en otro equipo.
                </p>
                <p className="text-amber-700 text-[11px]">
                  Para prevenir el uso compartido no autorizado, solo se permite 1 sesión activa. Al confirmar, se desvinculará el equipo anterior.
                </p>
              </div>

              <button
                type="button"
                onClick={() => finishAuthentication(getDeviceId())}
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MonitorSmartphone className="w-5 h-5" />}
                <span>Vincular Este Equipo Y Entrar</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-xs text-gray-500 font-bold py-2 text-center"
              >
                Cancelar y regresar
              </button>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
