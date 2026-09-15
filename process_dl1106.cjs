const fs = require('fs');

const f1 = JSON.parse(fs.readFileSync("./src/data/rawDl1106_form1.json", "utf8"));
const f2 = JSON.parse(fs.readFileSync("./src/data/rawDl1106_form2.json", "utf8"));
const allRaw = [...f2, ...f1].sort((a,b) => a.numero - b.numero);

const correctMatches = {
  1181: { match: "ACTOS DE CONVERSIÓN Y TRANSFERENCIA", ubi: "Artículo 1° del D.L. N° 1106 (Actos de conversión y transferencia)" },
  1182: { match: "ACTOS DE OCULTAMIENTO Y TENENCIA", ubi: "Artículo 2° del D.L. N° 1106 (Actos de ocultamiento y tenencia)" },
  1183: { match: "TRANSPORTE, TRASLADO, INGRESO O SALIDA POR TERRITORIO NACIONAL DE DINERO O TÍTULOS VALORES DE ORIGEN ILÍCITO", ubi: "Artículo 3° del D.L. N° 1106 (Transporte o traslado)" },
  1184: { match: "INTEGRANTE DE UNA ORGANIZACIÓN CRIMINAL", ubi: "Artículo 4° numeral 2 del D.L. N° 1106 (Circunstancias agravantes)" },
  1185: { match: "LA MINERÍA ILEGAL", ubi: "Artículo 4° último párrafo del D.L. N° 1106 (Circunstancias agravantes específicas)" },
  1186: { match: "TRÁFICO ILÍCITO DE DROGAS", ubi: "Artículo 4° último párrafo del D.L. N° 1106 (Circunstancias agravantes específicas)" },
  1187: { match: "DELITOS CONTRA LA ADMINISTRACIÓN PÚBLICA", ubi: "Artículo 4° último párrafo del D.L. N° 1106 (Circunstancias agravantes específicas)" },
  1188: { match: "INCUMPLIENDO SUS OBLIGACIONES FUNCIONALES O PROFESIONALES, OMITE COMUNICAR A LA AUTORIDAD COMPETENTE, LAS TRANSACCIONES U OPERACIONES SOSPECHOSAS QUE HUBIERE DETECTADO, SEGÚN LAS LEYES Y NORMAS REGLAMENTARIAS", ubi: "Artículo 5° del D.L. N° 1106 (Omisión de comunicación)" },
  1189: { match: "MERCANTIL, QUE LE SEA REQUERIDA, EN EL MARCO DE UNA INVESTIGACIÓN O JUZGAMIENTO POR EL DELITO DE LAVADO DE ACTIVOS", ubi: "Artículo 6° del D.L. N° 1106 (Rehusamiento, retardo y falsedad)" },
  1190: { match: "REGLAS DE INVESTIGACIÓN", ubi: "Artículo 7° del D.L. N° 1106 (Reglas de investigación)" },
  1191: { match: "EL FISCAL", ubi: "Artículo 7° primer párrafo del D.L. N° 1106" },
  1192: { match: "JUEZ", ubi: "Artículo 7° primer párrafo del D.L. N° 1106" },
  1193: { match: "RELACIÓN CON LA INVESTIGACIÓN DE LOS HECHOS QUE LA MOTIVARON", ubi: "Artículo 7° segundo párrafo del D.L. N° 1106" },
  1194: { match: "INSCRIBIR A LOS SUJETOS OBLIGADOS Y A LOS OFICIALES DE CUMPLIMIENTO QUE ÉSTOS DESIGNEN, SIEMPRE QUE SATISFAGAN LOS REQUISITOS ESTABLECIDOS EN LA PRESENTE LEY", ubi: "Artículo 8° del D.L. N° 1106 / Ley 27693 modif." },
  1195: { match: "NO ES NECESARIO QUE LAS ACTIVIDADES CRIMINALES QUE PRODUJERON EL DINERO, LOS BIENES, EFECTOS O GANANCIAS HAYAN SIDO DESCUBIERTAS", ubi: "Artículo 10° del D.L. N° 1106 (Autonomía del delito)" },
  1196: { match: "EL FISCAL", ubi: "Artículo 7°-A del D.L. N° 1106 (Intervención excepcional de FF.AA.)" },
  1197: { match: "PRESTARÁ LA ASISTENCIA TÉCNICA QUE LE SEA REQUERIDA", ubi: "Artículo 7° tercer párrafo del D.L. N° 1106" },
  1198: { match: "EL CONSEJO DE DEFENSA JURÍDICA DEL ESTADO", ubi: "Artículo 9° del D.L. N° 1106 (Coordinaciones de la UIF-Perú)" },
  1199: { match: "A AQUELLOS SUJETOS OBLIGADOS QUE CARECEN DE ORGANISMO SUPERVISOR", ubi: "Artículo 8° del D.L. N° 1106 (Supervisión directa UIF)" },
  1200: { match: "SENTENCIA", ubi: "Artículo 10° del D.L. N° 1106 (Autonomía del delito)" },
  1201: { match: "RECEPTACIÓN", ubi: "Artículo 10° del D.L. N° 1106 (Catálogo de delitos previos)" },
  1202: { match: "DELITOS ADUANEROS", ubi: "Artículo 10° del D.L. N° 1106 (Catálogo de delitos previos)" },
  1203: { match: "REDENCIÓN DE LA PENA POR EL TRABAJO Y LA EDUCACIÓN", ubi: "Artículo 11° del D.L. N° 1106 (Prohibición de beneficios penitenciarios)" },
  1204: { match: "LA MINERÍA ILEGAL", ubi: "Artículo 7°-A del D.L. N° 1106 (Intervención de FF.AA.)" },
  1205: { match: "LAVADO DE ACTIVOS", ubi: "Artículo 7°-A del D.L. N° 1106 (Intervención de FF.AA.)" },
  1206: { match: "OTRAS FORMAS DE CRIMEN ORGANIZADO", ubi: "Artículo 7°-A del D.L. N° 1106 (Intervención de FF.AA.)" },
  1207: { match: "LA CONSTITUCIÓN POLÍTICA DEL PERÚ", ubi: "Artículo 7°-A último párrafo del D.L. N° 1106" },
  1208: { match: "LAS INSTITUCIONES SOMETIDAS AL CONTROL Y SUPERVISIÓN DE LA SUPERINTENDENCIA BANCA, SEGUROS Y ADMINISTRADORAS PRIVADAS DE FONDOS DE PENSIONES", ubi: "Artículo 8°-A del D.L. N° 1106 (Medidas de control)" },
  1209: { match: "LAS DISPOSICIONES SOBRE LA MATERIA PREVISTAS EN LA LEGISLACIÓN VIGENTE", ubi: "Artículo 8° del D.L. N° 1106" },
  1210: { match: "ADMINISTRACIÓN DEL DINERO, BIENES, EFECTOS O GANANCIAS ILEGALES QUE HAYAN SIDO INCAUTADOS POR LOS DELITOS PREVISTOS EN EL PRESENTE DECRETO LEGISLATIVO", ubi: "Artículo 8° del D.L. N° 1106" },
  1211: { match: "LA MINERÍA ILEGAL Y OTRAS FORMAS DE CRIMEN ORGANIZADO", ubi: "Artículo 9° del D.L. N° 1106 (Capacitación)" },
  1212: { match: "EL MINISTERIO PÚBLICO", ubi: "Artículo 9° del D.L. N° 1106 (Capacitación)" },
  1213: { match: "LAS ENTIDADES DEL ESTADO, EN LOS ÁMBITOS NACIONAL, REGIONAL Y LOCAL, Y LAS EMPRESAS EN LAS QUE EL ESTADO TIENE PARTICIPACIÓN", ubi: "Artículo 9° segundo párrafo del D.L. N° 1106" },
  1214: { match: "A LA UNIDAD DE INTELIGENCIA FINANCIERA DEL PERÚ (UIF - PERÚ)", ubi: "Artículo 9° segundo párrafo del D.L. N° 1106" },
  1215: { match: "CON EL CONSEJO DE DEFENSA JURÍDICA DEL ESTADO", ubi: "Artículo 9° tercer párrafo del D.L. N° 1106" },
  1216: { match: "LOGRAR UNA MAYOR EFICACIA EN LA LUCHA CONTRA EL DELITO DE LAVADO DE ACTIVOS, VINCULADO ESPECIALMENTE A LA MINERÍA ILEGAL U OTRAS FORMAS DE CRIMEN ORGANIZADO", ubi: "Artículo 9° tercer párrafo del D.L. N° 1106" },
  1217: { match: "INSTITUCIONALES DE LAS ENTIDADES COMPETENTES", ubi: "Primera Disposición Complementaria Final del D.L. N° 1106" },
  1218: { match: "SOLICITAR INFORMES, DOCUMENTOS, ANTECEDENTES Y TODO OTRO ELEMENTO QUE ESTIME ÚTIL PARA EL CUMPLIMIENTO DE SUS FUNCIONES", ubi: "Artículo 8° del D.L. N° 1106 / Ley 27693 modif." },
  1219: { match: "LA UIF - PERÚ", ubi: "Artículo 8° del D.L. N° 1106 / Ley 27693 modif." },
  1220: { match: "DE LAS FUNCIONES Y FACULTADES DE LA UIF - PERÚ", ubi: "Artículo 8° del D.L. N° 1106 / Ley 27693 modif." },
  1221: { match: "DE LAS FUNCIONES Y FACULTADES DE LA UIF - PERÚ", ubi: "Artículo 8° del D.L. N° 1106 / Ley 27693 modif." },
  1222: { match: "SERVICIOS DE AMORTIZACIÓN DE PRÉSTAMOS", ubi: "Artículo 9°-A de la Ley 27693 incorporado por D.L. 1106" },
  1223: { match: "CONSTITUCIÓN DE FIDEICOMISOS Y TODO TIPO DE OTROS ENCARGOS FIDUCIARIOS Y DE COMISIONES DE CONFIANZA", ubi: "Artículo 9°-A de la Ley 27693 incorporado por D.L. 1106" },
  1224: { match: "COMPRA VENTA DE BIENES Y SERVICIOS", ubi: "Artículo 9°-A de la Ley 27693 incorporado por D.L. 1106" },
  1225: { match: "OPERACIONES A FUTURO PACTADAS CON LOS CLIENTES", ubi: "Artículo 9°-A de la Ley 27693 incorporado por D.L. 1106" },
  1226: { match: "DIEZ (10) AÑOS A PARTIR DE LA FECHA DE LA MISMA, UTILIZANDO PARA TAL FIN MEDIOS INFORMÁTICOS, MICROFILMACIÓN O MEDIOS SIMILARES", ubi: "Artículo 9°-A numeral 9-A.2 de la Ley 27693 modif." },
  1227: { match: "CLIENTES HABITUALES", ubi: "Artículo 9°-A numeral 9-A.3 de la Ley 27693 modif." },
  1228: { match: "UNA SOLA OPERACIÓN SI SON REALIZADAS POR O EN BENEFICIO DE DETERMINADA PERSONA", ubi: "Artículo 9°-A numeral 9-A.4 de la Ley 27693 modif." },
  1229: { match: "OBLIGACIONES DEL NOTARIO", ubi: "Segunda Disposición Complementaria Modificatoria del D.L. N° 1106 (D.L. 1049 Art. 19-A)" },
  1230: { match: "LA IDENTIDAD DE LOS INTERVINIENTES MEDIANTE LA VERIFICACIÓN DE LAS IMÁGENES, DATOS Y/O LA IDENTIFICACIÓN POR COMPARACIÓN BIOMÉTRICA", ubi: "Segunda Disposición Complementaria Modificatoria del D.L. N° 1106 (D.L. 1049 Art. 19-A inc. c)" },
};

