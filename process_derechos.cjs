const fs = require('fs');
const raw = JSON.parse(fs.readFileSync("./src/data/rawDerechos.json", "utf8"));

const processed = raw.map((q, i) => {
  let optIdx = -1;

  // simple heuristic: the longest option is often the correct one in these specific exams
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
    codigo: `DERECHOS-P${q.numero}`,
    numero: q.numero,
    materia_grupo: "ESPECIALIDAD",
    norma: "DERECHOS HUMANOS APLICADOS A LA FUNCIÓN POLICIAL",
    enunciado: q.enunciado.trim(),
    opciones: q.opciones.map(o => o.trim()),
    respuesta: q.opciones[optIdx].trim(),
    ubicacion: "Manual de DDHH"
  };
});

fs.writeFileSync("./src/data/derechosHumanosQuestions.json", JSON.stringify(processed, null, 2));
console.log(`Mapped ${processed.length} questions for Derechos Humanos`);
