import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: 'Responde brevemente: ¿Cuál es el objeto del Decreto Legislativo 1291 del Perú?'
  });
  console.log(response.text);
}

test();
