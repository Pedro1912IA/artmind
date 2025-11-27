import { Router, Request, Response } from 'express';
import { generateImage } from '../services/imageGenerationService';

const router = Router();

// Endpoint de prueba para generación de imágenes
router.get('/test-image-gen', async (req: Request, res: Response) => {
  try {
    console.log('Iniciando prueba de generación de imagen...');
    
    const imagePath = await generateImage({
      prompt: 'Create a simple abstract painting with geometric shapes in vibrant colors',
      outputPath: 'test-generation.png'
    });

    console.log('Imagen generada exitosamente:', imagePath);
    
    res.json({
      success: true,
      message: 'Imagen generada exitosamente',
      imagePath: imagePath,
      imageUrl: `http://localhost:3001${imagePath}`
    });
  } catch (error: any) {
    console.error('Error en prueba de generación:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export { router };
