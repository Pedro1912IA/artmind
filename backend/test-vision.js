const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
require('dotenv').config();

async function testVisionAnalysis() {
  console.log('Testing Gemini Vision Analysis...');
  console.log('API Key configured:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  try {
    // You need to provide a test image path here
    const testImagePath = 'test-image.png'; // Change this to your test image
    
    if (!fs.existsSync(testImagePath)) {
      console.log('Test image not found. Please create a test-image.png file first.');
      return;
    }

    const imageBuffer = fs.readFileSync(testImagePath);
    const base64Image = imageBuffer.toString('base64');

    const prompt = `You are an expert art critic and visual analyst. Analyze this artwork in depth and provide your response in JSON format with the following structure:

{
  "emociones": "description of the emotions conveyed by the work",
  "analisis_tecnico": {
    "estilo": "artistic style",
    "tecnicas": "techniques used",
    "tipo_de_pincelada": "description of brushwork type",
    "uso_de_luz": "analysis of light usage",
    "composicion": "composition analysis",
    "paleta": "color palette description"
  },
  "influencias": ["influence1", "influence2", "influence3"],
  "descr_conceptual": "deep conceptual description of the work",
  "oportunidades_creativas": "suggestions for creative exploration",
  "posibles_variaciones": ["variation1", "variation2", "variation3"]
}

Provide a detailed, insightful, and professional analysis. Respond ONLY with the JSON, no additional text. Write all content in English.`;

    console.log('Sending request to Gemini Vision...');
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/png',
          },
        },
        { text: prompt }
      ],
    });

    console.log('Response received!');
    console.log('Analysis:');
    console.log(response.text);

    // Try to parse as JSON
    try {
      const jsonMatch = response.text.match(/```json\n?([\s\S]*?)\n?```/) || 
                        response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonText = jsonMatch[1] || jsonMatch[0];
        const parsed = JSON.parse(jsonText);
        console.log('\nParsed JSON successfully!');
        console.log(JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      console.log('Could not parse as JSON, but got text response');
    }

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response error:', JSON.stringify(error.response, null, 2));
    }
  }
}

testVisionAnalysis();
