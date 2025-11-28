# Deployment del Frontend Next.js

Después de desplegar el backend en AWS Elastic Beanstalk, necesitas desplegar el frontend y conectarlo.

## Opción 1: Vercel (Recomendado para Next.js)

Vercel es la plataforma creada por el equipo de Next.js. Es la opción más simple y optimizada.

### Pasos:

1. **Crear cuenta en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Sign up con GitHub, GitLab o Bitbucket

2. **Conectar repositorio**
   - Click "New Project"
   - Importa tu repositorio de Art Mind
   - Selecciona el directorio `frontend`

3. **Configurar variables de entorno**
   - En Project Settings → Environment Variables
   - Agrega:
     ```
     NEXT_PUBLIC_API_URL=https://tu-url.elasticbeanstalk.com
     ```

4. **Deploy**
   - Click "Deploy"
   - Vercel automáticamente detecta Next.js y lo configura

5. **URL de producción**
   - Tu app estará en: `https://art-mind.vercel.app`
   - Puedes configurar un dominio personalizado

### Comandos CLI (Alternativa):

```powershell
# Instalar Vercel CLI
npm i -g vercel

# Navegar al frontend
cd frontend

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

## Opción 2: AWS Amplify

Mantén todo en AWS con Amplify.

### Pasos:

1. **Crear app en Amplify**
   ```powershell
   # Instalar Amplify CLI
   npm install -g @aws-amplify/cli
   
   # Configurar
   amplify configure
   ```

2. **Inicializar proyecto**
   ```powershell
   cd frontend
   amplify init
   ```

3. **Agregar hosting**
   ```powershell
   amplify add hosting
   ```
   - Selecciona: "Hosting with Amplify Console"
   - Continuous deployment: Yes

4. **Configurar build settings**
   Amplify detectará automáticamente Next.js

5. **Deploy**
   ```powershell
   amplify publish
   ```

### Usando Consola AWS:

1. Ve a [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Conecta tu repositorio (GitHub, GitLab, etc.)
4. Selecciona el branch
5. Configura build settings (auto-detectado para Next.js)
6. Agrega variables de entorno:
   ```
   NEXT_PUBLIC_API_URL=https://tu-url.elasticbeanstalk.com
   ```
7. Click "Save and deploy"

## Opción 3: S3 + CloudFront (Static Export)

Para exportar Next.js como sitio estático.

### 1. Configurar Next.js para export

Edita `frontend/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

### 2. Build estático

```powershell
cd frontend
npm run build
```

Esto crea la carpeta `out/` con archivos estáticos.

### 3. Crear bucket S3

```powershell
# Crear bucket
aws s3 mb s3://art-mind-frontend

# Configurar para hosting web
aws s3 website s3://art-mind-frontend --index-document index.html --error-document 404.html

# Hacer público
aws s3api put-bucket-policy --bucket art-mind-frontend --policy file://bucket-policy.json
```

`bucket-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::art-mind-frontend/*"
    }
  ]
}
```

### 4. Subir archivos

```powershell
aws s3 sync out/ s3://art-mind-frontend --delete
```

### 5. Configurar CloudFront (CDN)

```powershell
# Crear distribución CloudFront
aws cloudfront create-distribution --origin-domain-name art-mind-frontend.s3.amazonaws.com
```

