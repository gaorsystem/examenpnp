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
      // We will assign index later
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
  const q1 = await extractQuestions("https://docs.google.com/forms/d/e/1FAIpQLSfypqAOMf4d_8EmqA6KWZAHWi8Z6s4ie-Wu-UqhJqkm4m_DYA/viewform");
  const q2 = await extractQuestions("https://docs.google.com/forms/d/e/1FAIpQLSe3SOdOAE-btJTbk_JcZs6XC0sxA3I38rwM1ieGAIRJ395mXQ/viewform");
  
  const allQs = [...q1, ...q2];
  
  // Assign missing numbers if any based on previous or index
  let lastNum = 1330;
  allQs.forEach((q, i) => {
    if (!q.numero) {
      q.numero = lastNum + 1;
    }
    lastNum = q.numero;
  });
  
  fs.writeFileSync("./src/data/rawFortalecer.json", JSON.stringify(allQs, null, 2));
  console.log(`Extracted ${allQs.length} questions in total`);
})();
