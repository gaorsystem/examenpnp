import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, Sparkles, CheckCircle, HelpCircle } from 'lucide-react';

interface FeatureItem {
  badge: string;
  text: string;
}

interface SectionHelpBannerProps {
  title: string;
  subtitle: string;
  features: FeatureItem[];
  tip?: string;
  defaultExpanded?: boolean;
}

export const SectionHelpBanner: React.FC<SectionHelpBannerProps> = ({
  title,
  subtitle,
  features,
  tip,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  return (
    <div className="bg-slate-900/90 dark:bg-slate-900/90 border border-amber-500/30 dark:border-amber-500/30 rounded-2xl p-3.5 sm:p-4 text-white shadow-lg transition-all space-y-3 mb-4">
      {/* Top row - Clickable header */}
      <div
        className="flex items-center justify-between gap-3 cursor-pointer group select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                ¿CÓMO FUNCIONA ESTA SECCIÓN?
              </span>
            </div>
            <h3 className="font-display font-extrabold text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors">
              {title}
            </h3>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30 shrink-0 transition-all"
        >
          <span>{isExpanded ? 'Ocultar Guía' : 'Ver Ayuda'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="pt-2 border-t border-slate-800 space-y-3 text-xs animate-fadeIn">
          <p className="text-slate-300 leading-relaxed font-sans">
            {subtitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl flex items-start gap-2"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-mono text-[9px] font-black uppercase text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 block w-fit">
                    {feat.badge}
                  </span>
                  <p className="text-[11px] text-slate-200 font-sans leading-tight">
                    {feat.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {tip && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl flex items-center gap-2 text-amber-200 text-[11px] font-sans">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>Consejo:</strong> {tip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