O usa la consola AWS:
1. Ve a [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Create Distribution
3. Origin: Tu bucket S3
4. Viewer Protocol Policy: Redirect HTTP to HTTPS
5. Create

## Actualizar URL del Backend

En cualquier opción, debes actualizar la URL del backend.

### Crear archivo `.env.local` en frontend:

```env
NEXT_PUBLIC_API_URL=https://tu-url.elasticbeanstalk.com
```

### Actualizar código

En `frontend/src/app/page.tsx` (o donde hagas las llamadas):

```typescript
// Antes
const API_URL = 'http://localhost:3001';

// Después
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

Ejemplo de uso:

```typescript
const analyzeArt = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch(`${API_URL}/api/analyze-art`, {
    method: 'POST',
    body: formData,
  });
  
  return await response.json();
};
```

## Configurar CORS en Backend

Actualiza el backend para permitir requests del frontend:

En `backend/src/server.ts`:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://art-mind.vercel.app',
    'https://tu-dominio.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

Luego redeploy el backend:

```powershell
cd backend
npm run build
eb deploy
```

## Comparación de Opciones

| Opción | Pros | Contras | Costo |
|--------|------|---------|-------|
| **Vercel** | ✅ Más fácil<br>✅ Optimizado para Next.js<br>✅ CI/CD automático<br>✅ Edge functions | ❌ Vendor lock-in | Gratis (Hobby)<br>$20/mes (Pro) |
| **AWS Amplify** | ✅ Todo en AWS<br>✅ CI/CD integrado<br>✅ Fácil setup | ❌ Más caro que Vercel | $0.01/min build<br>$0.15/GB hosting |
| **S3 + CloudFront** | ✅ Muy barato<br>✅ Escalable<br>✅ Control total | ❌ Más complejo<br>❌ Solo static export | ~$1-5/mes |

## Recomendación

**Para Art Mind, recomiendo Vercel** porque:
- ✅ Setup en 5 minutos
- ✅ Optimizado para Next.js
- ✅ Gratis para proyectos personales
- ✅ HTTPS automático
- ✅ Deploy automático con git push
- ✅ Preview deployments para cada PR

## Deployment con Vercel (Detallado)

### 1. Preparar el proyecto

```powershell
cd frontend

# Crear .env.local
echo "NEXT_PUBLIC_API_URL=https://tu-url.elasticbeanstalk.com" > .env.local

# Agregar a .gitignore
echo ".env.local" >> .gitignore
```

### 2. Instalar Vercel CLI

```powershell
npm i -g vercel
```

### 3. Login

```powershell
vercel login
```

### 4. Deploy

```powershell
# Deploy de prueba
vercel

# Deploy a producción
vercel --prod
```

### 5. Configurar variables de entorno

```powershell
# Via CLI
vercel env add NEXT_PUBLIC_API_URL production

# O en la web: vercel.com → Project → Settings → Environment Variables
```

### 6. Configurar dominio (opcional)

```powershell
vercel domains add tu-dominio.com
```

## Testing del Frontend

Después del deployment:

1. **Abrir la URL de producción**
2. **Probar funcionalidades**:
   - Upload de imágenes
   - Análisis de arte
   - Generación de fingerprint
   - Creación de variaciones
3. **Verificar en DevTools**:
   - Network tab para ver requests al backend
   - Console para errores
   - Verificar que las URLs sean correctas

## Troubleshooting

### Error: CORS

Si ves errores de CORS:
1. Verifica que el backend tenga configurado CORS correctamente
2. Agrega la URL del frontend a la lista de origins permitidos
3. Redeploy el backend

### Error: API URL incorrecta

1. Verifica `.env.local` en frontend
2. Verifica que la variable esté en Vercel/Amplify
3. Rebuild y redeploy

### Error: 404 en rutas

Para Next.js con routing:
- Vercel: Automático
- Amplify: Automático
- S3: Configura rewrites en CloudFront

## Resumen

1. ✅ Backend desplegado en Elastic Beanstalk
2. ✅ Frontend desplegado en Vercel/Amplify/S3
3. ✅ Variables de entorno configuradas
4. ✅ CORS configurado en backend
5. ✅ HTTPS habilitado
6. ✅ Dominio personalizado (opcional)

**¡Tu aplicación Art Mind está completamente desplegada! 🎉**

## Próximos Pasos

- 🔒 Configurar autenticación (si es necesario)
- 📊 Configurar analytics (Google Analytics, Vercel Analytics)
- 🐛 Configurar error tracking (Sentry)
- 📈 Monitorear performance
- 💾 Configurar S3 para uploads persistentes (ver `S3_SETUP.md`)
