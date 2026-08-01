import React from 'react';
import { 
  Terminal, 
  Database, 
  Settings, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  Code2
} from 'lucide-react';

export const TechnicalGuide: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-slate-900 p-6 text-white">
        <h2 className="text-xl font-bold flex items-center">
          <Terminal className="mr-2 text-blue-400" />
          Guía Técnica: Conexión Supabase + n8n + Evolution API
        </h2>
        <p className="text-slate-400 text-sm mt-1">Sigue estos pasos para habilitar el acceso por WhatsApp.</p>
      </div>

      <div className="p-6 space-y-8">
        {/* Step 1 */}
        <section>
          <div className="flex items-start mb-4">
            <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 shrink-0">1</div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Configurar SMS Hook en Supabase</h3>
              <p className="text-gray-600 text-sm">Supabase usará tu VPS para enviar los códigos.</p>
            </div>
          </div>
          <div className="ml-11 bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
            <div className="flex items-center text-sm text-gray-700">
              <CheckCircle2 size={16} className="text-green-500 mr-2" />
              <span>Ve a <strong>Authentication {'>'} Providers {'>'} Phone</strong></span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <CheckCircle2 size={16} className="text-green-500 mr-2" />
              <span>Activa <strong>Enable Phone Provider</strong></span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <CheckCircle2 size={16} className="text-green-500 mr-2" />
              <span>Activa <strong>Enable SMS Hook</strong></span>
            </div>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800">
              <strong>URL del Webhook:</strong> Pon la URL de n8n que crearemos en el paso 2.<br/>
              <strong>Secret:</strong> Genera uno y guárdalo (se usará para validar que la petición viene de Supabase).
            </div>
          </div>
        </section>

        {/* Step 2 */}
        <section>
          <div className="flex items-start mb-4">
            <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 shrink-0">2</div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Flujo n8n (Webhook)</h3>
              <p className="text-gray-600 text-sm">Crea un flujo simple para procesar el envío.</p>
            </div>
          </div>
          <div className="ml-11 space-y-4">
            <div className="bg-slate-800 rounded-xl p-4 text-slate-300 text-xs font-mono">
              <p className="text-blue-400 mb-2">// Estructura que recibirá el Webhook:</p>
              {"{"} "phone": "+51999888777", "message": "Tu código es 123456" {"}"}
            </div>
            <p className="text-sm text-gray-600">
              El flujo debe ser: <strong>Webhook (POST)</strong> {'>'} <strong>HTTP Request (Evolution API)</strong>.
            </p>
          </div>
        </section>

        {/* Step 3 */}
        <section>
          <div className="flex items-start mb-4">
            <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 shrink-0">3</div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Evolution API (Enviar Mensaje)</h3>
              <p className="text-gray-600 text-sm">Configura el nodo HTTP Request en n8n.</p>
            </div>
          </div>
          <div className="ml-11 bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="space-y-2">
              <div className="grid grid-cols-3 text-xs gap-2">
                <span className="font-bold">Método:</span> <span className="col-span-2">POST</span>
                <span className="font-bold">URL:</span> <span className="col-span-2 text-blue-600">https://tu-vps.com/message/sendText/tu-instancia</span>
                <span className="font-bold">Header:</span> <span className="col-span-2">apikey: TU_TOKEN</span>
              </div>
              <div className="mt-3 p-2 bg-white rounded border text-[10px] font-mono">
                Body (JSON):<br/>
                {"{"} "number": "$json.phone", "text": "$json.message" {"}"}
              </div>
            </div>
          </div>
        </section>

        <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <Database size={16} className="mr-2" />
            Postgres y Supabase sincronizados
          </div>
          <a 
            href="https://supabase.com/docs/guides/auth/auth-sms-hooks" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 text-sm font-medium flex items-center hover:underline"
          >
            Docs oficiales <ExternalLink size={14} className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};
