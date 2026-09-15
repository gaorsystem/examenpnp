const fs = require('fs');

const allRaw = JSON.parse(fs.readFileSync("./src/data/rawLey30364.json", "utf8"));
const correctMatches = {
  1231: "VIOLENCIA FÍSICA",
  1232: "VIOLENCIA PSICOLÓGICA",
  1233: "DOBLE VICTIMIZACIÓN",
  1234: "LA DEFENSORÍA DEL PUEBLO",
  1235: "DERECHOS LABORALES",
  1236: "EL ÁMBITO",
  1237: "PRINCIPIO DE INTERÉS SUPERIOR DEL NIÑO",
  1238: "PRINCIPIO DE SENCILLEZ Y ORALIDAD",
  1239: "ENFOQUE DE GÉNERO",
  1240: "QUINCE (15) DÍAS",
  1241: "TRES (3) DÍAS",
  1242: "RESISTENCIA O DESOBEDIENCIA A LA AUTORIDAD PREVISTO EN EL CÓDIGO PENAL",
  1243: "PÚBLICO O PRIVADO",
  1244: "DISCAPACIDAD",
  1245: "PRINCIPIO DE IGUALDAD Y NO DISCRIMINACIÓN",
  1246: "DEL NIÑO",
  1247: "PRINCIPIO DE LA DEBIDA DILIGENCIA",
  1248: "PRINCIPIO DE INTERVENCIÓN INMEDIATA Y OPORTUNA",
  1249: "ENFOQUE DE INTEGRALIDAD",
  1250: "ENFOQUE DE INTERCULTURALIDAD",
  1251: "ENFOQUE GENERACIONAL",
  1252: "INTEGRANTES DEL GRUPO FAMILIAR",
  1253: "CONDUCTA QUE LES CAUSA MUERTE, DAÑO O SUFRIMIENTO FÍSICO, SEXUAL O PSICOLÓGICO POR SU CONDICIÓN DE TALES, TANTO EN EL ÁMBITO PÚBLICO COMO EN EL PRIVADO",
  1254: "MUERTE",
  1255: "PSICOLÓGICO",
  1256: "LA QUE TENGA LUGAR DENTRO DE LA FAMILIA O UNIDAD DOMÉSTICA O EN CUALQUIER OTRA RELACION INTERPERSONAL",
  1257: "LA QUE TENGA LUGAR DENTRO DE LA FAMILIA O UNIDAD DOMÉSTICA O EN CUALQUIER OTRA RELACIÓN INTERPERSONAL, YA SEA QUE EL AGRESOR COMPARTA O HAYA COMPARTIDO EL MISMO DOMICILIO QUE LA MUJER",
  1258: "CUALQUIER PERSONA",
  1259: "LA TORTURA",
  1260: "DONDE QUIERA QUE OCURRA",
  1261: "CONFIANZA",
  1262: "CON LOS ADULTOS MAYORES",
  1263: "CÓNYUGES",
  1264: "MADRASTRAS",
  1265: "LOS PARIENTES COLATERALES DE LOS CÓNYUGES Y CONVIVIENTES HASTA EL CUARTO GRADO DE CONSANGUINIDAD Y SEGUNDO DE AFINIDAD",
  1266: "FÍSICA, PSICOLÓGICA, SEXUAL Y ECONÓMICA O PATRIMONIAL",
  1267: "INTIMIDACIÓN",
  1268: "INGRESOS",
  1269: "IMPEDIMENTO DE ACERCAMIENTO O PROXIMIDAD A LA VÍCTIMA EN CUALQUIER FORMA",
  1270: "LA POLICÍA NACIONAL DEL PERÚ",
  1271: "CÓDIGO PENAL",
  1272: "PRIVATIVA DE LIBERTAD EFECTIVA",
  1273: "ABSOLUTORIA O CONDENATORIA",
  1274: "CÓDIGO PROCESAL PENAL",
  1275: "PRINCIPIO DE RAZONABILIDAD Y PROPORCIONALIDAD",
  1276: "PRINCIPIO DE INTERVENCIÓN INMEDIATA Y OPORTUNA",
  1277: "VIOLENCIA SEXUAL",
  1278: "PORNOGRÁFICO",
  1279: "LA POLICÍA NACIONAL DEL PERÚ",
  1280: "SÍ, DE MANERA GRATUITA EN EL MARCO DE LA ATENCIÓN INTEGRAL"
};

const processed = allRaw.map(q => {
  const hint = correctMatches[q.numero];
  if (!hint) {
    console.error("Missing hint for Q" + q.numero);
    return null;
  }
  const optIdx = q.opciones.findIndex(op => {
    const cleanOp = op.trim().toUpperCase().replace(/\.$/, "").replace(/\s+/g, " ");
    const cleanHint = hint.trim().toUpperCase().replace(/\.$/, "").replace(/\s+/g, " ");
    return cleanOp === cleanHint || cleanOp.includes(cleanHint) || cleanHint.includes(cleanOp);
  });

  if (optIdx === -1) {
    console.error(`Could not match option for Q${q.numero}! Hint: "${hint}"`);
    return null;
  }

  return {
    codigo: `LEY30364-P${q.numero}`,
    numero: q.numero,
    materia_grupo: "COMUNES",
    norma: "LEY 30364 - PREVENIR, SANCIONAR Y ERRADICAR LA VIOLENCIA CONTRA LAS MUJERES Y LOS INTEGRANTES DEL GRUPO FAMILIAR",
    enunciado: q.enunciado.trim(),
    opciones: q.opciones.map(o => o.trim()),
    respuesta: q.opciones[optIdx].trim(),
    ubicacion: "Ley 30364"
  };
});

const valid = processed.filter(Boolean);
console.log(`Successfully mapped ${valid.length} of ${allRaw.length} questions for Ley 30364!`);
fs.writeFileSync("./src/data/ley30364Questions.json", JSON.stringify(valid, null, 2));
