# ❓ Art Mind - Preguntas Frecuentes (FAQ)

## 📋 Índice

- [General](#general)
- [Pre-requisitos](#pre-requisitos)
- [Instalación](#instalación)
- [Deployment Backend](#deployment-backend)
- [Deployment Frontend](#deployment-frontend)
- [Configuración](#configuración)
- [Troubleshooting](#troubleshooting)
- [Costos](#costos)
- [Seguridad](#seguridad)
- [Performance](#performance)
- [Mantenimiento](#mantenimiento)

---

## General

### ¿Qué es Art Mind?
Art Mind es una plataforma web para análisis de arte y creación asistida por IA, usando Google Gemini para análisis de imágenes y generación de variaciones artísticas.

### ¿Necesito experiencia con AWS?
No es necesario. Los scripts automatizados (`setup-eb.ps1`) hacen todo el trabajo. Si quieres aprender, lee la documentación completa.

### ¿Cuánto tiempo toma el deployment?
- **Script automatizado**: 10-15 minutos
- **Manual básico**: 30-45 minutos
- **Completo con S3 y HTTPS**: 2-3 horas

### ¿Qué archivos debo leer primero?
Empieza con [QUICK_START.md](QUICK_START.md) si quieres rapidez, o [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) para un overview completo.

---

## Pre-requisitos

### ¿Necesito una cuenta de AWS?
Sí, necesitas una cuenta de AWS con una tarjeta de crédito registrada.

### ¿Hay free tier disponible?
Sí, AWS ofrece free tier que incluye:
- 750 horas/mes de EC2 t3.micro (primer año)
- 5 GB de S3
- 100 GB de transferencia de datos

### ¿Qué herramientas necesito instalar?
1. **AWS CLI** - Para interactuar con AWS
2. **EB CLI** - Para Elastic Beanstalk
3. **Node.js 18+** - Para compilar el proyecto
4. **Git** - Para control de versiones

### ¿Necesito saber programar?
No para el deployment básico. Los scripts están listos. Pero ayuda entender TypeScript/JavaScript para modificar el código.

---

## Instalación

### ¿Cómo instalo AWS CLI en Windows?
Descarga el instalador MSI desde:
https://awscli.amazonaws.com/AWSCLIV2.msi

### ¿Cómo instalo EB CLI?
```powershell
pip install awsebcli --upgrade --user
```

### ¿Qué hago si pip no está instalado?
Instala Python desde https://www.python.org/downloads/ (incluye pip)

### ¿Cómo verifico que las herramientas están instaladas?
```powershell
aws --version
eb --version
node --version
```

---

## Deployment Backend

### ¿Debo usar el script automatizado o manual?
- **Script automatizado** (`setup-eb.ps1`): Recomendado para principiantes
- **Manual**: Si quieres aprender o necesitas configuración personalizada

### ¿Qué hace el script setup-eb.ps1?
1. Verifica AWS CLI y EB CLI
2. Verifica credenciales AWS
3. Compila TypeScript
4. Inicializa Elastic Beanstalk
5. Crea el ambiente
6. Configura variables de entorno

### ¿Puedo elegir otra región que no sea us-east-1?
Sí, puedes elegir cualquier región de AWS durante `eb init`. Recomendadas:
- `us-east-1` (Virginia) - Más barata
- `us-west-2` (Oregon) - Buena latencia
- `sa-east-1` (São Paulo) - Para Latinoamérica

### ¿Qué tipo de instancia debo usar?
- **t3.micro**: Free tier (primer año), suficiente para testing
- **t3.small**: Recomendado para producción pequeña (~$15/mes)
- **t3.medium**: Para más tráfico (~$30/mes)

### ¿Cuánto tarda eb create?
Entre 5-10 minutos. Es normal, AWS está:
- Creando instancia EC2
- Configurando security groups
- Instalando Node.js
- Instalando dependencias
- Iniciando la aplicación

### ¿Cómo sé si el deployment fue exitoso?
```powershell
eb status
```
Busca:
- Status: Ready
- Health: Green

### ¿Dónde está mi aplicación desplegada?
```powershell
eb open
```
O busca la URL en la salida de `eb status` (CNAME)

---

## Deployment Frontend

### ¿Qué plataforma recomiendan para el frontend?
**Vercel** es la mejor opción para Next.js:
- Gratis para proyectos personales
- Deploy automático con git push
- HTTPS incluido
- Edge network global

### ¿Puedo usar AWS para el frontend también?
Sí, opciones:
1. **AWS Amplify** - Similar a Vercel, integrado con AWS
2. **S3 + CloudFront** - Más barato pero más complejo

### ¿Cómo despliego en Vercel?
```powershell
cd frontend
npm i -g vercel
vercel login
vercel --prod
```

### ¿Necesito configurar algo en el frontend?
Sí, la URL del backend:
```env
NEXT_PUBLIC_API_URL=https://tu-url.elasticbeanstalk.com
```

---

## Configuración

### ¿Dónde configuro mi GEMINI_API_KEY?
```powershell
eb setenv GEMINI_API_KEY=tu_api_key_aqui
```

**NUNCA** la pongas en el código o en Git.

### ¿Cómo obtengo una GEMINI_API_KEY?
1. Ve a https://makersuite.google.com/app/apikey
2. Crea un nuevo API key
3. Cópialo y guárdalo de forma segura

### ¿Qué otras variables de entorno necesito?
```powershell
eb setenv NODE_ENV=production
eb setenv PORT=8080
```

### ¿Cómo veo las variables configuradas?
```powershell
eb printenv
```

### ¿Cómo actualizo una variable de entorno?
```powershell
eb setenv VAR_NAME=nuevo_valor
```
La aplicación se reiniciará automáticamente.

---

## Troubleshooting

### Error: "npm install failed"
**Causa**: Problema con dependencias

**Solución**:
```powershell
# Verificar package.json
cat backend/package.json

# Ver logs
eb logs --stream

# Limpiar y reinstalar
rm -rf node_modules
npm install
npm run build
eb deploy
```

### Error: "Application not responding"
**Causa**: Puerto incorrecto o aplicación no inicia

**Solución**:
```powershell
# Ver logs
eb logs --stream

# Verificar que server.ts use process.env.PORT
# Debe ser: const port = process.env.PORT || 3001;

# Recompilar
npm run build
eb deploy
```

### Error: "Cannot find module"
**Causa**: Falta compilar TypeScript

**Solución**:
```powershell
npm run build
eb deploy
```

### Error de CORS
**Causa**: Frontend no está en la lista de origins permitidos

**Solución**:
En `backend/src/server.ts`:
```typescript
app.use(cors({
  origin: ['http://localhost:3000', 'https://tu-frontend.vercel.app'],
}));
```

Luego:
```powershell
npm run build
eb deploy
```

### Error: "Access Denied" en AWS
**Causa**: Credenciales incorrectas o sin permisos

**Solución**:
```powershell
# Reconfigurar credenciales
aws configure

# Verificar
aws sts get-caller-identity
```

### Los uploads no persisten
**Causa**: El sistema de archivos de EB es efímero

**Solución**: Configura S3 (ver [backend/S3_SETUP.md](backend/S3_SETUP.md))

### Error: "eb: command not found"
**Causa**: EB CLI no está en el PATH

**Solución**:
```powershell
# Reinstalar
pip install awsebcli --upgrade --user

# Agregar al PATH (Windows)
# Buscar donde se instaló (usualmente en %USERPROFILE%\AppData\Roaming\Python\Scripts)
```

---

## Costos

### ¿Cuánto cuesta el deployment?
Depende de la configuración:

**Free Tier (primer año)**:
- EC2 t3.micro: Gratis
- Vercel: Gratis
- S3: ~$0.12/mes
- **Total: ~$0.12/mes**

**Recomendado**:
- EC2 t3.small: $15/mes
- Vercel: Gratis
- S3: ~$1/mes
- **Total: ~$16/mes**

**Producción**:
- EC2 t3.small (2 instancias): $30/mes
- Load Balancer: $16/mes
- Vercel Pro: $20/mes
- S3 + CloudFront: ~$50/mes
- **Total: ~$116/mes**

### ¿Cómo puedo reducir costos?
1. Usa t3.micro (free tier)
2. No uses Load Balancer
3. Usa Vercel gratis
4. Limpia archivos viejos de S3
5. Apaga el ambiente cuando no lo uses: `eb terminate`

### ¿Cómo monitoreo los costos?
1. Ve a AWS Billing Dashboard
2. Configura Budget Alerts
3. Revisa Cost Explorer

### ¿Puedo usar free tier indefinidamente?
No, free tier de EC2 es solo el primer año. Después pagas ~$8/mes por t3.micro.

---

## Seguridad

### ¿Es seguro exponer mi backend?
Sí, si sigues las mejores prácticas:
- ✅ Usa HTTPS
- ✅ Configura CORS correctamente
- ✅ No expongas API keys
- ✅ Usa variables de entorno
- ⚠️ Considera agregar rate limiting
- ⚠️ Considera agregar autenticación

### ¿Debo commitear .env a Git?
**NUNCA**. El archivo `.env` debe estar en `.gitignore`.

### ¿Cómo protejo mi GEMINI_API_KEY?
1. Nunca la pongas en el código
2. Usa variables de entorno: `eb setenv`
3. No la commitees a Git
4. Rótala periódicamente

### ¿Necesito configurar HTTPS?
Elastic Beanstalk soporta HTTPS, pero requiere:
1. Certificado SSL (gratis con AWS Certificate Manager)
2. Load Balancer
3. Configuración adicional

Ver [DEPLOYMENT_AWS.md](DEPLOYMENT_AWS.md) para detalles.

### ¿Cómo restrinjo acceso a mi API?
Opciones:
1. **CORS**: Limita origins permitidos
2. **API Key**: Requiere key en headers
3. **Authentication**: JWT, OAuth, etc.
4. **Rate Limiting**: Limita requests por IP
5. **WAF**: Web Application Firewall de AWS

---

## Performance

### ¿Cuántos usuarios puede manejar?
Depende de la instancia:
- **t3.micro**: 10-20 usuarios concurrentes
- **t3.small**: 50-100 usuarios concurrentes
- **t3.medium**: 100-200 usuarios concurrentes

Con Auto Scaling, puedes manejar miles.

### ¿Cómo mejoro la performance?
1. **CDN**: CloudFront para frontend
2. **Caching**: Redis para resultados
3. **Optimización**: Comprimir imágenes
4. **Auto Scaling**: Múltiples instancias
5. **Database**: Para fingerprints persistentes

### ¿Cuál es la latencia esperada?
- Frontend → Backend: 50-200ms
- Backend → Gemini API: 1-5s
- Total (análisis): 1.5-6s

### ¿Puedo usar múltiples instancias?
Sí, con Auto Scaling:
```powershell
eb scale 3
```

Esto crea 3 instancias y un Load Balancer.

---

## Mantenimiento

### ¿Cómo actualizo mi aplicación?
```powershell
# Hacer cambios en el código
npm run build
eb deploy
```

O usa el script:
```powershell
.\deploy.ps1
```

### ¿Cómo veo los logs?
```powershell
# Logs recientes
eb logs

# Logs en tiempo real
eb logs --stream
```

### ¿Cómo hago rollback?
```powershell
# Ver versiones
eb appversion

# Hacer rollback
eb deploy --version <version-label>
```

### ¿Cómo escalo mi aplicación?
```powershell
# Escalar a 3 instancias
eb scale 3

# Configurar Auto Scaling
eb config
```

### ¿Cómo actualizo Node.js?
En `.elasticbeanstalk/config.yml`, cambia la versión de la plataforma.

### ¿Cómo hago backup?
1. **Código**: Git repository
2. **Configuración**: `.elasticbeanstalk/` en Git
3. **S3**: Versionado habilitado
4. **Fingerprints**: Exportar a base de datos

### ¿Cómo elimino todo?
```powershell
# Terminar ambiente (CUIDADO: elimina todo)
eb terminate art-mind-env

# Eliminar bucket S3
aws s3 rb s3://art-mind-uploads --force
```

---

## Preguntas Específicas

### ¿Puedo usar otro modelo de IA?
Sí, puedes modificar el código para usar:
- OpenAI GPT-4 Vision
- Anthropic Claude
- Stability AI
- Etc.

### ¿Puedo agregar autenticación?
Sí, opciones:
- AWS Cognito
- Auth0
- Firebase Auth
- JWT custom

### ¿Puedo usar una base de datos?
Sí, opciones:
- AWS RDS (PostgreSQL, MySQL)
- AWS DynamoDB (NoSQL)
- MongoDB Atlas

### ¿Puedo deployar en otra región?
Sí, durante `eb init` elige la región que prefieras.

### ¿Puedo usar Docker?
Sí, Elastic Beanstalk soporta Docker. Crea un `Dockerfile` y cambia la plataforma.

### ¿Puedo usar CI/CD?
Sí, opciones:
- GitHub Actions
- AWS CodePipeline
- GitLab CI
- CircleCI

---

## Recursos Adicionales

### Documentación del Proyecto
- [QUICK_START.md](QUICK_START.md) - Inicio rápido
- [DEPLOYMENT_AWS.md](DEPLOYMENT_AWS.md) - Guía completa
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Checklist
- [FRONTEND_DEPLOYMENT.md](FRONTEND_DEPLOYMENT.md) - Frontend
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitectura
- [backend/S3_SETUP.md](backend/S3_SETUP.md) - S3

### Documentación Externa
- [AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/)
- [AWS CLI](https://docs.aws.amazon.com/cli/)
- [EB CLI](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

### Soporte
- AWS Support: https://console.aws.amazon.com/support/
- AWS Forums: https://forums.aws.amazon.com/
- Stack Overflow: https://stackoverflow.com/

---

## ¿No encuentras tu pregunta?

1. **Revisa los logs**: `eb logs --stream`
2. **Lee la documentación completa**: [DEPLOYMENT_AWS.md](DEPLOYMENT_AWS.md)
3. **Busca en Stack Overflow**: Muchos problemas ya están resueltos
4. **Consulta AWS Forums**: Comunidad muy activa

---

**Art Mind** - Creative Art Intelligence Platform

**Última actualización**: 2024
