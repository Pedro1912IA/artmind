# Art Mind Backend - Deployment Guide

## Quick Start

### Opción 1: Usar Scripts Automatizados (Recomendado)

#### Primera vez (Setup inicial):
```powershell
.\setup-eb.ps1
```

Este script:
- Verifica instalación de AWS CLI y EB CLI
- Configura credenciales AWS
- Inicializa Elastic Beanstalk
- Crea el ambiente
- Configura variables de entorno

#### Despliegues posteriores:
```powershell
.\deploy.ps1
```

### Opción 2: Manual

Ver la guía completa en `DEPLOYMENT_AWS.md` en la raíz del proyecto.

## Comandos Rápidos

```powershell
# Ver estado
eb status

# Ver logs en tiempo real
eb logs --stream

# Abrir aplicación
eb open

# Configurar variable de entorno
eb setenv GEMINI_API_KEY=tu_key_aqui

# Ver variables de entorno
eb printenv

# Desplegar cambios
npm run build
eb deploy
```

## Variables de Entorno Requeridas

- `GEMINI_API_KEY` - Tu API key de Google Gemini (REQUERIDO)
- `NODE_ENV` - Debe ser "production"
- `PORT` - Puerto del servidor (Elastic Beanstalk usa 8080 por defecto)

## Estructura de Archivos de Deployment

```
backend/
├── .ebextensions/              # Configuración de Elastic Beanstalk
│   ├── nodecommand.config      # Comando de inicio de Node.js
│   ├── uploads.config          # Crear directorios necesarios
│   └── https-redirect.config   # Configuración de Nginx
├── .ebignore                   # Archivos a ignorar en deployment
├── Procfile                    # Comando para iniciar la app
├── .npmrc                      # Configuración de npm
├── setup-eb.ps1               # Script de setup inicial
└── deploy.ps1                 # Script de deployment
```

## Troubleshooting

### La aplicación no inicia
```powershell
# Ver logs detallados
eb logs --stream

# Verificar que dist/ existe
ls dist/

# Recompilar
npm run build
```

### Error de permisos
```powershell
# Verificar .npmrc
cat .npmrc

# Debe contener: unsafe-perm=true
```

### Uploads no persisten
Los archivos en Elastic Beanstalk son efímeros. Para persistencia, usa S3.

Ver sección "Usar S3 para Uploads" en `DEPLOYMENT_AWS.md`.

## Costos Estimados

- **t3.micro** (Free Tier): Gratis primer año, luego ~$8/mes
- **t3.small**: ~$15/mes
- **Load Balancer** (si se usa): ~$16/mes

## Próximos Pasos

1. ✅ Desplegar backend en Elastic Beanstalk
2. 🔧 Configurar HTTPS con certificado SSL
3. 📦 Configurar S3 para uploads persistentes
4. 🌐 Desplegar frontend (Vercel/Amplify/S3)
5. 🔗 Actualizar URL del backend en frontend

## Soporte

- [Documentación AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/)
- [Guía completa de deployment](../DEPLOYMENT_AWS.md)