const processed = allRaw.map(q => {
  const hint = correctMatches[q.numero];
  if (!hint) {
    console.error("Missing hint for Q" + q.numero);
    return null;
  }
  const optIdx = q.opciones.findIndex(op => {
    const cleanOp = op.trim().toUpperCase().replace(/\.$/, "").replace(/\s+/g, " ");
    const cleanHint = hint.match.trim().toUpperCase().replace(/\.$/, "").replace(/\s+/g, " ");
    return cleanOp === cleanHint || cleanOp.includes(cleanHint) || cleanHint.includes(cleanOp);
  });

  if (optIdx === -1) {
    console.error(`Could not match option for Q${q.numero}! Hint: "${hint.match}"`);
    return null;
  }

  return {
    codigo: `LA-P${q.numero}`,
    numero: q.numero,
    materia_grupo: "COMUNES",
    norma: "D.L. 1106 - LUCHA EFICAZ CONTRA EL LAVADO DE ACTIVOS Y LA MINERÍA ILEGAL",
    enunciado: q.enunciado.trim(),
    opciones: q.opciones.map(o => o.trim()),
    respuesta: q.opciones[optIdx].trim(),
    ubicacion: hint.ubi
  };
});

const valid = processed.filter(Boolean);
console.log(`Successfully mapped ${valid.length} of ${allRaw.length} questions!`);
fs.writeFileSync("./src/data/dl1106Questions.json", JSON.stringify(valid, null, 2));

