const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
require('dotenv').config();

async function testImageGeneration() {
  console.log('Iniciando prueba de generación de imágenes...');
  console.log('API Key configurada:', process.env.GEMINI_API_KEY ? 'Sí' : 'No');

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  try {
    const prompt = [
      { text: "Create a simple abstract painting with geometric shapes in blue and orange colors" }
    ];

    console.log('Enviando solicitud a Gemini...');
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
    });

    console.log('Respuesta recibida');
    console.log('Candidatos:', response.candidates?.length || 0);

    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      console.log('Partes en el contenido:', candidate.content?.parts?.length || 0);

      for (const part of candidate.content.parts) {
        if (part.text) {
          console.log('Texto:', part.text);
        }
        if (part.inlineData) {
          console.log('Imagen encontrada!');
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, 'base64');
          fs.writeFileSync('test-image.png', buffer);
          console.log('Imagen guardada como test-image.png');
        }
      }
    } else {
      console.log('No se recibieron candidatos');
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Respuesta del error:', JSON.stringify(error.response, null, 2));
    }
  }
}

testImageGeneration();
