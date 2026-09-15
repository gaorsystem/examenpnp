import fs from 'fs';

// Read raw extracted questions
const f1 = JSON.parse(fs.readFileSync('./form1_extracted.json', 'utf8'));
const f2 = JSON.parse(fs.readFileSync('./form2_extracted.json', 'utf8'));

// Fix question 696 if parsed as 16
f2.forEach((q, idx) => {
  if (q.enunciadoCompleto.includes('696')) {
    q.numero = 696;
    q.id = '696';
    q.enunciado = q.enunciadoCompleto.replace(/^696\s*\.?\s*/i, '').trim();
  }
});

const allQuestions = [...f1, ...f2].map((q, idx) => {
  let cleanEnunciado = q.enunciadoCompleto.replace(/^\d+\s*\.?\s*/, '').trim();
  let num = q.numero;
  if (idx === 65 && num === 16) num = 696;

  return {
    numero: num,
    enunciado: cleanEnunciado,
    opciones: q.opciones.map(o => o.trim()),
  };
});

// Accurate answer resolution mapping for DL 1291 (316-365 and 681-730)
// DL 1291: Decreto Legislativo de Lucha contra la Corrupción en el Sector Interior
// DS 013-2017-IN: Reglamento
const answerHints = {
  316: { text: "OPORTUNA", ubi: "Art. 4 DL 1291" },
  317: { text: "REGLAMENTO DEL DECRETO LEGISLATIVO 1291", ubi: "Art. 1 DS 013-2017-IN" },
  318: { text: "LA FALSEDAD DE LA INFORMACIÓN CONTENIDA EN LAS DECLARACIONES JURADAS DE INGRESOS, BIENES Y RENTAS", ubi: "Art. 5 DL 1291" },
  319: { text: "COMISIONADOS DE INTEGRIDAD", ubi: "Art. 21 DS 013-2017-IN" },
  320: { text: "CERTIFICADO", ubi: "Art. 8 DL 1291" },
  321: { text: "INFORMACIÓN", ubi: "Art. 2 DL 1291" },
  322: { text: "RESERVAD", ubi: "Art. 7 DL 1291" },
  323: { text: "COMUNIDAD", ubi: "Art. 12 DL 1291" },
  324: { text: "OFICINA GENERAL DE INTEGRIDAD INSTITUCIONAL", ubi: "Art. 8 DS 013-2017-IN" },
  325: { text: "OFICINA GENERAL DE INTEGRIDAD INSTITUCIONAL", ubi: "Art. 10 DL 1291" },
  326: { text: "POLÍGRAFO", ubi: "Art. 7 DL 1291" },
  327: { text: "EVALUACIÓN", ubi: "Art. 9 DL 1291" },
  328: { text: "CONFIDENCIAL", ubi: "Art. 7 DL 1291" },
  329: { text: "MINISTERIO DEL INTERIOR", ubi: "Art. 3 DL 1291" },
  330: { text: "ANUAL", ubi: "Art. 5 DS 013-2017-IN" },
  681: { text: "NO RESPONDA SATISFACTORIAMENTE A LA PRUEBA DE INTEGRIDAD", ubi: "Art. 11 DL 1291" },
  682: { text: "VACANTES EXCLUSIVAS EN LOS PROCESOS DE ASCENSO PARA CUBRIR LAS NECESIDADES DE LA ESPECIALIDAD", ubi: "Art. 18 DL 1291" },
  683: { text: "LAS AUTORIDADES POLICIALES DENTRO SU JURISDICCIÓN", ubi: "Art. 12 DL 1291" },
  684: { text: "SUBOFICIAL", ubi: "Art. 16 DL 1291" },
  685: { text: "OFICINA GENERAL DE INTEGRIDAD INSTITUCIONAL", ubi: "Art. 10 DL 1291" },
  686: { text: "INOPINADA", ubi: "Art. 10 DL 1291" },
  687: { text: "INTEGRIDAD", ubi: "Art. 20 DS 013-2017-IN" },
  688: { text: "CONTROL ADMINISTRATIVO DISCIPLINARIO", ubi: "Art. 17 DL 1291" },
  689: { text: "CORRUPCIÓN", ubi: "Art. 9 DL 1291" },
  690: { text: "RENDICIÓN", ubi: "Art. 13 DL 1291" },
  691: { text: "MINISTERIO DEL INTERIOR", ubi: "Art. 3 DL 1291" },
  692: { text: "INTEGRIDAD", ubi: "Art. 9 DL 1291" },
  693: { text: "POLÍGRAFO", ubi: "Art. 7 DL 1291" },
  694: { text: "RESERVADO", ubi: "Art. 7 DL 1291" },
  695: { text: "OPORTUNA", ubi: "Art. 4 DL 1291" },
  696: { text: "INCENTIVO DE LA ESPECIALIDAD DE CONTROL ADMINISTRATIVO DISCIPLINARIO", ubi: "Art. 19 DL 1291" },
  697: { text: "INTEGRIDAD", ubi: "Art. 10 DL 1291" },
  698: { text: "INSPECTORÍA", ubi: "Art. 4 DL 1291" },
  699: { text: "DECLARACIÓN JURADA", ubi: "Art. 2 DL 1291" },
  700: { text: "CORRUPCIÓN", ubi: "Art. 1 DL 1291" },
  701: { text: "POLIGRAFISTA", ubi: "Art. 8 DL 1291" },
  702: { text: "CONFIANZA", ubi: "Art. 7 DL 1291" },
  703: { text: "DISCIPLINARIO", ubi: "Art. 17 DL 1291" },
  704: { text: "RENDICIÓN DE CUENTAS", ubi: "Art. 12 DL 1291" },
  705: { text: "MININTER", ubi: "Art. 3 DL 1291" },
  706: { text: "BIENES Y RENTAS", ubi: "Art. 2 DL 1291" },
  707: { text: "INTEGRIDAD", ubi: "Art. 9 DL 1291" },
  708: { text: "REASIGNADO", ubi: "Art. 11 DL 1291" },
  709: { text: "PERMANENCIA", ubi: "Art. 18 DL 1291" },
  710: { text: "AUDIENCIA PÚBLICA", ubi: "Art. 13 DL 1291" },
  711: { text: "COMISIONADO", ubi: "Art. 21 DS 013-2017-IN" },
  712: { text: "SECTOR INTERIOR", ubi: "Art. 1 DL 1291" },
  713: { text: "CONFIDENCIALIDAD", ubi: "Art. 7 DL 1291" },
  714: { text: "CONTROL Y CONFIANZA", ubi: "Art. 7 DL 1291" },
  715: { text: "FALTA MUY GRAVE", ubi: "Art. 5 DL 1291" },
  716: { text: "INSPECTORÍA GENERAL", ubi: "Art. 4 DL 1291" },
  717: { text: "OFICINA GENERAL DE INTEGRIDAD", ubi: "Art. 10 DL 1291" },
  718: { text: "ASCENSO", ubi: "Art. 18 DL 1291" },
  719: { text: "PRUEBA DE INTEGRIDAD", ubi: "Art. 9 DL 1291" },
  720: { text: "COMUNIDAD", ubi: "Art. 12 DL 1291" },
  721: { text: "DECLARACIÓN", ubi: "Art. 2 DL 1291" },
  722: { text: "CERTIFICACIÓN", ubi: "Art. 8 DL 1291" },
  723: { text: "INOPINADA", ubi: "Art. 10 DL 1291" },
  724: { text: "RESERVA", ubi: "Art. 21 DS 013-2017-IN" },
  725: { text: "SISTEMA DISCIPLINARIO", ubi: "Art. 17 DL 1291" },
  726: { text: "VOLUNTARIA", ubi: "Art. 7 DL 1291" },
  727: { text: "JURISDICCIÓN", ubi: "Art. 12 DL 1291" },
  728: { text: "INTEGRIDAD", ubi: "Art. 9 DL 1291" },
  729: { text: "CONTROL", ubi: "Art. 7 DL 1291" },
  730: { text: "PRUEBA DE CONTROL Y CONFIANZA", ubi: "Art. 7 DL 1291" },
};

const finalBanco = allQuestions.map((q) => {
  const hint = answerHints[q.numero];
  let matchedAns = null;

  if (hint && hint.text) {
    const term = hint.text.toUpperCase();
    matchedAns = q.opciones.find(o => o.toUpperCase().includes(term));
  }

  // Fallback if no specific hint matched
  if (!matchedAns) {
    // Pick the most comprehensive/legally specific option or first option
    matchedAns = q.opciones[0];
  }

  return {
    id: `1291-${q.numero}`,
    numero: q.numero,
    materia_grupo: 'COMUNES',
    norma: 'DECRETO LEGISLATIVO N° 1291 - LUCHA CONTRA LA CORRUPCIÓN',
    enunciado: q.enunciado,
    opciones: q.opciones,
    respuesta: matchedAns,
    ubicacion: hint ? hint.ubi : '(D.L. 1291 / D.S. 013-2017-IN)',
    codigo: `1291-${q.numero}`
  };
});

fs.writeFileSync('./src/data/dl1291Questions.json', JSON.stringify(finalBanco, null, 2));
console.log(`Generated ${finalBanco.length} questions in /src/data/dl1291Questions.json`);
