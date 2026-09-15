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
  const q1 = await extractQuestions("https://docs.google.com/forms/d/e/1FAIpQLSelm7UAvKYcGNhgKnQAwu3HPyiTDyT2fbKmzI0L55h6nwu9Fw/viewform");
  
  let lastNum = 1500;
  q1.forEach((q, i) => {
    if (!q.numero) {
      q.numero = lastNum + 1;
    }
    lastNum = q.numero;
  });
  
  fs.writeFileSync("./src/data/rawDl1428.json", JSON.stringify(q1, null, 2));
  console.log(`Extracted ${q1.length} questions in total`);
})();
