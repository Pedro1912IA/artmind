import { GoogleGenAI } from '@google/genai';
import { promises as fs } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ''
});

export async function analyzeImageWithGemini(
  imagePath: string,
  prompt: string
): Promise<string> {
  try {
    console.log('Analyzing image with Gemini Vision...');
    console.log('Image path:', imagePath);

    // Read the image and convert to base64
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = getMimeType(imagePath);

    console.log('Image loaded, sending to Gemini...');

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
        { text: prompt }
      ],
    });

    console.log('Response received from Gemini');
    return response.text || '';
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Error analyzing image with Gemini');
  }
}

export async function analyzeMultipleImagesWithGemini(
  imagePaths: string[],
  prompt: string
): Promise<string> {
  try {
    console.log('Analyzing multiple images with Gemini Vision...');

    // Prepare all images
    const imageParts = await Promise.all(
      imagePaths.map(async (imagePath) => {
        const imageBuffer = await fs.readFile(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = getMimeType(imagePath);

        return {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        };
      })
    );

    console.log(`Loaded ${imageParts.length} images, sending to Gemini...`);

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [...imageParts, { text: prompt }],
    });

    console.log('Response received from Gemini');
    return response.text || '';
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Error analyzing images with Gemini');
  }
}

export async function generateTextWithGemini(prompt: string): Promise<string> {
  try {
    console.log('Generating text with Gemini...');

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
    });

    console.log('Response received from Gemini');
    return response.text || '';
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Error generating text with Gemini');
  }
}

function getMimeType(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
  };
  return mimeTypes[extension || ''] || 'image/jpeg';
}
