import React, { useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ExamScreen } from './components/ExamScreen';
import { SRSReviewScreen } from './components/SRSReviewScreen';
import { NormPracticeScreen } from './components/NormPracticeScreen';
import { QuestionBankScreen } from './components/QuestionBankScreen';
import { WhatsAppBotSimulator } from './components/WhatsAppBotSimulator';
import { ExamResultsScreen } from './components/ExamResultsScreen';
import { CustomExamBuilder } from './components/CustomExamBuilder';
import { UserProfileModal } from './components/UserProfileModal';
import { OtpLoginModal } from './components/OtpLoginModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AudioAndBotExplainerModal } from './components/AudioAndBotExplainerModal';
import { Play, Zap, ArrowLeft, X, Home } from 'lucide-react';

import { Pregunta, IntentoExamen, UserProfile } from './types';
import {
  generarExamenSimulacro,
  getPreguntasPorNorma,
  barajar,
  BANCO_PREGUNTAS,
} from './data/questionsData';
import {
  getProfile,
  saveProfile,
  getHistorialIntentos,
  guardarIntento,
  calcularDominioPorMateria,
  calcularIndicadorPreparacionGlobal,
  getPreguntasPendientesSRS,
} from './lib/srsStorage';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getProfile());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('pnp_user_authenticated') === 'true';
  });
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [showExplainerModal, setShowExplainerModal] = useState<boolean>(false);

  // Theme State ('light' | 'dark')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('pnp_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  React.useEffect(() => {
    document.title = 'Simulacro PNP | Concurso de Ascenso Promoción 2027';
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('pnp_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLoginSuccess = (phone: string, grado?: string, nombre?: string) => {
    const updatedProfile: UserProfile = {
      ...userProfile,
      telefonoWhatsapp: phone,
      grado: grado || userProfile.grado,
      nombre: nombre || userProfile.nombre,
    };
    setUserProfile(updatedProfile);
    saveProfile(updatedProfile);
    localStorage.setItem('pnp_user_authenticated', 'true');
    setIsLoggedIn(true);
    setShowOtpModal(false);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('pnp_user_authenticated');
    setIsLoggedIn(false);
    setActiveTab('landing');
  };

  // Active Exam State
  const [activeExamPreguntas, setActiveExamPreguntas] = useState<Pregunta[]>([]);
  const [activeExamModo, setActiveExamModo] = useState<'simulacro' | 'repaso' | 'norma' | 'expres' | 'whatsapp'>('simulacro');
  const [activeExamNorma, setActiveExamNorma] = useState<string | undefined>(undefined);
  const [activeExamTiempoMin, setActiveExamTiempoMin] = useState<number>(20);

  // Completed Exam State
  const [lastCompletedIntento, setLastCompletedIntento] = useState<IntentoExamen | null>(null);

  // Derived stats
  const historialIntentos = getHistorialIntentos();
  const dominioMaterias = calcularDominioPorMateria();
  const indicadorGlobal = calcularIndicadorPreparacionGlobal();
  const pendientesSRS = getPreguntasPendientesSRS();

  const handleStartExamen = (
    modo: 'simulacro' | 'repaso' | 'norma' | 'expres' | 'whatsapp',
    numPreguntas: number = 20,
    normaNombre?: string
  ) => {
    let list: Pregunta[] = [];

    if (modo === 'simulacro') {
      list = generarExamenSimulacro(numPreguntas);
      setActiveExamTiempoMin(numPreguntas === 100 ? 120 : numPreguntas);
    } else if (modo === 'repaso') {
      list = pendientesSRS.length > 0 ? barajar(pendientesSRS) : barajar(BANCO_PREGUNTAS).slice(0, 15);
      setActiveExamTiempoMin(20);
    } else if (modo === 'norma' && normaNombre) {
      const qNorma = getPreguntasPorNorma(normaNombre);
      list = barajar(qNorma).slice(0, numPreguntas);
      setActiveExamTiempoMin(Math.max(10, numPreguntas));
    } else if (modo === 'expres') {
      list = barajar(BANCO_PREGUNTAS).slice(0, 10);
      setActiveExamTiempoMin(10);
    } else {
      list = barajar(BANCO_PREGUNTAS).slice(0, 15);
      setActiveExamTiempoMin(15);
    }

    setActiveExamPreguntas(list);
    setActiveExamModo(modo);
    setActiveExamNorma(normaNombre);
    setActiveTab('examen');
  };

  const handleStartCustomExamen = (
    preguntas: Pregunta[],
    tiempoMinutos: number,
    tituloSimulacro: string
  ) => {
    setActiveExamPreguntas(preguntas);
    setActiveExamModo('simulacro');
    setActiveExamNorma(tituloSimulacro);
    setActiveExamTiempoMin(tiempoMinutos);
    setActiveTab('examen');
  };

  const handleFinishExamen = (intento: IntentoExamen) => {
    guardarIntento(intento);
    setLastCompletedIntento(intento);
    setActiveTab('resultados');
  };

  const handleRetryFailures = () => {
    if (!lastCompletedIntento) return;

    const falladasIds = lastCompletedIntento.respuestas
      .filter((r) => !r.esCorrecta)
      .map((r) => r.preguntaId);

    const falladasPreguntas = BANCO_PREGUNTAS.filter((q) => falladasIds.includes(q.id));

    if (falladasPreguntas.length > 0) {
      setActiveExamPreguntas(barajar(falladasPreguntas));
      setActiveExamModo('repaso');
      setActiveExamNorma(undefined);
      setActiveExamTiempoMin(Math.max(10, falladasPreguntas.length));
      setActiveTab('examen');
    } else {
      handleStartExamen('simulacro', 20);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        isLoggedIn={isLoggedIn}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenOtpModal={() => setShowOtpModal(true)}
        onLogout={handleLogout}
        onQuickSimulacro={() => handleStartExamen('simulacro', 20)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* BARRA SUPERIOR UNIVERSAL DE REGRESO RÁPIDO PARA MÓVIL Y PC */}
        {activeTab !== 'landing' && activeTab !== 'dashboard' && (
          <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 rounded-2xl py-3 px-4 mb-5 shadow-lg flex items-center justify-between gap-3 transition-all">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 text-xs sm:text-sm font-display font-bold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 px-3.5 py-2 rounded-xl transition-all shadow-sm active-scale"
            >
              <ArrowLeft className="w-4 h-4 text-amber-500 shrink-0" />
              <span>← Volver a Mi Portal Principal</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 font-mono">
                Sección: <strong className="text-slate-900 dark:text-white uppercase">{activeTab}</strong>
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 transition-all active-scale"
              >
                <X className="w-4 h-4 text-red-500" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'landing' && (
          <LandingPage
            onStartSimulacro={(modo) => {
              if (!isLoggedIn) {
                setShowOtpModal(true);
              } else {
                handleStartExamen(modo, modo === 'expres' ? 10 : 20);
              }
            }}
            onNavigateTab={(tab) => {
              if (tab !== 'landing' && !isLoggedIn) {
                setShowOtpModal(true);
              } else {
                setActiveTab(tab);
              }
            }}
            onOpenExplainer={() => setShowExplainerModal(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            userProfile={userProfile}
            indicadorGlobal={indicadorGlobal}
            dominioMaterias={dominioMaterias}
            pendientesSRSCount={pendientesSRS.length}
            historialIntentos={historialIntentos}
            onStartExamen={handleStartExamen}
            onNavigateTab={setActiveTab}
            onOpenExplainer={() => setShowExplainerModal(true)}
          />
        )}

        {activeTab === 'crear-simulacro' && (
          <CustomExamBuilder onStartCustomExamen={handleStartCustomExamen} />
        )}

        {activeTab === 'simulacro' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 text-slate-800 dark:text-slate-100 shadow-md">
              <h2 className="font-serif text-2xl font-extrabold mb-2 text-slate-900 dark:text-white">Simulacro Completo de Ascenso PNP 2026</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                Selecciona la modalidad de examen que deseas rendir. Se extraerán preguntas mezcladas del banco oficial de 1,500 preguntas (50% Materias Comunes, 50% Materias de Especialidad).
              </p>
            </div>

            <ExamScreen
              modo="simulacro"
              preguntas={generarExamenSimulacro(20)}
              tiempoLimiteMinutos={20}
              onFinishExamen={handleFinishExamen}
              onCancelExamen={() => setActiveTab('dashboard')}
            />
          </div>
        )}

        {activeTab === 'repaso' && (
          <SRSReviewScreen
            preguntas={pendientesSRS.length > 0 ? pendientesSRS : barajar(BANCO_PREGUNTAS).slice(0, 15)}
            onFinishReview={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'normas' && (
          <NormPracticeScreen
            onStartExamenNorma={(normaNombre, cantidad) =>
              handleStartExamen('norma', cantidad, normaNombre)
            }
          />
        )}

        {activeTab === 'banco' && <QuestionBankScreen />}

        {activeTab === 'whatsapp' && <WhatsAppBotSimulator userProfile={userProfile} />}

        {activeTab === 'examen' && (
          <ExamScreen
            modo={activeExamModo}
            normaFiltro={activeExamNorma}
            preguntas={activeExamPreguntas}
            tiempoLimiteMinutos={activeExamTiempoMin}
            onFinishExamen={handleFinishExamen}
            onCancelExamen={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'resultados' && lastCompletedIntento && (
          <ExamResultsScreen
            intento={lastCompletedIntento}
            userProfile={userProfile}
            onRetryFailures={handleRetryFailures}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}
      </main>

      {/* Footer - Simplified for mobile */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-center text-[10px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 space-y-1 mt-auto">
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          Simulador PNP 2026
        </p>
        <p className="hidden sm:block">
          RD N° 006857-2026-DIRREHUM-PNP/JE · Promoción 2027
        </p>
        <p>
          1,500 Preguntas Oficiales · PNP Ascenso
        </p>
      </footer>

      {/* Mobile Floating Action CTA */}
      {activeTab !== 'examen' && (
        <div className="fixed bottom-4 right-4 z-40 md:hidden">
          <button
            onClick={() => handleStartExamen('simulacro', 20)}
            className="bg-[#A6822E] hover:bg-[#C9A94A] text-[#182A20] font-mono font-extrabold text-xs px-4 py-3 rounded-full shadow-2xl border-2 border-[#C9A94A] flex items-center gap-2 animate-bounce"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>EXAMEN RÁPIDO</span>
          </button>
        </div>
      )}

      {/* Profile & Settings Modal */}
      {showProfileModal && (
        <UserProfileModal
          userProfile={userProfile}
          onClose={() => setShowProfileModal(false)}
          onProfileUpdated={(updated) => setUserProfile(updated)}
          onOpenTab={(tab) => setActiveTab(tab)}
          onLogout={handleLogout}
        />
      )}

      {/* OTP Phone Authentication Modal */}
      {showOtpModal && (
        <OtpLoginModal
          userProfile={userProfile}
          onClose={() => setShowOtpModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Interactive Guide Modal for Audio-Lectura & WhatsApp Bot */}
      {showExplainerModal && (
        <AudioAndBotExplainerModal
          onClose={() => setShowExplainerModal(false)}
          onOpenWhatsAppSimulator={() => setActiveTab('whatsapp')}
        />
      )}

      {/* Native Mobile Bottom Navigation Bar (Hidden on Desktop) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        onOpenOtpModal={() => setShowOtpModal(true)}
      />
    </div>
  );
}

