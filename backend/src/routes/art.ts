import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { analyzeArtwork } from '../services/artAnalysis';
import { createCollection } from '../services/collectionService';
import { generateVariations } from '../services/variationService';
import { storeFingerprint } from '../services/fingerprintAnalysis';

const router = Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

// Analyze artwork
router.post('/analyze-art', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const analysis = await analyzeArtwork(req.file.path);

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Error analyzing artwork' });
  }
});

// Create artistic fingerprint
router.post('/fingerprint', upload.array('images', 10), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    const { generateFingerprint } = await import('../services/fingerprintAnalysis');
    const imagePaths = files.map(file => file.path);
    const fingerprint = await generateFingerprint(imagePaths);
    
    // Store the fingerprint for later use
    storeFingerprint(fingerprint);

    res.json(fingerprint);
  } catch (error) {
    res.status(500).json({ error: 'Error creating fingerprint' });
  }
});

// Generate variations
router.post('/variations', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { fingerprintId, instruction } = req.body;
    
    if (!req.file && !fingerprintId) {
      return res.status(400).json({ error: 'Se requiere una imagen o un fingerprint' });
    }

    const variations = await generateVariations({
      imagePath: req.file?.path,
      fingerprintId,
      instruction
    });

    res.json(variations);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Fingerprint no encontrado') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    } else {
      res.status(500).json({ error: 'Error generando variaciones' });
    }
  }
});

// Create collection
router.post('/create-collection', async (req: Request, res: Response) => {
  try {
    const { fingerprintId, quantity } = req.body;
    
    if (!fingerprintId) {
      return res.status(400).json({ error: 'Missing fingerprint ID' });
    }

    const collection = await createCollection(fingerprintId, quantity);
    res.json(collection);
  } catch (error) {
    if (error instanceof Error && error.message === 'Fingerprint not found') {
      res.status(404).json({ error: 'Fingerprint not found' });
    } else {
      res.status(500).json({ error: 'Error creating collection' });
    }
  }
});

export { router };
