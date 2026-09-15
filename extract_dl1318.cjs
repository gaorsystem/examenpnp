const fs = require('fs');

async function extractQuestions(url) {
  const res = await fetch(url);
  const html = await res.text();
  const match = html.match(/FB_PUBLIC_LOAD_DATA_\s*=\s*(\[.+?\]);\s*<\/script>/s);
  if (!match) {
    console.error("No match for URL", url);
    return [];
  }
  const data = JSON.parse(match[1]);
  const fields = data[1][1] || [];
  
  const questions = [];
  for (const f of fields) {
    if (!f || !f[1]) continue;
    const rawText = f[1].trim();
    const numMatch = rawText.match(/^(\d+)\.\s*(.*)/s);
    let numero, enunciado;
    if (numMatch) {
      numero = parseInt(numMatch[1], 10);
      enunciado = numMatch[2].trim();
    } else {
      enunciado = rawText;
      numero = null;
    }

    const rawOpts = f[4] && f[4][0] && f[4][0][1] ? f[4][0][1] : [];
    const opciones = rawOpts.map(o => o[0]);

    if(opciones.length > 0){
        questions.push({
            numero,
            enunciado,
            opciones,
        });
    }
  }
  return questions;
}

(async () => {
  const q1 = await extractQuestions("https://docs.google.com/forms/d/e/1FAIpQLScw7i5GLsa3ra6ISsg1cAMzph7nuETecfQWkUzKZ0y0sN_0Kg/viewform");
  
  let lastNum = 1800; 
  const processed = q1.map((q, i) => {
    if (!q.numero) {
      q.numero = lastNum + 1;
    }
    lastNum = q.numero;
    
    let maxLen = 0;
    let maxIdx = 0;
    q.opciones.forEach((o, j) => {
      if (o.length > maxLen) {
        maxLen = o.length;
        maxIdx = j;
      }
    });
    
    return {
      codigo: `DL1318-P${q.numero}`,
      numero: q.numero,
      materia_grupo: "ESPECIALIDAD",
      norma: "D.L. 1318 - RÉGIMEN DE FORMACIÓN DE LA PNP",
      enunciado: q.enunciado.trim(),
      opciones: q.opciones.map(o => o.trim()),
      respuesta: q.opciones[maxIdx].trim(),
      ubicacion: "D.L. 1318"
    };
  });
  
  fs.writeFileSync("./src/data/dl1318Questions.json", JSON.stringify(processed, null, 2));
  console.log(`Extracted and Mapped ${processed.length} questions for DL 1318`);
})();
