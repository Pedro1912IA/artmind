# Guía de Deployment a AWS Elastic Beanstalk

Esta guía te llevará paso a paso para desplegar Art Mind Backend en AWS Elastic Beanstalk.

## Prerequisitos

1. **Cuenta de AWS** - Necesitas una cuenta activa de AWS
2. **AWS CLI instalado** - [Descargar aquí](https://aws.amazon.com/cli/)
3. **EB CLI instalado** - Elastic Beanstalk Command Line Interface
4. **Credenciales AWS configuradas** - Access Key ID y Secret Access Key

## Paso 1: Instalar AWS CLI y EB CLI

### Instalar AWS CLI (si no lo tienes)
```powershell
# En Windows, descarga el instalador MSI desde:
# https://awscli.amazonaws.com/AWSCLIV2.msi
```

### Instalar EB CLI
```powershell
pip install awsebcli --upgrade --user
```

Verifica la instalación:
```powershell
aws --version
eb --version
```

## Paso 2: Configurar Credenciales AWS

```powershell
aws configure
```

Te pedirá:
- **AWS Access Key ID**: Tu access key de AWS
- **AWS Secret Access Key**: Tu secret key
- **Default region name**: Por ejemplo `us-east-1`
- **Default output format**: `json`

## Paso 3: Preparar el Backend para Deployment

### 3.1 Navegar al directorio del backend
```powershell
cd "c:\Users\pedro\OneDrive\Escritorio\Art Mind\backend"
```

### 3.2 Compilar el proyecto TypeScript
```powershell
npm run build
```

Esto creará la carpeta `dist/` con el código JavaScript compilado.

### 3.3 Verificar que package.json tenga el script start correcto
Ya está configurado: `"start": "node dist/server.js"`

## Paso 4: Inicializar Elastic Beanstalk

```powershell
eb init
```

Responde las preguntas:
1. **Select a default region**: Elige tu región (ej: `us-east-1`)
2. **Select an application to use**: Selecciona `Create new Application`
3. **Application name**: `art-mind-backend` (o el nombre que prefieras)
4. **Platform**: Selecciona `Node.js`
5. **Platform branch**: Selecciona la versión más reciente de Node.js (ej: Node.js 18 o 20)
6. **Do you wish to continue with CodeCommit?**: `n` (No)
7. **Do you want to set up SSH?**: `y` (Sí, recomendado para debugging)

## Paso 5: Crear el Ambiente de Elastic Beanstalk

```powershell
eb create art-mind-env
```

O con más opciones:
```powershell
eb create art-mind-env --instance-type t3.small --envvars PORT=8080
```

Opciones:
- `art-mind-env`: Nombre del ambiente
- `--instance-type t3.small`: Tipo de instancia EC2 (t3.micro es free tier)
- `--envvars`: Variables de entorno iniciales

Este proceso tomará varios minutos (5-10 min).

## Paso 6: Configurar Variables de Entorno

**IMPORTANTE**: Debes configurar tu API key de Gemini:

```powershell
eb setenv GEMINI_API_KEY=tu_api_key_aqui NODE_ENV=production
```

Para ver las variables configuradas:
```powershell
eb printenv
```

## Paso 7: Desplegar el Backend

```powershell
eb deploy
```

Este comando:
1. Empaqueta tu aplicación
2. Sube el código a S3
3. Despliega en Elastic Beanstalk
4. Reinicia el servidor

## Paso 8: Verificar el Deployment

### Ver el estado
```powershell
eb status
```

### Abrir la aplicación en el navegador
```powershell
eb open
```

### Ver los logs
```powershell
eb logs
```

### Ver logs en tiempo real
```powershell
eb logs --stream
```

## Paso 9: Probar la API

Tu backend estará disponible en una URL como:
```
http://art-mind-env.eba-xxxxxxxx.us-east-1.elasticbeanstalk.com
```

Prueba los endpoints:
```powershell
# Endpoint de prueba (si existe)
curl http://tu-url.elasticbeanstalk.com/test

# Endpoint de API
curl http://tu-url.elasticbeanstalk.com/api
```

## Paso 10: Actualizar el Frontend

Debes actualizar la URL del backend en tu frontend Next.js:

En `frontend/src/app/page.tsx` o donde hagas las llamadas API, cambia:
```typescript
const API_URL = 'http://localhost:3001'; // Desarrollo
```

Por:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tu-url.elasticbeanstalk.com';
```

## Comandos Útiles de EB CLI

```powershell
# Ver estado del ambiente
eb status

# Ver logs
eb logs

# Ver logs en tiempo real
eb logs --stream

# Abrir la consola de AWS en el navegador
eb console

# Abrir la aplicación en el navegador
eb open

# Escalar la aplicación
eb scale 2

# Ver información del ambiente
eb printenv

# Actualizar variables de entorno
eb setenv VAR_NAME=value

# Terminar el ambiente (CUIDADO: elimina todo)
eb terminate art-mind-env

# Listar ambientes
eb list

# SSH al servidor
eb ssh
```

## Despliegues Futuros

Cada vez que hagas cambios:

```powershell
# 1. Compilar TypeScript
npm run build

# 2. Desplegar
eb deploy
```

## Configuración de CORS

Tu backend ya tiene CORS configurado para aceptar todas las origins (`origin: '*'`). En producción, deberías restringir esto:

```typescript
app.use(cors({
  origin: 'https://tu-frontend-url.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

## Costos Estimados

- **t3.micro** (Free Tier): Gratis el primer año, luego ~$8/mes
- **t3.small**: ~$15/mes
- **Load Balancer** (opcional): ~$16/mes
- **Tráfico**: Depende del uso

## Troubleshooting

### Error: "npm install failed"
- Verifica que `package.json` esté correcto
- Revisa los logs: `eb logs`

### Error: "Application not responding"
- Verifica que el puerto sea correcto (usa `process.env.PORT`)
- Revisa los logs: `eb logs --stream`

### Error: "Cannot find module"
- Asegúrate de ejecutar `npm run build` antes de desplegar
- Verifica que `dist/` esté incluido en el deployment

### Error de permisos en uploads/
- Los archivos se guardan en el sistema de archivos efímero
- Para persistencia, usa **S3** para almacenar uploads

## Mejoras Recomendadas para Producción

1. **Usar S3 para uploads**: Los archivos en Elastic Beanstalk son efímeros
2. **Configurar HTTPS**: Usar un certificado SSL/TLS
3. **Usar RDS**: Para base de datos persistente (si la necesitas)
4. **Configurar Auto Scaling**: Para manejar picos de tráfico
5. **Usar CloudFront**: CDN para mejor performance
6. **Implementar logging**: CloudWatch para monitoreo
7. **Configurar health checks**: Endpoint `/health` para verificar estado

## Usar S3 para Uploads (Recomendado)

Para que los uploads persistan, debes usar S3:

1. Crear un bucket S3
2. Instalar AWS SDK:
```powershell
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

3. Modificar el código para subir a S3 en lugar del sistema de archivos local

## Deployment del Frontend

Para el frontend Next.js, tienes varias opciones:
1. **Vercel** (recomendado para Next.js) - Deployment automático
2. **AWS Amplify** - Integración con AWS
3. **S3 + CloudFront** - Hosting estático
4. **Otro Elastic Beanstalk** - Si prefieres todo en AWS EB

## Resumen de Archivos Creados

- `backend/.ebextensions/nodecommand.config` - Configuración de Node.js
- `backend/.ebextensions/uploads.config` - Crear directorio de uploads
- `backend/Procfile` - Comando para iniciar la app
- `backend/.npmrc` - Configuración de npm
- `backend/.ebignore` - Archivos a ignorar en deployment

## Soporte

Si tienes problemas:
1. Revisa los logs: `eb logs --stream`
2. Verifica el estado: `eb status`
3. Consulta la [documentación de AWS EB](https://docs.aws.amazon.com/elasticbeanstalk/)

---

**¡Listo!** Tu backend de Art Mind debería estar corriendo en AWS Elastic Beanstalk.
