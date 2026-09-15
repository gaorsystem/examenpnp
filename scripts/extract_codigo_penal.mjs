import fs from 'fs';

async function extractFormData(url) {
  const res = await fetch(url);
  const html = await res.text();
  const match = html.match(/FB_PUBLIC_LOAD_DATA_\s*=\s*(\[.+?\]);\s*<\/script>/s);
  if (!match) {
    console.error("No match for " + url);
    return [];
  }
  const data = JSON.parse(match[1]);
  const fields = data[1][1] || [];
  
  const questions = [];
  for (const f of fields) {
    if (!f || !f[1]) continue;
    const rawText = f[1].trim();
    // Usually starts with number
    const numMatch = rawText.match(/^(\d+)\.\s*(.*)/s) || rawText.match(/^(\d+)[-)]\s*(.*)/s);
    let numero = numMatch ? parseInt(numMatch[1], 10) : null;
    const enunciado = numMatch ? numMatch[2].trim() : rawText;
    const entryId = f[4] && f[4][0] ? f[4][0][0] : null;
    const rawOpts = f[4] && f[4][0] && f[4][0][1] ? f[4][0][1] : [];
    const opciones = rawOpts.map(o => o[0]);
    if (opciones.length > 0) {
      questions.push({
        numero,
        enunciadoCompleto: rawText,
        enunciado,
        opciones,
      });
    }
  }
  return questions;
}

async function run() {
  const urls = [
    "https://docs.google.com/forms/d/e/1FAIpQLScF-1rTMPnqvd5wTmTcQWpp8BdoHOFFoqey8BA58f2GlZT9KA/viewform",
    "https://docs.google.com/forms/d/e/1FAIpQLSdUSgugSV_MopUv5u166WXKDQ3duBw7IJUKdoXUEXcNY4274Q/viewform",
    "https://docs.google.com/forms/d/e/1FAIpQLScEFhV0-5Kj5wkdRtK1fDIO930I6cIHngEVtOZ8j1IdArFOQA/viewform",
    "https://docs.google.com/forms/d/e/1FAIpQLSeHhDkJKZePyeH8JmButuxHyW8zpTe2ZOY0j9_zrIv6mlTs8A/viewform",
    "https://docs.google.com/forms/d/e/1FAIpQLSda9EEoetC-AS-miU8Sa8hgVumU-IwUy_TR3LPvRAHmltXkKA/viewform"
  ];
  let allQuestions = [];
  for (const url of urls) {
    const q = await extractFormData(url);
    allQuestions.push(...q);
  }
  
  // Fix numbering if some are missing or repeated
  allQuestions = allQuestions.map((q, idx) => ({ ...q, numero: idx + 1 }));
  
  fs.writeFileSync("./codigo_penal_extracted.json", JSON.stringify(allQuestions, null, 2));
  console.log(`Saved ${allQuestions.length} questions to codigo_penal_extracted.json`);
}
run();
