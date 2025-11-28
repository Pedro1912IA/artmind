# 📦 Art Mind - Guía Completa de Deployment

Esta es la guía maestra para desplegar Art Mind (Backend + Frontend) en AWS.

## 📚 Documentación Disponible

Tu proyecto ahora incluye documentación completa:

| Archivo | Descripción |
|---------|-------------|
| **QUICK_START.md** | 🚀 Inicio rápido - Comienza aquí |
| **DEPLOYMENT_AWS.md** | 📖 Guía completa de Elastic Beanstalk |
| **DEPLOYMENT_CHECKLIST.md** | ✅ Checklist paso a paso |
| **FRONTEND_DEPLOYMENT.md** | 🌐 Guía de deployment del frontend |
| **backend/S3_SETUP.md** | 📦 Configuración de S3 para uploads |
| **backend/README_DEPLOYMENT.md** | 📝 README del backend |

## 🎯 Flujo de Deployment

```
1. Backend → AWS Elastic Beanstalk
2. Frontend → Vercel / AWS Amplify / S3
3. Conectar Frontend con Backend
4. Configurar S3 para uploads (opcional)
5. Configurar HTTPS y dominio (opcional)
```

## ⚡ Quick Start

### Backend (5-10 minutos)

```powershell
cd backend
.\setup-eb.ps1
```

### Frontend (5 minutos)

```powershell
cd frontend
vercel
```

¡Listo! Tu app está en producción.

## 📋 Archivos de Configuración Creados

### Backend
```
backend/
├── .ebextensions/              # Configuración de Elastic Beanstalk
│   ├── nodecommand.config      # Comando de Node.js
│   ├── uploads.config          # Directorios
│   └── https-redirect.config   # Nginx config
├── .ebignore                   # Archivos a ignorar
├── .gitignore                  # Git ignore
├── Procfile                    # Comando de inicio
├── .npmrc                      # Config npm
├── setup-eb.ps1               # Script de setup
├── deploy.ps1                 # Script de deploy
└── S3_SETUP.md                # Guía de S3
```

## 🛠️ Herramientas Necesarias

### Instalar AWS CLI
```powershell
# Descargar desde:
# https://awscli.amazonaws.com/AWSCLIV2.msi

# Verificar
aws --version
```

### Instalar EB CLI
```powershell
pip install awsebcli --upgrade --user

# Verificar
eb --version
```

### Instalar Vercel CLI (para frontend)
```powershell
npm i -g vercel
```

## 🔐 Configuración AWS

```powershell
aws configure
```

Necesitarás:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (ej: us-east-1)

## 🚀 Deployment del Backend

### Opción 1: Script Automatizado (Recomendado)

```powershell
cd backend
.\setup-eb.ps1
```

### Opción 2: Manual

```powershell
cd backend

# 1. Compilar
npm run build

# 2. Inicializar EB
eb init

# 3. Crear ambiente
eb create art-mind-env --instance-type t3.small

# 4. Configurar variables
eb setenv GEMINI_API_KEY=tu_key NODE_ENV=production

# 5. Verificar
eb status
eb open
```

## 🌐 Deployment del Frontend

### Opción 1: Vercel (Recomendado)

```powershell
cd frontend

# Crear .env.local
echo "NEXT_PUBLIC_API_URL=https://tu-url.elasticbeanstalk.com" > .env.local

# Deploy
vercel login
vercel --prod
```

### Opción 2: AWS Amplify

```powershell
cd frontend
amplify init
amplify add hosting
amplify publish
```

### Opción 3: S3 + CloudFront

```powershell
cd frontend

# Configurar next.config.js para export estático
# Luego:
npm run build
aws s3 sync out/ s3://art-mind-frontend
```

Ver detalles en `FRONTEND_DEPLOYMENT.md`

## 🔗 Conectar Frontend y Backend

### 1. Obtener URL del backend

```powershell
cd backend
eb status | Select-String "CNAME"
```

### 2. Configurar en frontend

Crear `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://tu-url.elasticbeanstalk.com
```

### 3. Actualizar código

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

### 4. Configurar CORS en backend

En `backend/src/server.ts`:
```typescript
app.use(cors({
  origin: ['http://localhost:3000', 'https://tu-frontend.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
```

### 5. Redeploy backend

```powershell
cd backend
npm run build
eb deploy
```

## 📦 Configurar S3 para Uploads (Recomendado)

Los uploads en Elastic Beanstalk son efímeros. Para persistencia, usa S3.

```powershell
# Crear bucket
aws s3 mb s3://art-mind-uploads

# Configurar en backend
cd backend
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

# Configurar variable
eb setenv S3_BUCKET_NAME=art-mind-uploads
```

Ver guía completa en `backend/S3_SETUP.md`

## 📊 Comandos Útiles

### Backend (Elastic Beanstalk)

```powershell
# Ver estado
eb status

# Ver logs
eb logs --stream

# Abrir app
eb open

# Desplegar cambios
.\deploy.ps1

# Ver variables
eb printenv

# Configurar variable
eb setenv VAR_NAME=value

# SSH al servidor
eb ssh

# Terminar ambiente (CUIDADO)
eb terminate art-mind-env
```

