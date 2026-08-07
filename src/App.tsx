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
import { GuideHelpModal } from './components/GuideHelpModal';
import { AuthFlow } from './components/auth/AuthFlow';
import { UserManagement } from './components/admin/UserManagement';
import { Play, Zap, ArrowLeft, X, Home } from 'lucide-react';

import { supabase } from './lib/supabase';
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
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const base = getProfile();
    return { ...base, role: 'student', dni: '' }; // Default role and empty dni
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [session, setSession] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [showExplainerModal, setShowExplainerModal] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

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

  React.useEffect(() => {
    if (!supabase) return;

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoggedIn(!!session);
      if (session?.user) {
        // Load profile from DB if it exists
        loadProfileFromSupabase(session.user.id, session.user.phone, session.user.email);
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoggedIn(!!session);
      if (session?.user) {
        loadProfileFromSupabase(session.user.id, session.user.phone);
      } else {
        setActiveTab('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfileFromSupabase = async (userId: string, phone?: string, email?: string) => {
    if (!supabase) return;

    // 1. Intentar buscar por user_id (usuario ya vinculado)
    let { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // 2. Si no existe, intentar buscar por teléfono (pre-registrado por admin)
    if (!profileData && phone) {
      const { data: phoneMatch } = await supabase
        .from('profiles')
        .select('*')
        .eq('telefono_whatsapp', phone)
        .is('user_id', null)
        .single();

      if (phoneMatch) {
        // Vincular perfil pre-existente con la ID de autenticación actual
        const { data: linked } = await supabase
          .from('profiles')
          .update({ user_id: userId })
          .eq('id', phoneMatch.id)
          .select()
          .single();
        
        profileData = linked;
      }
    }

    // 3. Solo el administrador maestro puede crear su perfil automáticamente si no existe
    if (!profileData && email === 'gaorsystem@gmail.com') {
       const { data: created, error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          telefono_whatsapp: phone || '',
          nombre: 'Administrador Maestro',
          plan: 'premium',
          role: 'admin',
          meta_preguntas_diarias: 100
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating admin profile:', createError);
      } else {
        profileData = created;
      }
    }

    if (profileData) {
      setUserProfile((prev) => ({
        ...prev,
        id: profileData.id,
        userId: profileData.user_id,
        nombre: profileData.nombre || prev.nombre,
        grado: profileData.grado || prev.grado,
        dni: profileData.dni || prev.dni,
        cip: profileData.cip || prev.cip,
        telefonoWhatsapp: profileData.telefono_whatsapp || prev.telefonoWhatsapp,
        metaPreguntasDiarias: profileData.meta_preguntas_diarias || prev.metaPreguntasDiarias,
        plan: profileData.plan || prev.plan,
        role: (email === 'gaorsystem@gmail.com' ? 'admin' : profileData.role) || 'student',
      }));
    } else if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error loading profile:', profileError);
    }

    // Load Exam Attempts
    const { data: attemptsData } = await supabase
      .from('exam_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('fecha', { ascending: false });

    if (attemptsData) {
      const formatted = attemptsData.map(a => ({
        id: a.id,
        modo: a.tipo.toLowerCase(),
        normaFiltro: a.materia === 'GENERAL' ? undefined : a.materia,
        totalPreguntas: a.total_preguntas,
        aciertos: a.aciertos,
        duracionSeg: a.tiempo_empleado_seg,
        fecha: a.fecha,
        respuestas: a.respuestas
      }));
      import('./lib/srsStorage').then(m => m.setHistorialIntentos(formatted));
    }

    // Load SRS Progress
    const { data: srsData } = await supabase
      .from('srs_progress')
      .select('*')
      .eq('user_id', userId);

    if (srsData) {
      const srsMap: any = {};
      srsData.forEach(s => {
        srsMap[s.pregunta_id] = {
          preguntaId: s.pregunta_id,
          facilidad: s.facilidad,
          intervaloDias: s.intervalo_dias,
          proximaRevision: s.proxima_revision,
          rachaCorrectas: s.racha_correctas,
          fallosTotales: s.fallos_totales,
          revisionesTotales: s.revisiones_totales,
          ultimaRevision: s.ultima_revision
        };
      });
      import('./lib/srsStorage').then(m => m.setProgresoSRSMap(srsMap));
    }

    // Load Favorites
    const { data: favsData } = await supabase
      .from('favorites')
      .select('pregunta_id')
      .eq('user_id', userId);

    if (favsData) {
      const favs = favsData.map(f => f.pregunta_id);
      import('./lib/srsStorage').then(m => m.setFavoritos(favs));
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLoginSuccess = (phone: string, grado?: string, nombre?: string, profileData?: any) => {
    setShowOtpModal(false);
    setIsLoggedIn(true);
    if (phone === 'ADMIN_BYPASS') {
      setUserProfile(prev => ({
        ...prev,
        nombre: nombre || 'Administrador',
        grado: grado || 'Admin',
        role: 'admin',
        plan: 'premium'
      }));
      setActiveTab('admin');
    } else {
      setUserProfile(prev => ({
        ...prev,
        id: profileData?.id || prev.id,
        nombre: profileData?.nombre || nombre || `Postulante (${phone.slice(-4)})`,
        grado: profileData?.grado || grado || 'Suboficial PNP',
        telefonoWhatsapp: phone,
        plan: profileData?.plan || 'premium',
        role: profileData?.role || 'student'
      }));
      setActiveTab('dashboard');
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
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

  if (!isLoggedIn && activeTab !== 'landing') {
    return <AuthFlow onAuthenticated={() => {
      setIsLoggedIn(true);
      setActiveTab('dashboard');
    }} />;
  }

  return (
    <div className="min-h-screen bg-[#02281e] text-slate-100 flex flex-col font-sans transition-colors duration-200">
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
        onOpenGuideModal={() => setShowGuideModal(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Navigation Breadcrumb/Back button */}
        {activeTab !== 'landing' && activeTab !== 'dashboard' && (
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/80 rounded-2xl p-2 mb-6 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Portal
            </button>
            <span className="text-[10px] font-mono text-slate-400 uppercase mr-3">
              Sección: {activeTab}
            </span>
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
            onOpenOtpModal={() => setShowOtpModal(true)}
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

        {activeTab === 'admin' && (
          <div className="max-w-7xl mx-auto px-4">
            <UserManagement userProfile={userProfile} />
          </div>
        )}

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
      <footer className="bg-[#011e17] border-t border-[#053d2f] py-6 px-4 text-center text-[10px] sm:text-xs font-mono text-emerald-300/80 space-y-1 mt-auto">
        <p className="font-semibold text-emerald-200">
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
      {!['examen', 'simulacro', 'repaso'].includes(activeTab) && (
        <div className="fixed bottom-20 right-4 z-40 md:hidden">
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

      {/* General Visual Guide Help Modal */}
      <GuideHelpModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />

      {/* Native Mobile Bottom Navigation Bar (Hidden on Desktop) */}
      {!['examen', 'simulacro', 'repaso'].includes(activeTab) && (
        <MobileBottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLoggedIn={isLoggedIn}
          onOpenOtpModal={() => setShowOtpModal(true)}
          userProfile={userProfile}
        />
      )}
    </div>
  );
}

