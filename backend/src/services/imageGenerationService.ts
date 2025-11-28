import { GoogleGenAI } from '@google/genai';
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Verificar que la API key esté configurada
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY no está configurada en el archivo .env');
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ''
});

export interface ImageGenerationOptions {
  prompt: string;
  baseImagePath?: string;
  outputPath?: string;
}

export async function generateImage(options: ImageGenerationOptions): Promise<string> {
  try {
    const { prompt, baseImagePath, outputPath } = options;

    console.log('Generando imagen con Gemini Imagen...');
    console.log('Prompt:', prompt);
    console.log('Imagen base:', baseImagePath || 'ninguna');

    // Preparar el contenido del prompt - array de partes
    const promptParts: any[] = [{ text: prompt }];

    // Si hay una imagen base, agregarla al prompt
    if (baseImagePath) {
      const imageData = await fs.readFile(baseImagePath);
      const base64Image = imageData.toString('base64');
      const mimeType = getMimeType(baseImagePath);

      promptParts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
      });
    }

    // Generar la imagen con Gemini - usar el formato correcto
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: promptParts,
    });

    console.log('Respuesta recibida de Gemini');

    // Procesar la respuesta
    if (!response || !response.candidates || response.candidates.length === 0) {
      console.error('No se recibieron candidatos en la respuesta');
      throw new Error('No se recibieron candidatos en la respuesta');
    }

    const candidate = response.candidates[0];
    if (!candidate || !candidate.content || !candidate.content.parts) {
      console.error('Estructura de respuesta inválida');
      throw new Error('Estructura de respuesta inválida');
    }

    // Buscar la imagen en las partes de la respuesta
    for (const part of candidate.content.parts) {
      if (part.inlineData && part.inlineData.data) {
        console.log('Imagen encontrada en la respuesta');
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, 'base64');

        // Generar nombre de archivo único
        const timestamp = Date.now();
        const filename = outputPath || `generated-${timestamp}.png`;
        const fullPath = path.join('uploads', 'generated', filename);

        // Crear directorio si no existe
        await fs.mkdir(path.join('uploads', 'generated'), { recursive: true });

        // Guardar la imagen
        await fs.writeFile(fullPath, buffer);

        console.log(`Imagen guardada como ${fullPath}`);
        // Retornar la ruta relativa desde la carpeta uploads
        const relativePath = fullPath.replace(/\\/g, '/').replace('uploads/', '/');
        return relativePath;
      }
    }

    console.error('No se encontró imagen en la respuesta');
    throw new Error('No se generó ninguna imagen en la respuesta');
  } catch (error: any) {
    console.error('Error generando imagen con Gemini:', error);
    console.error('Detalles del error:', error.message);
    if (error.response) {
      console.error('Respuesta del error:', error.response);
    }
    throw new Error(`Error al generar imagen: ${error.message}`);
  }
}

export async function generateMultipleImages(
  prompts: string[],
  baseImagePath?: string
): Promise<string[]> {
  console.log(`Generando ${prompts.length} imágenes en paralelo...`);
  
  // Generar todas las imágenes en paralelo para reducir el tiempo total
  const imagePromises = prompts.map((prompt, i) => 
    generateImage({
      prompt,
      baseImagePath,
      outputPath: `variation-${Date.now()}-${i}.png`,
    }).catch(error => {
      console.error(`Error generating image ${i + 1}:`, error);
      return null; // Retornar null si falla, pero continuar con las demás
    })
  );

  const results = await Promise.all(imagePromises);
  
  // Filtrar los resultados nulos (imágenes que fallaron)
  const generatedImages = results.filter((img): img is string => img !== null);
  
  console.log(`${generatedImages.length} de ${prompts.length} imágenes generadas exitosamente`);
  
  return generatedImages;
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
