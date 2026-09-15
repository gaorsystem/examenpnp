import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function solveBatchWithRetry(questionsBatch, maxRetries = 4) {
  const prompt = `Eres un experto jurista en legislación policial del Perú y en el Balotario Oficial PNP para el Examen de Ascenso 2026.
A continuación tienes un lote de preguntas oficiales sobre el DECRETO LEGISLATIVO N° 1291 (HERRAMIENTAS PARA LA LUCHA CONTRA LA CORRUPCIÓN EN EL SECTOR INTERIOR) y su Reglamento D.S. N° 013-2017-IN.

Para cada pregunta, determina la alternativa correcta según el texto legal oficial de la norma o balotario PNP.
La propiedad "respuesta" DEBE ser EXACTAMENTE una de las opciones de la lista provista para esa pregunta.

Preguntas:
${JSON.stringify(questionsBatch, null, 2)}

Devuelve ÚNICAMENTE un array JSON válido con la siguiente estructura:
[
  {
    "numero": 316,
    "materia_grupo": "COMUNES",
    "norma": "DECRETO LEGISLATIVO N° 1291 - LUCHA CONTRA LA CORRUPCIÓN",
    "enunciado": "...",
    "opciones": ["..."],
    "respuesta": "...",
    "ubicacion": "(D.L. 1291 Art. X / D.S. 013-2017-IN Art. Y)",
    "codigo": "1291-316"
  }
]`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });
      return JSON.parse(response.text);
    } catch (err) {
      console.warn(`Attempt ${attempt} failed: ${err.message}. Retrying in ${attempt * 2}s...`);
      if (attempt === maxRetries) throw err;
      await new Promise(r => setTimeout(r, attempt * 2000));
    }
  }
}

async function main() {
  const f1 = JSON.parse(fs.readFileSync('./form1_extracted.json', 'utf8'));
  const f2 = JSON.parse(fs.readFileSync('./form2_extracted.json', 'utf8'));
  const allRaw = [...f1, ...f2];
  console.log(`Total questions to solve: ${allRaw.length}`);

  const batchSize = 20;
  const results = [];

  for (let i = 0; i < allRaw.length; i += batchSize) {
    const chunk = allRaw.slice(i, i + batchSize).map(q => ({
      numero: q.numero,
      enunciado: q.enunciado,
      opciones: q.opciones,
    }));
    console.log(`Solving batch ${i + 1} to ${Math.min(i + batchSize, allRaw.length)}...`);
    const solved = await solveBatchWithRetry(chunk);
    console.log(`Batch solved: got ${solved.length} answers.`);
    results.push(...solved);
    await new Promise(r => setTimeout(r, 1000));
  }

  fs.writeFileSync('./dl1291_solved.json', JSON.stringify(results, null, 2));
  console.log(`Saved ${results.length} solved questions to dl1291_solved.json`);
}

main().catch(err => console.error("Fatal Error:", err));
