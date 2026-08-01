import React, { useState } from 'react';
import { 
  Terminal, 
  Database, 
  Settings, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  Code2,
  ChevronRight,
  ClipboardCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  instructions: string[];
  validation: string;
  code?: string;
}

export const TechnicalGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps: Step[] = [
    {
      id: 1,
      title: "Configuración en Supabase",
      description: "Habilitar el canal de comunicación para WhatsApp.",
      instructions: [
        "Ve al Dashboard de Supabase > Authentication > Providers.",
        "Busca 'Phone' y activa 'Enable Phone Provider'.",
        "Activa la opción 'Enable SMS Hook'. Esto le dice a Supabase: 'No envíes SMS tú mismo, envíale la orden a mi n8n'.",
        "En 'SMS Hook URL', pondrás el enlace de n8n que crearemos en el siguiente paso."
      ],
      validation: "Si ves el interruptor de 'Phone' en verde y la sección de 'SMS Hook' abierta, vas por buen camino.",
    },
    {
      id: 2,
      title: "Crear el 'Recibidor' en n8n",
      description: "Configurar el nodo Webhook para que escuche a Supabase.",
      instructions: [
        "En tu n8n, crea un nuevo Workflow y añade un nodo 'Webhook'.",
        "Configura el método como 'POST' y el Path como 'supabase-whatsapp'.",
        "Copia la 'Test URL' del nodo y pégala en Supabase (en el campo SMS Hook URL que dejamos pendiente).",
        "Supabase te enviará un JSON con el 'phone' y el 'message'."
      ],
      validation: "Haz clic en 'Listen for Test Event' en n8n e intenta pedir un código en la App. n8n debería recibir los datos.",
      code: `{
  "phone": "+51999...",
  "message": "Tu código es 123456..."
}`
    },
    {
      id: 3,
      title: "Conectar con Evolution API",
      description: "Enviar el mensaje real a través de WhatsApp.",
      instructions: [
        "Añade un nodo 'HTTP Request' después del Webhook en n8n.",
        "Método: POST.",
        "URL: https://TU-VPS-IP:8080/message/sendText/tu-instancia",
        "Headers: Añade 'apikey' con tu token de Evolution API.",
        "Body: Envía un JSON con 'number' (sacado del webhook) y 'text' (el mensaje)."
      ],
      validation: "El nodo HTTP Request debe devolver un código 200 o 201 y el mensaje debe llegar al teléfono.",
    }
  ];

  const toggleStep = (id: number) => {
    if (completedSteps.includes(id)) {
      setCompletedSteps(completedSteps.filter(s => s !== id));
    } else {
      setCompletedSteps([...completedSteps, id]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden my-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <ClipboardCheck className="mr-3 text-blue-400" />
              Checklist de Implementación
            </h2>
            <p className="text-slate-400 mt-2">Sigue estos pasos para activar el Login por WhatsApp</p>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-full text-sm font-medium">
            {completedSteps.length} de {steps.length} completados
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500" 
            style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar Steps */}
        <div className="w-full md:w-72 border-r border-gray-100 bg-gray-50/50 p-4 space-y-2">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${
                activeStep === step.id 
                ? 'bg-white shadow-md border-blue-100 text-blue-600' 
                : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs font-bold ${
                completedSteps.includes(step.id) 
                ? 'bg-green-500 text-white' 
                : (activeStep === step.id ? 'bg-blue-600 text-white' : 'bg-gray-300 text-white')
              }`}>
                {completedSteps.includes(step.id) ? <CheckCircle2 size={14} /> : step.id}
              </div>
              <span className="text-sm font-semibold text-left">{step.title}</span>
              {activeStep === step.id && <ChevronRight size={16} className="ml-auto" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          {steps.filter(s => s.id === activeStep).map(step => (
            <div key={step.id} className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                <button
                  onClick={() => toggleStep(step.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    completedSteps.includes(step.id)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {completedSteps.includes(step.id) ? (
                    <><CheckCircle2 size={18} /> <span>Paso Completado</span></>
                  ) : (
                    <span>Marcar como hecho</span>
                  )}
                </button>
              </div>

              <p className="text-gray-600 mb-8">{step.description}</p>

              <div className="space-y-6">
                <div>
                  <h4 className="flex items-center text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                    <Settings size={16} className="mr-2 text-blue-500" />
                    Instrucciones detalladas
                  </h4>
                  <ul className="space-y-4">
                    {step.instructions.map((inst, idx) => (
                      <li key={idx} className="flex items-start text-gray-700">
                        <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold mr-3 mt-0.5 shrink-0">
                          {idx + 1}
                        </div>
                        <span className="text-sm leading-relaxed">{inst}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {step.code && (
                  <div className="mt-6">
                    <h4 className="flex items-center text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                      <Code2 size={16} className="mr-2 text-purple-500" />
                      Ejemplo de datos
                    </h4>
                    <pre className="bg-slate-900 rounded-xl p-4 text-slate-300 text-xs font-mono overflow-x-auto border border-slate-700 shadow-inner">
                      {step.code}
                    </pre>
                  </div>
                )}

                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <h4 className="flex items-center text-sm font-bold text-blue-900 mb-2">
                    <AlertCircle size={16} className="mr-2" />
                    ¿Cómo saber si funcionó?
                  </h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {step.validation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-6 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500 italic">
          <HelpCircle size={16} className="mr-2" />
          Recuerda usar las URLs de PRODUCCIÓN de tu n8n para que funcione siempre.
        </div>
        <div className="flex space-x-4">
          <a 
            href="https://supabase.com/docs/guides/auth/auth-sms-hooks" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 text-sm font-semibold flex items-center hover:underline"
          >
            Documentación Supabase <ExternalLink size={14} className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};
