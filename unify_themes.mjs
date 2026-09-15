import fs from 'fs';
import path from 'path';

const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

// Standard colors for consistency
const COLORS = {
  // BG
  LIGHT_BG: 'bg-slate-50',
  DARK_BG: 'dark:bg-[#011611]',
  LIGHT_CARD: 'bg-white',
  DARK_CARD: 'dark:bg-[#02281e]',
  LIGHT_INNER: 'bg-slate-100',
  DARK_INNER: 'dark:bg-[#003829]',
  
  // TEXT
  LIGHT_TEXT_PRIMARY: 'text-slate-900',
  DARK_TEXT_PRIMARY: 'dark:text-white',
  LIGHT_TEXT_MUTED: 'text-slate-500',
  DARK_TEXT_MUTED: 'dark:text-emerald-200/80',
  
  // ACCENT TEXT
  LIGHT_ACCENT: 'text-emerald-600',
  DARK_ACCENT: 'dark:text-emerald-300',
  
  // BORDER
  LIGHT_BORDER: 'border-slate-200',
  DARK_BORDER: 'dark:border-emerald-800/30'
};

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Fix hardcoded dark backgrounds that should be adaptive
  if (content.includes('bg-[#004d38]') && !content.includes('bg-emerald-700')) {
     // Usually a primary highlight bar
     content = content.replace(/bg-\[#004d38\]/g, 'bg-emerald-700 dark:bg-[#004d38]');
     changed = true;
  }

  // 2. Unify adaptive backgrounds
  // If we have bg-white dark:bg-[#011e17] or similar, unify to a standard
  content = content.replace(/bg-white dark:bg-\[#011e17\]/g, 'bg-white dark:bg-[#02281e]');
  content = content.replace(/bg-white dark:bg-\[#011611\]/g, 'bg-white dark:bg-[#011611]'); // Top level
  
  // 3. Fix text colors in headers/banners (white text on dark background often stays white)
  // But description text in light mode MUST be dark
  // Look for text-emerald-200/90 which is often used for subtitles
  content = content.replace(/text-emerald-200\/90/g, 'text-slate-500 dark:text-emerald-200/90');
  
  // 4. Fix specific broken emerald classes in Header.tsx
  if (file === 'Header.tsx') {
    content = content.replace(/dark:text-emerald-600 dark:text-emerald-300/g, 'dark:text-emerald-300');
    content = content.replace(/text-emerald-600 dark:text-emerald-600 dark:text-emerald-300/g, 'text-emerald-600 dark:text-emerald-300');
  }

  // 5. Fix card layouts in Dashboard
  if (file === 'Dashboard.tsx') {
    // Buttons in dark emerald boxes
    content = content.replace(/bg-emerald-950/g, 'bg-slate-200/50 dark:bg-emerald-950');
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Unified theme in ${file}`);
  }
});

// Update index.css for better light mode contrast
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace('--bg-primary: #F8FAFC;', '--bg-primary: #FFFFFF;');
css = css.replace('--bg-card: #FFFFFF;', '--bg-card: #F8FAFC;');
fs.writeFileSync('src/index.css', css);

console.log("Global theme unification complete.");
