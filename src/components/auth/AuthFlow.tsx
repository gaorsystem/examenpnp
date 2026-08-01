import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Lock, ArrowRight, CheckCircle2, Loader2, MessageSquare } from 'lucide-react';

interface AuthFlowProps {
  onAuthenticated: (userId: string) => void;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({ onAuthenticated }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    
    setLoading(true);
    setError(null);
    setMessage(null);

    // Limpiar el teléfono: solo números
    let cleanPhone = phone.replace(/\D/g, '');
    
    // Si no empieza con 51 (Perú) y tiene 9 dígitos, asumimos Perú
    if (cleanPhone.length === 9 && !cleanPhone.startsWith('51')) {
      cleanPhone = '51' + cleanPhone;
    }
    
    const formattedPhone = '+' + cleanPhone;

    try {
      // 1. Verificar si el usuario está registrado por el administrador
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('telefono_whatsapp', formattedPhone)
        .single();

      if (profileError || !profile) {
        throw new Error('Número de celular no registrado. Por favor, contacta con el administrador del sistema.');
      }

      console.log('Solicitando OTP para:', formattedPhone);
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        console.error('Error de Supabase Auth:', error);
        if (error.message.includes('Unsupported phone provider')) {
          throw new Error('Configuración pendiente: Activa "Phone" en Supabase (Auth > Providers) y asegúrate que el SMS Hook esté guardado.');
        }
        throw error;
      }

      setStep('otp');
      setMessage('Código enviado por WhatsApp');
    } catch (err: any) {
      console.error('Error enviando OTP:', err);
      setError(err.message || 'Error al enviar el código. Verifica el número.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setError(null);

    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 9 && !cleanPhone.startsWith('51')) {
      cleanPhone = '51' + cleanPhone;
    }
    const formattedPhone = '+' + cleanPhone;

    try {
      console.log('Verificando OTP para:', formattedPhone, 'Código:', otp);
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms', 
      });

      if (error) throw error;

      if (data.user) {
        onAuthenticated(data.user.id);
      }
    } catch (err: any) {
      console.error('Error verificando OTP:', err);
      setError('Código incorrecto o expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
      >
        <div>
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Smartphone className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Simulacro PNP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 'phone' 
              ? 'Ingresa tu número de WhatsApp para comenzar' 
              : 'Ingresa el código que recibiste por WhatsApp'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.form 
              key="phone-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSendOtp} 
              className="mt-8 space-y-6"
            >
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="relative">
                  <label htmlFor="phone-number" className="sr-only">Número de WhatsApp</label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">+51</span>
                  </div>
                  <input
                    id="phone-number"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="appearance-none rounded-xl relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="999 999 999"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      Enviar Código <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.form 
              key="otp-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleVerifyOtp} 
              className="mt-8 space-y-6"
            >
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="relative">
                  <label htmlFor="otp-code" className="sr-only">Código de verificación</label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="otp-code"
                    name="otp"
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center tracking-[1em] font-mono text-xl"
                    placeholder="000000"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex flex-col space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      Verificar Código <CheckCircle2 className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Cambiar número de teléfono
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-400">
          <MessageSquare className="h-4 w-4" />
          <span>El código te llegará vía WhatsApp</span>
        </div>
      </motion.div>
    </div>
  );
};
