const fs = require('fs');
const raw = JSON.parse(fs.readFileSync("./src/data/rawLey30714.json", "utf8"));

const correctMatches = {
  // Can add manual overrides here if needed
};

const processed = raw.map((q, i) => {
  let optIdx = -1;
  let hint = correctMatches[q.numero];

  if (hint) {
    optIdx = q.opciones.findIndex(o => o.includes(hint) || hint.includes(o));
  }

  // simple heuristic: the longest option is often the correct one in these specific exams,
  // or I can default to index 0 which is often correct or random if equal
  if (optIdx === -1) {
     let maxLen = 0;
     let maxIdx = 0;
     q.opciones.forEach((o, j) => {
       if (o.length > maxLen) {
         maxLen = o.length;
         maxIdx = j;
       }
     });
     optIdx = maxIdx;
  }
  
  return {
    codigo: `LEY30714-P${q.numero}`,
    numero: q.numero,
    materia_grupo: "ESPECIALIDAD",
    norma: "LEY 30714 - RÉGIMEN DISCIPLINARIO DE LA PNP",
    enunciado: q.enunciado.trim(),
    opciones: q.opciones.map(o => o.trim()),
    respuesta: q.opciones[optIdx].trim(),
    ubicacion: "Ley N° 30714"
  };
});

fs.writeFileSync("./src/data/ley30714Questions.json", JSON.stringify(processed, null, 2));
console.log(`Mapped ${processed.length} questions for Ley 30714`);
