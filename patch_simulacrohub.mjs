import fs from 'fs';

let content = fs.readFileSync('src/components/SimulacroHubScreen.tsx', 'utf8');

// Define color palettes
const colorLogic = `
          {todasLasNormas.map((norma, index) => {
            
            // Generate a deterministic color palette based on index
            const palettes = [
              { border: 'border-red-200 dark:border-red-900', ring: 'ring-red-500/20', bgCheck: 'bg-red-50/20 dark:bg-red-950/10', badgeBg: 'bg-red-100 dark:bg-red-900/80', badgeText: 'text-red-700 dark:text-red-300', iconBg: 'bg-red-600', hoverText: 'hover:text-red-700 dark:hover:text-red-400' },
              { border: 'border-blue-200 dark:border-blue-900', ring: 'ring-blue-500/20', bgCheck: 'bg-blue-50/20 dark:bg-blue-950/10', badgeBg: 'bg-blue-100 dark:bg-blue-900/80', badgeText: 'text-blue-700 dark:text-blue-300', iconBg: 'bg-blue-600', hoverText: 'hover:text-blue-700 dark:hover:text-blue-400' },
              { border: 'border-amber-200 dark:border-amber-900', ring: 'ring-amber-500/20', bgCheck: 'bg-amber-50/20 dark:bg-amber-950/10', badgeBg: 'bg-amber-100 dark:bg-amber-900/80', badgeText: 'text-amber-700 dark:text-amber-300', iconBg: 'bg-amber-600', hoverText: 'hover:text-amber-700 dark:hover:text-amber-400' },
              { border: 'border-emerald-200 dark:border-emerald-900', ring: 'ring-emerald-500/20', bgCheck: 'bg-emerald-50/20 dark:bg-emerald-950/10', badgeBg: 'bg-emerald-100 dark:bg-emerald-900/80', badgeText: 'text-emerald-700 dark:text-emerald-300', iconBg: 'bg-emerald-600', hoverText: 'hover:text-emerald-700 dark:hover:text-emerald-400' },
              { border: 'border-purple-200 dark:border-purple-900', ring: 'ring-purple-500/20', bgCheck: 'bg-purple-50/20 dark:bg-purple-950/10', badgeBg: 'bg-purple-100 dark:bg-purple-900/80', badgeText: 'text-purple-700 dark:text-purple-300', iconBg: 'bg-purple-600', hoverText: 'hover:text-purple-700 dark:hover:text-purple-400' },
              { border: 'border-rose-200 dark:border-rose-900', ring: 'ring-rose-500/20', bgCheck: 'bg-rose-50/20 dark:bg-rose-950/10', badgeBg: 'bg-rose-100 dark:bg-rose-900/80', badgeText: 'text-rose-700 dark:text-rose-300', iconBg: 'bg-rose-600', hoverText: 'hover:text-rose-700 dark:hover:text-rose-400' },
              { border: 'border-cyan-200 dark:border-cyan-900', ring: 'ring-cyan-500/20', bgCheck: 'bg-cyan-50/20 dark:bg-cyan-950/10', badgeBg: 'bg-cyan-100 dark:bg-cyan-900/80', badgeText: 'text-cyan-700 dark:text-cyan-300', iconBg: 'bg-cyan-600', hoverText: 'hover:text-cyan-700 dark:hover:text-cyan-400' },
              { border: 'border-fuchsia-200 dark:border-fuchsia-900', ring: 'ring-fuchsia-500/20', bgCheck: 'bg-fuchsia-50/20 dark:bg-fuchsia-950/10', badgeBg: 'bg-fuchsia-100 dark:bg-fuchsia-900/80', badgeText: 'text-fuchsia-700 dark:text-fuchsia-300', iconBg: 'bg-fuchsia-600', hoverText: 'hover:text-fuchsia-700 dark:hover:text-fuchsia-400' },
              { border: 'border-indigo-200 dark:border-indigo-900', ring: 'ring-indigo-500/20', bgCheck: 'bg-indigo-50/20 dark:bg-indigo-950/10', badgeBg: 'bg-indigo-100 dark:bg-indigo-900/80', badgeText: 'text-indigo-700 dark:text-indigo-300', iconBg: 'bg-indigo-600', hoverText: 'hover:text-indigo-700 dark:hover:text-indigo-400' },
              { border: 'border-teal-200 dark:border-teal-900', ring: 'ring-teal-500/20', bgCheck: 'bg-teal-50/20 dark:bg-teal-950/10', badgeBg: 'bg-teal-100 dark:bg-teal-900/80', badgeText: 'text-teal-700 dark:text-teal-300', iconBg: 'bg-teal-600', hoverText: 'hover:text-teal-700 dark:hover:text-teal-400' },
              { border: 'border-orange-200 dark:border-orange-900', ring: 'ring-orange-500/20', bgCheck: 'bg-orange-50/20 dark:bg-orange-950/10', badgeBg: 'bg-orange-100 dark:bg-orange-900/80', badgeText: 'text-orange-700 dark:text-orange-300', iconBg: 'bg-orange-600', hoverText: 'hover:text-orange-700 dark:hover:text-orange-400' }
            ];
            const p = palettes[index % palettes.length];
`;

content = content.replace('{todasLasNormas.map((norma) => {', colorLogic);

// Replace selected style
const selectedStyle = `                    ? 'border-2 border-emerald-600 ring-2 ring-emerald-500/20 shadow-md bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-emerald-100/90 dark:border-slate-800'`;
const newSelectedStyle = `                    ? \`border-2 \${p.border} ring-2 \${p.ring} shadow-md \${p.bgCheck}\`
                    : 'border-slate-200 dark:border-slate-800'`;
content = content.replace(selectedStyle, newSelectedStyle);

// Image
content = content.replace(`src={cardInfo.imagen}`, `src={norma.imagen || cardInfo.imagen}`);

// Replace Icon bg
const iconBg = `bg-emerald-600 text-white`;
const newIconBg = `\${p.iconBg} text-white`;
content = content.replace(iconBg, newIconBg);

// Replace category badge
const catBadge = `bg-[#d4f7e2] dark:bg-emerald-950/80 text-[#127e57] dark:text-emerald-300`;
const newCatBadge = `\${p.badgeBg} \${p.badgeText}`;
content = content.replace(catBadge, newCatBadge);

// Replace Title hover
const titleHover = `hover:text-emerald-700 dark:hover:text-emerald-400`;
const newTitleHover = `\${p.hoverText}`;
content = content.replace(titleHover, newTitleHover);

fs.writeFileSync('src/components/SimulacroHubScreen.tsx', content);
console.log("Patched SimulacroHubScreen colors");
