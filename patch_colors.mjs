import fs from 'fs';

let content = fs.readFileSync('src/components/SimulacroHubScreen.tsx', 'utf8');

// Replace hardcoded title hover
content = content.replace(
  'hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"',
  'transition-colors ${p.hoverText}"'
);

// Replace "Ver temario" button colors
content = content.replace(
  'text-[#127e57] dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-[#d4f7e2]/70 dark:bg-emerald-950/50 hover:bg-[#d4f7e2] dark:hover:bg-emerald-900/50',
  '${p.badgeText} flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg ${p.badgeBg} hover:opacity-80'
);

// Replace "Elegir" button selected colors
content = content.replace(
  `'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-400'`,
  `\`\${p.badgeBg} \${p.badgeText} border \${p.border}\``
);

// Replace "Elegir" button hover colors
content = content.replace(
  `'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 border border-slate-200 dark:border-slate-700'`,
  `\`bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:\${p.bgCheck} \${p.hoverText} border border-slate-200 dark:border-slate-700\``
);

// Replace inner CheckSquare/Square icons
content = content.replace(
  `<CheckSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-emerald-400" />`,
  `<CheckSquare className={\`w-3 h-3 sm:w-3.5 sm:h-3.5 \${p.badgeText}\`} />`
);

// Dar examen directo - we leave this one as emerald (or standard primary) to keep it as a distinct CTA, 
// wait, we can also tint it:
content = content.replace(
  `className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-all shadow-sm shadow-emerald-900/20 active-scale flex items-center gap-1.5"`,
  `className={\`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs text-white \${p.iconBg} hover:opacity-90 transition-all shadow-sm active-scale flex items-center gap-1.5\`}`
);

fs.writeFileSync('src/components/SimulacroHubScreen.tsx', content);
console.log("Patched other colors");
