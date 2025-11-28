# 🚀 Quick Start - Desplegar Art Mind en AWS

## Opción Rápida (Recomendada)

```powershell
# 1. Navegar al backend
cd "c:\Users\pedro\OneDrive\Escritorio\Art Mind\backend"

# 2. Ejecutar setup automatizado
.\setup-eb.ps1

# 3. ¡Listo! Tu app está en AWS
```

## Opción Manual (Paso a Paso)

### 1️⃣ Instalar Herramientas

```powershell
# Verificar AWS CLI
aws --version

# Si no está instalado, descarga desde:
# https://awscli.amazonaws.com/AWSCLIV2.msi

# Instalar EB CLI
pip install awsebcli --upgrade --user

# Verificar
eb --version
```

### 2️⃣ Configurar AWS

```powershell
# Configurar credenciales
aws configure

# Necesitarás:
# - AWS Access Key ID
# - AWS Secret Access Key  
# - Region (ej: us-east-1)
```

### 3️⃣ Preparar Backend

```powershell
cd "c:\Users\pedro\OneDrive\Escritorio\Art Mind\backend"

# Instalar dependencias
npm install

# Compilar TypeScript
npm run build
```

### 4️⃣ Inicializar Elastic Beanstalk

```powershell
eb init

# Responde:
# - Region: us-east-1
# - App name: art-mind-backend
# - Platform: Node.js
# - Platform branch: Node.js 18+
# - CodeCommit: No
# - SSH: Yes
```

### 5️⃣ Crear Ambiente

```powershell
eb create art-mind-env --instance-type t3.small

# Espera 5-10 minutos...
```

### 6️⃣ Configurar Variables

```powershell
# IMPORTANTE: Configura tu API key
eb setenv GEMINI_API_KEY=tu_api_key_aqui NODE_ENV=production
```

### 7️⃣ Verificar

```powershell
# Ver estado
eb status

# Abrir en navegador
eb open

# Ver logs
eb logs --stream
```

## 📁 Archivos Creados

Tu proyecto ahora tiene:

```
Art Mind/
├── DEPLOYMENT_AWS.md          # Guía completa y detallada
├── DEPLOYMENT_CHECKLIST.md    # Checklist paso a paso
├── QUICK_START.md             # Esta guía rápida
└── backend/
    ├── .ebextensions/         # Configuración de EB
    │   ├── nodecommand.config
    │   ├── uploads.config
    │   └── https-redirect.config
    ├── .ebignore              # Archivos a ignorar
    ├── .gitignore             # Git ignore actualizado
    ├── Procfile               # Comando de inicio
    ├── .npmrc                 # Config de npm
    ├── setup-eb.ps1           # Script de setup
    ├── deploy.ps1             # Script de deploy
    ├── S3_SETUP.md            # Guía de S3
    └── README_DEPLOYMENT.md   # README de deployment
```

## 🔄 Despliegues Futuros

Cada vez que hagas cambios:

```powershell
# Opción 1: Script automatizado
.\deploy.ps1

# Opción 2: Manual
npm run build
eb deploy
```

## 📊 Comandos Útiles

```powershell
# Ver estado
eb status

# Ver logs en tiempo real
eb logs --stream

# Abrir app en navegador
eb open

# Abrir consola AWS
eb console

# Ver variables de entorno
eb printenv

# Configurar variable
eb setenv VAR_NAME=value

# SSH al servidor
eb ssh

# Ver salud del ambiente
eb health
```

## 💰 Costos

- **t3.micro** (Free Tier): Gratis primer año
- **t3.small**: ~$15/mes
- **Load Balancer**: ~$16/mes (si se usa)
- **S3**: ~$0.023/GB/mes

## 🆘 Ayuda

Si tienes problemas:

1. **Ver logs**: `eb logs --stream`
2. **Ver estado**: `eb status`
3. **Leer guía completa**: `DEPLOYMENT_AWS.md`
4. **Seguir checklist**: `DEPLOYMENT_CHECKLIST.md`

## 📚 Documentación

- **Guía completa**: `DEPLOYMENT_AWS.md`
- **Checklist**: `DEPLOYMENT_CHECKLIST.md`
- **S3 Setup**: `backend/S3_SETUP.md`
- **README Backend**: `backend/README_DEPLOYMENT.md`

## ✅ Próximos Pasos

Después de desplegar el backend:

1. ✅ Backend en AWS Elastic Beanstalk
2. 🔧 Configurar S3 para uploads (ver `S3_SETUP.md`)
3. 🔒 Configurar HTTPS con certificado SSL
4. 🌐 Desplegar frontend (Vercel/Amplify/S3)
5. 🔗 Actualizar URL del backend en frontend
6. 🎨 Configurar dominio personalizado

## 🎯 URL de tu Backend

Después del deployment, tu backend estará en:
```
http://art-mind-env.eba-xxxxxxxx.us-east-1.elasticbeanstalk.com
```

Obtén la URL exacta con:
```powershell
eb status | Select-String "CNAME"
```

## 🔗 Actualizar Frontend

En tu frontend Next.js, actualiza la URL del API:

```typescript
// frontend/src/app/page.tsx
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tu-url.elasticbeanstalk.com';
```

Luego crea `.env.local` en frontend:
```env
NEXT_PUBLIC_API_URL=https://tu-url.elasticbeanstalk.com
```

---

**¿Listo para empezar?** 

Ejecuta: `.\setup-eb.ps1` en el directorio backend 🚀
