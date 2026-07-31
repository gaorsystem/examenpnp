import React, { useState } from 'react';
import { X, Shield, User, Check, CreditCard, Database, FileCode, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';
import { saveProfile } from '../lib/srsStorage';

interface UserProfileModalProps {
  userProfile: UserProfile;
  onClose: () => void;
  onProfileUpdated: (updated: UserProfile) => void;
  onOpenTab?: (tab: string) => void;
  onLogout?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  userProfile,
  onClose,
  onProfileUpdated,
  onOpenTab,
  onLogout,
}) => {
  const [nombre, setNombre] = useState(userProfile.nombre);
  const [grado, setGrado] = useState(userProfile.grado);
  const [cip, setCip] = useState(userProfile.cip);
  const [telefonoWhatsapp, setTelefonoWhatsapp] = useState(userProfile.telefonoWhatsapp);
  const [metaPreguntasDiarias, setMetaPreguntasDiarias] = useState(userProfile.metaPreguntasDiarias);
  const [activeTab, setActiveTab] = useState<'perfil' | 'whatsapp' | 'convocatoria' | 'plan' | 'supabase'>('perfil');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      nombre,
      grado,
      cip,
      telefonoWhatsapp,
      metaPreguntasDiarias,
    };

    saveProfile(updated);
    onProfileUpdated(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const sqlSchema = `-- =========================================================
-- ESQUEMA SUPABASE — Simulador de Ascenso PNP 2026
-- Basado en: RD N° 006857-2026-DIRREHUM-PNP/JE
-- =========================================================

create table normas (
  id serial primary key,
  grupo text not null check (grupo in ('COMUNES','ESPECIALIDAD')),
  nombre text not null,
  slug text unique not null
);

create table preguntas (
  id bigint primary key,
  norma_id int references normas(id),
  enunciado text not null,
  opciones jsonb not null,
  respuesta_correcta text not null,
  ubicacion text,
  activo boolean default true
);

create table perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  telefono_whatsapp text unique,
  plan text default 'free' check (plan in ('free','premium')),
  creado_en timestamptz default now()
);`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl max-w-2xl w-full text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="bg-slate-100 dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Perfil del Postulante & Configuración</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-6 text-xs font-mono scrollbar-none">
          <button
            onClick={() => setActiveTab('perfil')}
            className={`py-3 px-4 font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'perfil'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Datos Personales
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`py-3 px-4 font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'whatsapp'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Bot WhatsApp
          </button>

          <button
            onClick={() => setActiveTab('convocatoria')}
            className={`py-3 px-4 font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'convocatoria'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Guía Convocatoria
          </button>

          <button
            onClick={() => setActiveTab('plan')}
            className={`py-3 px-4 font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'plan'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Suscripción / Plan
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`py-3 px-4 font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'supabase'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Esquema SQL
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs font-sans">
          {activeTab === 'perfil' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                    Grado Policial:
                  </label>
                  <select
                    value={grado}
                    onChange={(e) => setGrado(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:outline-none focus:border-amber-500 font-mono"
                  >
                    <option value="S3 PNP">S3 PNP - Suboficial de Tercera</option>
                    <option value="S2 PNP">S2 PNP - Suboficial de Segunda</option>
                    <option value="S1 PNP">S1 PNP - Suboficial de Primera</option>
                    <option value="ST3 PNP">ST3 PNP - Suboficial Técnico de 3ra</option>
                    <option value="ST2 PNP">ST2 PNP - Suboficial Técnico de 2da</option>
                    <option value="ST1 PNP">ST1 PNP - Suboficial Técnico de 1ra</option>
                    <option value="SB PNP">SB PNP - Suboficial Brigadier</option>
                    <option value="SS PNP">SS PNP - Suboficial Superior</option>
                    <option value="Oficial PNP">Oficial PNP</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                    Nombres y Apellidos:
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                    CIP (Carné Identificación Policial):
                  </label>
                  <input
                    type="text"
                    value={cip}
                    onChange={(e) => setCip(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                    Teléfono WhatsApp (Notificaciones):
                  </label>
                  <input
                    type="text"
                    value={telefonoWhatsapp}
                    onChange={(e) => setTelefonoWhatsapp(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                  Meta Diaria de Preguntas:
                </label>
                <input
                  type="number"
                  min={5}
                  max={200}
                  value={metaPreguntasDiarias}
                  onChange={(e) => setMetaPreguntasDiarias(Number(e.target.value))}
                  className="w-32 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-4">
                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/30 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all active-scale"
                  >
                    Cerrar Sesión
                  </button>
                )}
                
                {savedSuccess && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> ¡Guardado!
                  </span>
                )}
                
                <button
                  type="submit"
                  className="ml-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all active-scale"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          )}

          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-base text-emerald-800 dark:text-emerald-300">
                    Bot de Entrenamiento por WhatsApp PNP
                  </h4>
                  <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold">
                    EN LÍNEA
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Recibe preguntas diarias, micro-simulacros y retroalimentación normativa directamente en tu WhatsApp configurado (<strong className="text-slate-900 dark:text-white">{telefonoWhatsapp || 'Sin número registrado'}</strong>).
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenTab) onOpenTab('whatsapp');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all active-scale"
                  >
                    Abrir Chat Interactivo del Bot
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-xl bg-slate-100 dark:bg-slate-900 space-y-2 text-xs">
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold block">Comandos del Bot por WhatsApp:</span>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 font-mono text-[11px] list-disc pl-4">
                  <li><strong>SIMULACRO</strong>: Recibe un examen exprés de 10 preguntas.</li>
                  <li><strong>BANCO [palabra]</strong>: Busca normas o preguntas por palabra clave.</li>
                  <li><strong>ESTADO</strong>: Consulta tu avance y porcentaje de dominio.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'convocatoria' && (
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl space-y-2">
                <h4 className="font-display font-bold text-base text-amber-700 dark:text-amber-400">
                  Resolución Directoral N° 006857-2026-DIRREHUM-PNP/JE
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Bases del Concurso de Ascenso de Suboficiales de Armas y Servicios de la Policía Nacional del Perú — Promoción 2027.
                </p>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-xl bg-slate-100 dark:bg-slate-900 space-y-2 font-mono text-xs">
                <span className="text-slate-900 dark:text-white font-bold block">Estructura de la Evaluación de Conocimientos:</span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc pl-4">
                  <li><strong>1,500 Preguntas Oficiales</strong> publicadas en el balotario institucional.</li>
                  <li><strong>50% Materias Comunes</strong> (Código Penal, NCPP, Constitución, Regímenes Disciplinarios).</li>
                  <li><strong>50% Materias de Especialidad</strong> (Manuales Operativos, Criminalística, Tránsito).</li>
                  <li><strong>Puntaje Mínimo de Aprobación:</strong> 65% de dominio.</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenTab) onOpenTab('landing');
                }}
                className="w-full bg-slate-900 dark:bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 py-2.5 rounded-xl font-mono text-xs font-bold transition-all active-scale"
              >
                Ver Portada y Guía de Convocatoria Completa
              </button>
            </div>
          )}

          {activeTab === 'plan' && (
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-display font-bold text-base text-emerald-800 dark:text-emerald-300">Plan Premium Activo</h4>
                  <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold">
                    ACCESO ILIMITADO
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Tu cuenta dispone de acceso completo a las 1,500 preguntas oficiales, algoritmo SM-2 de repetición espaciada y simulador de WhatsApp.
                </p>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-xl bg-slate-100 dark:bg-slate-900 space-y-2 font-mono text-xs">
                <span className="text-amber-600 dark:text-amber-400 font-bold block">Pasarelas de Pago Disponibles en la App:</span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc pl-4">
                  <li>Yape / Plin (Confirmación automática vía código QR)</li>
                  <li>Culqi / Mercado Pago (Tarjetas Visa / Mastercard)</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'supabase' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-slate-600 dark:text-slate-300">Estructura de Base de Datos PostgreSQL / Supabase:</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(sqlSchema);
                    alert('¡Esquema SQL copiado al portapapeles!');
                  }}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  <FileCode className="w-3.5 h-3.5 text-amber-500" /> Copiar SQL
                </button>
              </div>

              <pre className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-72 scrollbar-thin">
                {sqlSchema}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
