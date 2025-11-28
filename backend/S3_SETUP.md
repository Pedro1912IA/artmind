# Configurar S3 para Uploads Persistentes

Los archivos subidos a Elastic Beanstalk se almacenan en el sistema de archivos local, que es **efímero**. Cuando la instancia se reinicia o escala, los archivos se pierden.

Para persistencia, usa **Amazon S3**.

## Paso 1: Crear Bucket S3

### Usando AWS CLI:
```powershell
# Crear bucket (el nombre debe ser único globalmente)
aws s3 mb s3://art-mind-uploads --region us-east-1

# Configurar CORS
aws s3api put-bucket-cors --bucket art-mind-uploads --cors-configuration file://cors.json
```

### Crear archivo `cors.json`:
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

### Usando Consola AWS:
1. Ve a [S3 Console](https://console.aws.amazon.com/s3/)
2. Click "Create bucket"
3. Nombre: `art-mind-uploads`
4. Region: Misma que tu Elastic Beanstalk
5. Desbloquea "Block all public access" si necesitas acceso público
6. Click "Create bucket"

## Paso 2: Configurar Permisos IAM

Tu instancia de Elastic Beanstalk necesita permisos para acceder a S3.

### Crear política IAM:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::art-mind-uploads",
        "arn:aws:s3:::art-mind-uploads/*"
      ]
    }
  ]
}
```

### Adjuntar política al rol de EB:
1. Ve a [IAM Console](https://console.aws.amazon.com/iam/)
2. Roles → Busca `aws-elasticbeanstalk-ec2-role`
3. Attach policies → Crea una nueva con el JSON de arriba
4. Nombre: `ArtMindS3Access`

## Paso 3: Instalar AWS SDK

```powershell
cd backend
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## Paso 4: Crear Servicio de S3

Crear archivo `backend/src/services/s3Service.ts`:

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'art-mind-uploads';

export class S3Service {
  /**
   * Sube un archivo a S3
   */
  static async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads'
  ): Promise<string> {
    const key = `${folder}/${uuidv4()}-${file.originalname}`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);
    
    // Retornar URL pública (si el bucket es público)
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
  }

  /**
   * Sube un buffer a S3 (para imágenes generadas)
   */
  static async uploadBuffer(
    buffer: Buffer,
    filename: string,
    contentType: string = 'image/png',
    folder: string = 'generated'
  ): Promise<string> {
    const key = `${folder}/${uuidv4()}-${filename}`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);
    
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
  }

  /**
   * Obtiene una URL firmada para acceso temporal
   */
  static async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  }

  /**
   * Elimina un archivo de S3
   */
  static async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  }
}
```

## Paso 5: Actualizar Multer para usar Memoria

En `server.ts`, cambia la configuración de multer:

```typescript
// Antes (almacenamiento en disco):
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Después (almacenamiento en memoria):
const storage = multer.memoryStorage();
```

## Paso 6: Actualizar Rutas para usar S3

Ejemplo en `routes/art.ts`:

```typescript
import { S3Service } from '../services/s3Service';

// En el endpoint de análisis
router.post('/analyze-art', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Subir a S3
    const imageUrl = await S3Service.uploadFile(req.file, 'uploads');
    
    // Analizar con Gemini (usa req.file.buffer)
    const analysis = await analyzeArtwork(req.file.buffer);
    
    res.json({ analysis, imageUrl });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to analyze artwork' });
  }
});

// Para imágenes generadas
const imageBuffer = Buffer.from(imageData, 'base64');
const imageUrl = await S3Service.uploadBuffer(
  imageBuffer,
  'generated-art.png',
  'image/png',
  'generated'
);
```

## Paso 7: Configurar Variables de Entorno

```powershell
eb setenv S3_BUCKET_NAME=art-mind-uploads AWS_REGION=us-east-1
```

## Paso 8: Desplegar

```powershell
npm run build
eb deploy
```

## Verificar

```powershell
# Ver logs
eb logs --stream

# Probar upload
curl -X POST -F "image=@test.jpg" https://tu-url.elasticbeanstalk.com/api/analyze-art
```

## Costos de S3

- **Almacenamiento**: ~$0.023 por GB/mes
- **Requests PUT**: $0.005 por 1,000 requests
- **Requests GET**: $0.0004 por 1,000 requests
- **Transferencia de datos**: Primeros 100 GB/mes gratis

Ejemplo: 1,000 imágenes de 1MB cada una:
- Almacenamiento: 1 GB × $0.023 = $0.023/mes
- Uploads: 1,000 × $0.005/1000 = $0.005
- **Total**: ~$0.03/mes

## Limpieza de Archivos Antiguos

Para evitar costos, configura lifecycle policies:

```powershell
aws s3api put-bucket-lifecycle-configuration --bucket art-mind-uploads --lifecycle-configuration file://lifecycle.json
```

`lifecycle.json`:
```json
{
  "Rules": [
    {
      "Id": "DeleteOldUploads",
      "Status": "Enabled",
      "Prefix": "uploads/",
      "Expiration": {
        "Days": 30
      }
    }
  ]
}
```

Esto elimina automáticamente archivos de más de 30 días.

## Alternativa: Usar URLs Pre-firmadas

Si no quieres hacer público el bucket, usa URLs pre-firmadas:

```typescript
// En lugar de retornar URL pública
const imageUrl = await S3Service.uploadFile(req.file, 'uploads');

// Retorna URL firmada
const signedUrl = await S3Service.getSignedUrl(key, 3600); // Expira en 1 hora
```

## Resumen

1. ✅ Crear bucket S3
2. ✅ Configurar permisos IAM
3. ✅ Instalar AWS SDK
4. ✅ Crear servicio S3
5. ✅ Actualizar multer a memoria
6. ✅ Actualizar rutas
7. ✅ Configurar variables de entorno
8. ✅ Desplegar

**Beneficios:**
- ✅ Persistencia de archivos
- ✅ Escalabilidad
- ✅ Backups automáticos
- ✅ CDN con CloudFront (opcional)
- ✅ Bajo costo