### Frontend (Vercel)

```powershell
# Deploy
vercel --prod

# Ver logs
vercel logs

# Ver deployments
vercel ls

# Configurar dominio
vercel domains add tu-dominio.com
```

## 💰 Costos Estimados

### Backend (Elastic Beanstalk)
- **t3.micro** (Free Tier): Gratis primer año, luego ~$8/mes
- **t3.small**: ~$15/mes
- **Load Balancer**: ~$16/mes (opcional)

### Frontend
- **Vercel**: Gratis (Hobby), $20/mes (Pro)
- **AWS Amplify**: $0.01/min build + $0.15/GB hosting
- **S3 + CloudFront**: ~$1-5/mes

### S3 Storage
- ~$0.023/GB/mes
- Primeros 100 GB de transferencia gratis

### Total Estimado
- **Mínimo**: ~$0-8/mes (Free Tier + Vercel gratis)
- **Recomendado**: ~$15-20/mes (t3.small + Vercel gratis)
- **Completo**: ~$35-50/mes (t3.small + Load Balancer + Vercel Pro)

## ✅ Checklist de Deployment

- [ ] AWS CLI instalado y configurado
- [ ] EB CLI instalado
- [ ] Backend compilado (`npm run build`)
- [ ] Backend desplegado en Elastic Beanstalk
- [ ] GEMINI_API_KEY configurado
- [ ] Backend funcionando (verificar con `eb open`)
- [ ] Frontend desplegado (Vercel/Amplify/S3)
- [ ] URL del backend configurada en frontend
- [ ] CORS configurado en backend
- [ ] S3 configurado para uploads (opcional)
- [ ] HTTPS configurado (opcional)
- [ ] Dominio personalizado (opcional)

## 🧪 Testing

### Backend
```powershell
# Obtener URL
eb status | Select-String "CNAME"

# Probar API
curl https://tu-url.elasticbeanstalk.com/api
```

### Frontend
1. Abrir URL de Vercel/Amplify
2. Probar upload de imágenes
3. Verificar análisis de arte
4. Verificar generación de variaciones

### Integration
1. Verificar que frontend se conecta al backend
2. Verificar que no hay errores de CORS
3. Verificar que las imágenes se suben correctamente

## 🐛 Troubleshooting

### Backend no inicia
```powershell
eb logs --stream
```
Verifica:
- `dist/` existe
- Variables de entorno configuradas
- Puerto correcto (usa `process.env.PORT`)

### Error de CORS
Verifica:
- CORS configurado en backend
- URL del frontend en lista de origins
- Redeploy backend después de cambios

### Uploads no persisten
- Configura S3 (ver `backend/S3_SETUP.md`)
- Los archivos en EB son efímeros

### Frontend no se conecta al backend
Verifica:
- `NEXT_PUBLIC_API_URL` configurado
- URL correcta (con https://)
- CORS configurado en backend

## 📖 Recursos

### Documentación
- [AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

### Guías en este proyecto
- `QUICK_START.md` - Inicio rápido
- `DEPLOYMENT_AWS.md` - Guía completa de EB
- `DEPLOYMENT_CHECKLIST.md` - Checklist detallado
- `FRONTEND_DEPLOYMENT.md` - Deployment del frontend
- `backend/S3_SETUP.md` - Configuración de S3

## 🎯 Próximos Pasos

Después del deployment básico:

1. **Seguridad**
   - [ ] Configurar HTTPS con certificado SSL
   - [ ] Restringir CORS a dominios específicos
   - [ ] Configurar rate limiting

2. **Performance**
   - [ ] Configurar CloudFront CDN
   - [ ] Optimizar imágenes
   - [ ] Configurar caching

3. **Monitoreo**
   - [ ] Configurar CloudWatch alarms
   - [ ] Configurar error tracking (Sentry)
   - [ ] Configurar analytics

4. **Escalabilidad**
   - [ ] Configurar Auto Scaling
   - [ ] Usar S3 para uploads
   - [ ] Configurar Load Balancer

5. **Dominio**
   - [ ] Registrar dominio
   - [ ] Configurar DNS
   - [ ] Configurar certificado SSL

## 🆘 Soporte

Si tienes problemas:

1. **Ver logs**: `eb logs --stream`
2. **Ver estado**: `eb status`
3. **Revisar documentación**: Lee las guías específicas
4. **AWS Console**: `eb console`
5. **Documentación AWS**: [docs.aws.amazon.com](https://docs.aws.amazon.com)

## 🎉 ¡Felicitaciones!

Si llegaste hasta aquí, tu aplicación Art Mind debería estar completamente desplegada y funcionando en producción.

**URLs de tu aplicación:**
- Backend: `https://art-mind-env.elasticbeanstalk.com`
- Frontend: `https://art-mind.vercel.app`

---

**Creado para Art Mind** - Creative Art Intelligence Platform
