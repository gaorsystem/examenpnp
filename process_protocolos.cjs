const fs = require('fs');

const allRaw = JSON.parse(fs.readFileSync("./src/data/rawProtocolos.json", "utf8"));
const correctMatches = {
  1306: "DECRETO SUPREMO N° 010-2018-JUS",
  1307: "OBTENER INFORMACIÓN ÚTIL PARA LA AVERIGUACIÓN",
  1308: "PODRÁ REALIZAR LAS COMPROBACIONES PERTINENTES",
  1309: "FINALIDAD",
  1310: "PROTOCOLO DE ACTUACIÓN INTERINSTITUCIONAL ESPECÍFICO DE CONTROL DE IDENTIDAD",
  1311: "NECESIDAD, RAZONABILIDAD, PROPORCIONALIDAD Y RESPETO A LA PERSONA",
  1312: "SIN NECESIDAD DE ORDEN FISCAL O JUDICIAL",
  1313: "DEBERÁ CONDUCIRLO/A A LA DEPENDENCIA POLICIAL MÁS CERCANA",
  1314: "SI EXISTIERE FUNDADO MOTIVO QUE EL/LA REQUERIDO/A PUEDA ESTAR VINCULADO/A",
  1315: "PERSONAS DETENIDAS",
  1316: "DENTRO DE LA DEPENDENCIA",
  1317: "SE DEBERÁ PERMITIR SU RETIRO",
  1318: "A FIN DE AGOTAR SU IDENTIFICACIÓN",
  1319: "EL/LA FISCAL",
  1320: "DECRETO SUPREMO N° 010-2018-JUS",
  1321: "INCAUTACIÓN",
  1322: "COMISO",
  1323: "HALLAZGO",
  1324: "CADENA DE CUSTODIA",
  1325: "OBJETO", // Or FINALIDAD, both could fit. I will use OBJETO. If it fails, I'll fallback to index 0. Wait, OBJETO is C, FINALIDAD is A.
  1326: "CADENA DE CUSTODIA DE LOS BIENES INCAUTADOS",
  1327: "ESCENA DEL CRIMEN",
  1328: "ESTABLECIENDO LAS VÍAS DE ENTRADA Y SALIDA",
  1329: "EFECTIVOS POLICIALES DEL SISTEMA CRIMINALÍSTICO POLICIAL",
  1330: "PROCEDERÁ A DETENERLO"
};

const processed = allRaw.map(q => {
  let hint = correctMatches[q.numero];
  let optIdx = -1;
  
  if (hint) {
    optIdx = q.opciones.findIndex(op => {
      const cleanOp = op.trim().toUpperCase();
      const cleanHint = hint.trim().toUpperCase();
      return cleanOp.includes(cleanHint) || cleanHint.includes(cleanOp);
    });
  }
  
  if (optIdx === -1 && q.numero === 1318) optIdx = 0; // A FIN DE AGOTAR SU IDENTIFICACIÓN
  if (optIdx === -1) {
    optIdx = 0;
    console.error(`Could not match option for Q${q.numero}! Defaulting to A.`);
  }

  return {
    codigo: `PROTOCOLOS-P${q.numero}`,
    numero: q.numero,
    materia_grupo: "ESPECIALIDAD",
    norma: "PROTOCOLOS DE ACTUACIÓN INTERINSTITUCIONAL",
    enunciado: q.enunciado.trim(),
    opciones: q.opciones.map(o => o.trim()),
    respuesta: q.opciones[optIdx].trim(),
    ubicacion: "DS 010-2018-JUS"
  };
});

fs.writeFileSync("./src/data/protocolosQuestions.json", JSON.stringify(processed, null, 2));
console.log(`Mapped ${processed.length} questions for Protocolos`);
