import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function solveBatchWithRetry(questionsBatch, maxRetries = 10) {
  const prompt = `Eres un experto jurista en legislación penal del Perú y en el Balotario Oficial PNP para el Examen de Ascenso.
A continuación tienes un lote de preguntas oficiales sobre el DECRETO LEGISLATIVO Nº 635 CÓDIGO PENAL.
Para cada pregunta, determina la alternativa correcta según el texto legal oficial de la norma (CÓDIGO PENAL).
La propiedad "respuesta" DEBE ser EXACTAMENTE una de las opciones de la lista provista para esa pregunta.

Preguntas:
${JSON.stringify(questionsBatch, null, 2)}

Devuelve ÚNICAMENTE un array JSON válido con la siguiente estructura (no envuelvas en bloques de markdown, solo JSON puro):
[
  {
    "numero": 1,
    "materia_grupo": "ESPECIALIDAD",
    "norma": "DECRETO LEGISLATIVO Nº 635 - CÓDIGO PENAL",
    "enunciado": "...",
    "opciones": ["..."],
    "respuesta": "...",
    "ubicacion": "(Art. X CP)",
    "codigo": "CP-1"
  }
]`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1
        }
      });
      return JSON.parse(response.text);
    } catch (err) {
      console.warn(`Attempt ${attempt} failed: ${err.message}. Retrying in ${attempt * 3}s...`);
      if (attempt === maxRetries) throw err;
      await new Promise(r => setTimeout(r, attempt * 3000));
    }
  }
}

async function main() {
  const allRaw = JSON.parse(fs.readFileSync('./codigo_penal_extracted.json', 'utf8'));
  console.log(`Total questions to solve: ${allRaw.length}`);

  // If a partial file exists, load it and skip already solved batches
  let results = [];
  let startIndex = 0;
  if (fs.existsSync('./src/data/codigoPenalQuestions.json')) {
     try {
       results = JSON.parse(fs.readFileSync('./src/data/codigoPenalQuestions.json', 'utf8'));
       startIndex = results.length;
       console.log(`Resuming from question ${startIndex + 1}...`);
     } catch (e) {
       console.log("Failed to parse partial results, starting from beginning.");
     }
  }

  const batchSize = 10;
  
  for (let i = startIndex; i < allRaw.length; i += batchSize) {
    const chunk = allRaw.slice(i, i + batchSize).map(q => ({
      numero: q.numero,
      enunciado: q.enunciado,
      opciones: q.opciones,
    }));
    
    console.log(`Solving batch ${i + 1} to ${Math.min(i + batchSize, allRaw.length)}...`);
    const solved = await solveBatchWithRetry(chunk);
    console.log(`Batch solved: got ${solved.length} answers.`);
    
    // Safety check: preserve order and map back to numbers
    results.push(...solved);
    
    // Save partial progress
    fs.writeFileSync('./src/data/codigoPenalQuestions.json', JSON.stringify(results, null, 2));
    
    await new Promise(r => setTimeout(r, 2000)); // Rate limiting
  }

  console.log(`Saved ${results.length} solved questions to src/data/codigoPenalQuestions.json`);
}

main().catch(err => console.error("Fatal Error:", err));
