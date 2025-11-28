# 📋 Checklist de Deployment - Art Mind

## Pre-requisitos

- [ ] Cuenta de AWS activa
- [ ] Tarjeta de crédito registrada en AWS
- [ ] Node.js 18+ instalado
- [ ] Git instalado

## Instalación de Herramientas

- [ ] AWS CLI instalado y configurado
  ```powershell
  aws --version
  aws configure
  ```
- [ ] EB CLI instalado
  ```powershell
  pip install awsebcli --upgrade --user
  eb --version
  ```

## Configuración AWS

- [ ] Credenciales AWS configuradas (Access Key ID y Secret Access Key)
- [ ] Región seleccionada (ej: us-east-1)
- [ ] Verificar acceso: `aws sts get-caller-identity`

## Preparación del Backend

- [ ] Navegar a directorio backend
  ```powershell
  cd "c:\Users\pedro\OneDrive\Escritorio\Art Mind\backend"
  ```
- [ ] Instalar dependencias
  ```powershell
  npm install
  ```
- [ ] Compilar TypeScript
  ```powershell
  npm run build
  ```
- [ ] Verificar que existe `dist/server.js`

## Setup de Elastic Beanstalk

### Opción A: Script Automatizado (Recomendado)
- [ ] Ejecutar script de setup
  ```powershell
  .\setup-eb.ps1
  ```
- [ ] Seguir las instrucciones del script

### Opción B: Manual
- [ ] Inicializar EB
  ```powershell
  eb init
  ```
  - Region: us-east-1 (o tu preferencia)
  - Application name: art-mind-backend
  - Platform: Node.js
  - Platform branch: Node.js 18 o superior
  - CodeCommit: No
  - SSH: Sí

- [ ] Crear ambiente
  ```powershell
  eb create art-mind-env --instance-type t3.small
  ```
  (Esto toma 5-10 minutos)

## Configuración de Variables de Entorno

- [ ] Configurar GEMINI_API_KEY
  ```powershell
  eb setenv GEMINI_API_KEY=tu_api_key_aqui
  ```
- [ ] Configurar NODE_ENV
  ```powershell
  eb setenv NODE_ENV=production
  ```
- [ ] Verificar variables
  ```powershell
  eb printenv
  ```

## Verificación del Deployment

- [ ] Ver estado del ambiente
  ```powershell
  eb status
  ```
- [ ] Verificar que el estado sea "Ready" y Health sea "Green"
- [ ] Abrir aplicación en navegador
  ```powershell
  eb open
  ```
- [ ] Probar endpoint de API
  ```powershell
  curl https://tu-url.elasticbeanstalk.com/api
  ```

## Monitoreo

- [ ] Ver logs en tiempo real
  ```powershell
  eb logs --stream
  ```
- [ ] Verificar que no hay errores
- [ ] Abrir consola de AWS
  ```powershell
  eb console
  ```

## Configuración del Frontend

- [ ] Obtener URL del backend
  ```powershell
  eb status | Select-String "CNAME"
  ```
- [ ] Actualizar URL en frontend
  - Archivo: `frontend/src/app/page.tsx` (o donde hagas las llamadas API)
  - Cambiar: `http://localhost:3001` → `https://tu-url.elasticbeanstalk.com`

## Configuración Adicional (Opcional pero Recomendado)

### S3 para Uploads Persistentes
- [ ] Crear bucket S3
  ```powershell
  aws s3 mb s3://art-mind-uploads
  ```
- [ ] Configurar permisos IAM
- [ ] Instalar AWS SDK
  ```powershell
  npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
  ```
- [ ] Implementar servicio S3 (ver `S3_SETUP.md`)
- [ ] Configurar variables de entorno
  ```powershell
  eb setenv S3_BUCKET_NAME=art-mind-uploads
  ```

### HTTPS con Certificado SSL
- [ ] Solicitar certificado en AWS Certificate Manager
- [ ] Configurar Load Balancer para HTTPS
- [ ] Actualizar security groups

### Dominio Personalizado
- [ ] Registrar dominio (Route 53 o externo)
- [ ] Configurar DNS
- [ ] Actualizar CORS en backend

## Testing en Producción

- [ ] Probar endpoint de análisis de arte
  ```powershell
  curl -X POST -F "image=@test.jpg" https://tu-url.elasticbeanstalk.com/api/analyze-art
  ```
- [ ] Probar endpoint de fingerprint
- [ ] Probar generación de variaciones
- [ ] Verificar que las imágenes se guardan correctamente

## Despliegues Futuros

Cada vez que hagas cambios:

- [ ] Compilar TypeScript
  ```powershell
  npm run build
  ```
- [ ] Desplegar
  ```powershell
  eb deploy
  ```
  O usar script:
  ```powershell
  .\deploy.ps1
  ```

## Monitoreo Continuo

- [ ] Configurar CloudWatch alarms
- [ ] Configurar notificaciones por email
- [ ] Revisar logs regularmente
- [ ] Monitorear costos en AWS Billing

## Troubleshooting

Si algo falla:

1. [ ] Ver logs detallados
   ```powershell
   eb logs --stream
   ```

2. [ ] Verificar estado
   ```powershell
   eb status
   eb health
   ```

3. [ ] SSH al servidor (si configuraste SSH)
   ```powershell
   eb ssh
   ```

4. [ ] Verificar variables de entorno
   ```powershell
   eb printenv
   ```

5. [ ] Revisar configuración
   ```powershell
   cat .elasticbeanstalk/config.yml
   ```

## Costos Estimados

- [ ] Revisar costos en AWS Billing Dashboard
- [ ] Configurar budget alerts
- [ ] Estimar:
  - EC2 instance (t3.small): ~$15/mes
  - Load Balancer (si se usa): ~$16/mes
  - S3 storage: ~$0.023/GB/mes
  - Data transfer: Primeros 100GB gratis

## Limpieza (Si quieres eliminar todo)

- [ ] Terminar ambiente
  ```powershell
  eb terminate art-mind-env
  ```
  ⚠️ **CUIDADO**: Esto elimina todo permanentemente

- [ ] Eliminar aplicación
  ```powershell
  eb terminate --all
  ```

- [ ] Eliminar bucket S3 (si lo creaste)
  ```powershell
  aws s3 rb s3://art-mind-uploads --force
  ```

## Recursos Útiles

- [ ] Documentación guardada en:
  - `DEPLOYMENT_AWS.md` - Guía completa
  - `backend/README_DEPLOYMENT.md` - Guía rápida
  - `backend/S3_SETUP.md` - Configuración de S3

- [ ] Scripts disponibles:
  - `backend/setup-eb.ps1` - Setup inicial
  - `backend/deploy.ps1` - Deployment rápido

- [ ] Enlaces útiles:
  - [AWS Elastic Beanstalk Docs](https://docs.aws.amazon.com/elasticbeanstalk/)
  - [EB CLI Docs](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html)
  - [AWS Free Tier](https://aws.amazon.com/free/)

## Estado Final

- [ ] Backend desplegado y funcionando ✅
- [ ] Variables de entorno configuradas ✅
- [ ] Logs sin errores ✅
- [ ] API respondiendo correctamente ✅
- [ ] Frontend actualizado con nueva URL ✅
- [ ] S3 configurado (opcional) ✅
- [ ] HTTPS configurado (opcional) ✅
- [ ] Dominio personalizado (opcional) ✅

---

**¡Felicitaciones! 🎉** Tu aplicación Art Mind está desplegada en AWS Elastic Beanstalk.
