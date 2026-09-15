import fs from 'fs';

async function extractFormData(url, outputFile) {
  const res = await fetch(url);
  const html = await res.text();
  const match = html.match(/FB_PUBLIC_LOAD_DATA_\s*=\s*(\[.+?\]);\s*<\/script>/s);
  if (!match) {
    console.error("No match for " + url);
    return [];
  }
  const data = JSON.parse(match[1]);
  const title = data[1][8] || data[1][0];
  const fields = data[1][1] || [];
  
  const questions = [];
  for (const f of fields) {
    if (!f || !f[1]) continue;
    const rawText = f[1].trim();
    // parse number if starts with number
    const numMatch = rawText.match(/^(\d+)\.\s*(.*)/s);
    const numero = numMatch ? parseInt(numMatch[1], 10) : questions.length + 1;
    const enunciado = numMatch ? numMatch[2].trim() : rawText;

    const entryId = f[4] && f[4][0] ? f[4][0][0] : null;
    const rawOpts = f[4] && f[4][0] && f[4][0][1] ? f[4][0][1] : [];
    const opciones = rawOpts.map(o => o[0]);

    questions.push({
      id: String(numero),
      numero,
      entryId,
      enunciadoCompleto: rawText,
      enunciado,
      opciones,
    });
  }

  console.log(`Extracted ${questions.length} questions for ${title}`);
  return questions;
}

async function run() {
  const q1 = await extractFormData("https://docs.google.com/forms/d/e/1FAIpQLSdLsIaoEYCRzADxoJ5soQWDadJmnvKpZ3vh708mLHMesrazPg/viewform", "form1.json");
  const q2 = await extractFormData("https://docs.google.com/forms/d/e/1FAIpQLScuQelk33Gou-h0FbOult_J3HLmJoFKYrS5kaZtRbgViWmkTg/viewform", "form2.json");
  
  fs.writeFileSync("./form1_extracted.json", JSON.stringify(q1, null, 2));
  fs.writeFileSync("./form2_extracted.json", JSON.stringify(q2, null, 2));
}

run();
