import fs from 'fs';
let content = fs.readFileSync('src/data/questionsData.ts', 'utf8');

const metadataMap = `
const TEMA_METADATA: Record<string, { imagen: string, color: string }> = {
  'CONSTITUCIÓN POLÍTICA DEL PERÚ': { imagen: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800', color: 'bg-red-900' },
  'D.L. 1267 - LEY DE LA POLICÍA NACIONAL DEL PERÚ': { imagen: 'https://images.unsplash.com/photo-1579389082946-3bb155e88029?auto=format&fit=crop&q=80&w=800', color: 'bg-emerald-900' },
  'DECRETO LEGISLATIVO N° 1291 - LUCHA CONTRA LA CORRUPCIÓN': { imagen: 'https://images.unsplash.com/photo-1605664041951-5a462fca6115?auto=format&fit=crop&q=80&w=800', color: 'bg-blue-900' },
  'LEY N° 27806 - LEY DE TRANSPARENCIA Y DE ACCESO A LA INFORMACIÓN': { imagen: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800', color: 'bg-sky-800' },
  'LEY DE PROCESOS DE ASCENSO DE LA POLICÍA NACIONAL DEL PERÚ': { imagen: 'https://images.unsplash.com/photo-1551836022-4c4c79cb42bf?auto=format&fit=crop&q=80&w=800', color: 'bg-indigo-900' },
  'LEY N° 27444 - LEY DEL PROCEDIMIENTO ADMINISTRATIVO GENERAL': { imagen: 'https://images.unsplash.com/photo-1633519803734-77a83f946468?auto=format&fit=crop&q=80&w=800', color: 'bg-slate-800' },
  'D.L. 957 - CÓDIGO PROCESAL PENAL': { imagen: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800', color: 'bg-violet-900' },
  'DECRETO LEGISLATIVO Nº 635 - CÓDIGO PENAL': { imagen: 'https://images.unsplash.com/photo-1589309736472-822e1da06981?auto=format&fit=crop&q=80&w=800', color: 'bg-zinc-900' },
  'D.L. 1186 - USO DE LA FUERZA PNP': { imagen: 'https://images.unsplash.com/photo-1453873531674-2151bcd01707?auto=format&fit=crop&q=80&w=800', color: 'bg-orange-800' },
  'D.L. 1241 - LUCHA CONTRA EL TRÁFICO ILÍCITO DE DROGAS': { imagen: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&q=80&w=800', color: 'bg-teal-900' },
  'D.L. 1106 - LUCHA EFICAZ CONTRA EL LAVADO DE ACTIVOS Y LA MINERÍA ILEGAL': { imagen: 'https://images.unsplash.com/photo-1607525381861-12c5b36fa89c?auto=format&fit=crop&q=80&w=800', color: 'bg-amber-800' },
  'LEY 30364 - PREVENIR, SANCIONAR Y ERRADICAR LA VIOLENCIA CONTRA LAS MUJERES Y LOS INTEGRANTES DEL GRUPO FAMILIAR': { imagen: 'https://images.unsplash.com/photo-1526402447953-2ceaf1544256?auto=format&fit=crop&q=80&w=800', color: 'bg-rose-900' },
  'LEY 30077 - LEY CONTRA EL CRIMEN ORGANIZADO': { imagen: 'https://images.unsplash.com/photo-1575501309324-df38d9047b19?auto=format&fit=crop&q=80&w=800', color: 'bg-gray-900' },
  'PROTOCOLOS DE ACTUACIÓN INTERINSTITUCIONAL': { imagen: 'https://images.unsplash.com/photo-1578351505664-9ceee5c7eb16?auto=format&fit=crop&q=80&w=800', color: 'bg-cyan-900' },
  'LEY 32130 - LEY PARA FORTALECER LA INVESTIGACIÓN DEL DELITO': { imagen: 'https://images.unsplash.com/photo-1589828185854-1b32d1e2e92e?auto=format&fit=crop&q=80&w=800', color: 'bg-fuchsia-900' },
  'D. LEG. 1611 - PREVENCIÓN E INVESTIGACIÓN DEL DELITO DE EXTORSIÓN': { imagen: 'https://images.unsplash.com/photo-1508345228704-935cc84bf5e2?auto=format&fit=crop&q=80&w=800', color: 'bg-stone-800' },
  'DERECHOS HUMANOS APLICADOS A LA FUNCIÓN POLICIAL': { imagen: 'https://images.unsplash.com/photo-1444927714506-8492d94b4e3d?auto=format&fit=crop&q=80&w=800', color: 'bg-red-800' },
  'DL N° 1428 - ATENCIÓN DE CASOS DE DESAPARICIÓN DE PERSONAS': { imagen: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800', color: 'bg-blue-800' },
  'LEY 30714 - RÉGIMEN DISCIPLINARIO DE LA PNP': { imagen: 'https://images.unsplash.com/photo-1573167576269-02ebcb71e2b5?auto=format&fit=crop&q=80&w=800', color: 'bg-slate-900' },
  'D.L. 1149 - LEY DE LA CARRERA Y SITUACIÓN DEL PERSONAL PNP': { imagen: 'https://images.unsplash.com/photo-1473186578172-c2748e5820de?auto=format&fit=crop&q=80&w=800', color: 'bg-emerald-800' },
  'D.L. 1318 - RÉGIMEN DE FORMACIÓN DE LA PNP': { imagen: 'https://images.unsplash.com/photo-1568283838271-e948fcd4b80b?auto=format&fit=crop&q=80&w=800', color: 'bg-indigo-800' }
};
`;

const searchString = `let idCounter = 1;`;
const insertString = `    const meta = TEMA_METADATA[key] || { imagen: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800', color: 'bg-slate-800' };
    list.push({
      id: idCounter++,
      nombre: key,
      grupo: value.grupo,
      slug,
      totalPreguntas: value.count,
      imagen: meta.imagen,
      color: meta.color,
    });`;

if (!content.includes('TEMA_METADATA')) {
  // Add metadata map before getNormasInfo
  content = content.replace('export function getNormasInfo(): NormaInfo[] {', metadataMap + '\nexport function getNormasInfo(): NormaInfo[] {');
  
  // Replace the list.push part
  const pushBlock = `    list.push({
      id: idCounter++,
      nombre: key,
      grupo: value.grupo,
      slug,
      totalPreguntas: value.count,
    });`;
    
  content = content.replace(pushBlock, insertString);
  fs.writeFileSync('src/data/questionsData.ts', content);
  console.log("Patched metadata successfully");
} else {
  console.log("Already patched");
}
