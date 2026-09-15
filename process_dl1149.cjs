const fs = require('fs');
const raw = JSON.parse(fs.readFileSync("./src/data/rawDl1149.json", "utf8"));

const correctMatches = {
  // We can add manual mappings here if we find exceptions later.
};

const processed = raw.map((q, i) => {
  let optIdx = -1;
  let hint = correctMatches[q.numero];

  if (hint) {
    optIdx = q.opciones.findIndex(o => o.includes(hint) || hint.includes(o));
  }

  // Heuristic: longest option for these specific exams if no explicit hint
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
    codigo: `DL1149-P${q.numero}`,
    numero: q.numero,
    materia_grupo: "ESPECIALIDAD",
    norma: "D.L. 1149 - LEY DE LA CARRERA Y SITUACIÓN DEL PERSONAL PNP",
    enunciado: q.enunciado.trim(),
    opciones: q.opciones.map(o => o.trim()),
    respuesta: q.opciones[optIdx].trim(),
    ubicacion: "D.L. 1149"
  };
});

fs.writeFileSync("./src/data/dl1149Questions.json", JSON.stringify(processed, null, 2));
console.log(`Mapped ${processed.length} questions for DL 1149`);
