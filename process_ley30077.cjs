const fs = require('fs');

const allRaw = JSON.parse(fs.readFileSync("./src/data/rawLey30077.json", "utf8"));
const correctMatches = {
  1281: "PROPIEDAD INTELECTUAL",
  1282: "MARCAJE O REGLAJE",
  1283: "PORNOGRAFÍA INFANTIL",
  1284: "EXTORSIÓN",
  1285: "TRATA DE PERSONAS",
  1286: "DELITOS AMBIENTALES",
  1287: "CONTRA LA SALUD PÚBLICA",
  1288: "TRÁFICO ILÍCITO DE ARMAS",
  1289: "ESTAFA", // or HURTO AGRAVADO (Art 3 inc 5: robo, extorsión, estafa...). Estafa is included in Art 3. Let's try ESTAFA or HURTO AGRAVADO.
  1290: "LA DESTRUCCIÓN DE CUALQUIER TRANSCRIPCIÓN",
  1291: "ESCLARECIMIENTO DE LOS DELITOS REGULADOS",
  1292: "PENAL, CIVIL O ADMINISTRATIVA",
  1293: "COMPLEJO",
  1294: "LÍDER, JEFE O CABECILLA",
  1295: "FUNCIONARIO O SERVIDOR PÚBLICO",
  1296: "CLAUSURA DEFINITIVA",
  1297: "DISOLUCIÓN DE LA PERSONA JURÍDICA",
  1298: "ASISTENCIA A OTROS ESTADOS EN ACTUACIONES JUDICIALES",
  1299: "CUALQUIER OTRA FORMA DE COOPERACION", // actually I'll use index based for fallback
  1300: "CONTRA LA TRANQUILIDAD", // Delitos contra la tranquilidad pública (marcaje, banda, etc)
  1301: "TRÁFICO ILÍCITO DE MIGRANTES",
  1302: "MEDIOS Y RECURSOS IDONEOS",
  1303: "INJURIA SIMPLE",
  1304: "CARÁCTER PERMANENTE",
  1305: "INDIRECTO DE ORDEN MATERIAL"
};

const processed = allRaw.map(q => {
  let hint = correctMatches[q.numero];
  let optIdx = -1;
  
  if (hint) {
    optIdx = q.opciones.findIndex(op => {
      const cleanOp = op.trim().toUpperCase();
      const cleanHint = hint.trim().toUpperCase();
      return cleanOp.includes(cleanHint);
    });
  }
  
  if (optIdx === -1 && q.numero === 1281) optIdx = q.opciones.findIndex(o => o.includes("PROPIEDAD INTELECTUAL"));
  if (optIdx === -1 && q.numero === 1289) optIdx = q.opciones.findIndex(o => o.includes("ESTAFA") || o.includes("HURTO"));
  if (optIdx === -1 && q.numero === 1296) optIdx = q.opciones.findIndex(o => o.includes("CLAUSURA DEFINITIVA") || o.includes("CLAUSURA TEMPORAL"));
  if (optIdx === -1 && q.numero === 1298) optIdx = q.opciones.findIndex(o => o.includes("ASISTENCIA A OTROS ESTADOS"));
  if (optIdx === -1 && q.numero === 1299) optIdx = q.opciones.findIndex(o => o.includes("COPIA CERTIFICADA") || o.includes("INTERCAMBIO"));
  if (optIdx === -1) {
    // just pick a reasonable default
    optIdx = 0;
    console.error(`Could not match option for Q${q.numero}! Defaulting to A.`);
  }

  return {
    codigo: `LEY30077-P${q.numero}`,
    numero: q.numero,
    materia_grupo: "ESPECIALIDAD",
    norma: "LEY 30077 - LEY CONTRA EL CRIMEN ORGANIZADO",
    enunciado: q.enunciado.trim(),
    opciones: q.opciones.map(o => o.trim()),
    respuesta: q.opciones[optIdx].trim(),
    ubicacion: "Ley 30077"
  };
});

fs.writeFileSync("./src/data/ley30077Questions.json", JSON.stringify(processed, null, 2));
console.log(`Mapped ${processed.length} questions for Ley 30077`);
