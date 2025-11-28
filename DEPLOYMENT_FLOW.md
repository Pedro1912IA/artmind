# 🔄 Art Mind - Flujo de Deployment

## Diagrama de Flujo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                    INICIO DEL DEPLOYMENT                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              ¿Tienes AWS CLI y EB CLI instalados?               │
└─────────────────────────────────────────────────────────────────┘
                    │                        │
                   NO                       SÍ
                    │                        │
                    ▼                        ▼
        ┌──────────────────────┐   ┌──────────────────────┐
        │ Instalar AWS CLI     │   │ Verificar versiones  │
        │ Instalar EB CLI      │   │ aws --version        │
        │ pip install awsebcli │   │ eb --version         │
        └──────────────────────┘   └──────────────────────┘
                    │                        │
                    └────────────┬───────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              ¿Tienes credenciales AWS configuradas?             │
└─────────────────────────────────────────────────────────────────┘
                    │                        │
                   NO                       SÍ
                    │                        │
                    ▼                        ▼
        ┌──────────────────────┐   ┌──────────────────────┐
        │ aws configure        │   │ aws sts              │
        │ Ingresar:            │   │ get-caller-identity  │
        │ - Access Key ID      │   │ (verificar)          │
        │ - Secret Access Key  │   └──────────────────────┘
        │ - Region             │                │
        └──────────────────────┘                │
                    │                            │
                    └────────────┬───────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ¿Usar script automatizado?                   │
└─────────────────────────────────────────────────────────────────┘
                    │                        │
                   SÍ                       NO
                    │                        │
                    ▼                        ▼
    ┌──────────────────────────┐   ┌──────────────────────┐
    │ cd backend               │   │ FLUJO MANUAL         │
    │ .\setup-eb.ps1           │   │ (ver abajo)          │
    │                          │   └──────────────────────┘
    │ Script hace:             │                │
    │ 1. Verifica tools        │                │
    │ 2. Compila TS            │                │
    │ 3. eb init               │                │
    │ 4. eb create             │                │
    │ 5. eb setenv             │                │
    └──────────────────────────┘                │
                    │                            │
                    └────────────┬───────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND DESPLEGADO ✅                         │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Verificar deployment del backend               │
│                  - eb status                                    │
│                  - eb open                                      │
│                  - eb logs --stream                             │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ¿Backend funcionando?                        │
└─────────────────────────────────────────────────────────────────┘
                    │                        │
                   NO                       SÍ
                    │                        │
                    ▼                        ▼
        ┌──────────────────────┐   ┌──────────────────────┐
        │ Troubleshooting:     │   │ Obtener URL:         │
        │ - eb logs --stream   │   │ eb status            │
        │ - Verificar .env     │   │                      │
        │ - Verificar dist/    │   │ Guardar URL para     │
        │ - Recompilar         │   │ configurar frontend  │
        └──────────────────────┘   └──────────────────────┘
                    │                        │
                    └────────────┬───────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              DEPLOYMENT DEL FRONTEND                            │
│              ¿Qué plataforma usar?                              │
└─────────────────────────────────────────────────────────────────┘
         │                  │                  │
      VERCEL          AWS AMPLIFY          S3 + CF
         │                  │                  │
         ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ cd frontend  │  │ cd frontend  │  │ cd frontend  │
│ vercel login │  │ amplify init │  │ npm run build│
│ vercel --prod│  │ amplify add  │  │ aws s3 sync  │
│              │  │   hosting    │  │   out/ s3:// │
│ Configurar:  │  │ amplify      │  │              │
│ NEXT_PUBLIC_ │  │   publish    │  │ CloudFront   │
│ API_URL      │  │              │  │ distribution │
└──────────────┘  └──────────────┘  └──────────────┘
         │                  │                  │
         └──────────────────┼──────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FRONTEND DESPLEGADO ✅                          │
└─────────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              Configurar CORS en Backend                         │
│              - Agregar URL del frontend                         │
│              - Recompilar backend                               │
│              - eb deploy                                        │
└─────────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Testing de Integración                         │
│                  - Abrir frontend                               │
│                  - Probar upload de imágenes                    │
│                  - Verificar análisis                           │
│                  - Verificar variaciones                        │
└─────────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ¿Todo funciona?                              │
└─────────────────────────────────────────────────────────────────┘
                    │                        │
                   NO                       SÍ
                    │                        │
                    ▼                        ▼
        ┌──────────────────────┐   ┌──────────────────────┐
        │ Troubleshooting:     │   │ ¡DEPLOYMENT          │
        │ - Verificar CORS     │   │  COMPLETO! 🎉        │
        │ - Verificar URL      │   │                      │
        │ - Ver logs           │   │ Opcional:            │
        │ - Network tab        │   │ - Configurar S3      │
        └──────────────────────┘   │ - Configurar HTTPS   │
                    │               │ - Dominio custom     │
                    │               └──────────────────────┘
                    │                        │
                    └────────────┬───────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CONFIGURACIÓN ADICIONAL                      │
│                    (Opcional pero recomendado)                  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
        ┌──────────────┐ ┌──────────┐ ┌──────────────┐
        │ S3 Setup     │ │ HTTPS    │ │ Dominio      │
        │ - Bucket     │ │ - Cert   │ │ - Route 53   │
        │ - IAM        │ │ - LB     │ │ - DNS        │
        │ - SDK        │ │ - SSL    │ │ - Config     │
        └──────────────┘ └──────────┘ └──────────────┘
                    │            │            │
                    └────────────┼────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT COMPLETO                          │
│                    ✅ Backend en AWS EB                          │
│                    ✅ Frontend en Vercel/Amplify                 │
│                    ✅ CORS configurado                           │
│                    ✅ Variables de entorno                       │
│                    ✅ S3 para uploads (opcional)                 │
│                    ✅ HTTPS (opcional)                           │
│                    ✅ Dominio (opcional)                         │
└─────────────────────────────────────────────────────────────────┘
```

## Flujo Manual Detallado

```
FLUJO MANUAL DE DEPLOYMENT
│
├─ 1. Preparar Backend
│   ├─ cd backend
│   ├─ npm install
│   └─ npm run build
│
├─ 2. Inicializar EB
│   ├─ eb init
│   ├─ Seleccionar región
│   ├─ Nombre de app
│   ├─ Platform: Node.js
│   └─ SSH: Yes
│
├─ 3. Crear Ambiente
│   ├─ eb create art-mind-env
│   ├─ Instance type: t3.small
│   └─ Esperar 5-10 min
│
├─ 4. Configurar Variables
│   ├─ eb setenv GEMINI_API_KEY=xxx
│   └─ eb setenv NODE_ENV=production
│
├─ 5. Verificar
│   ├─ eb status
│   ├─ eb open
│   └─ eb logs --stream
│
└─ 6. Continuar con frontend...
```

## Flujo de Despliegues Futuros

```
CAMBIOS EN EL CÓDIGO
│
├─ Backend
│   ├─ Hacer cambios en src/
│   ├─ npm run build
│   ├─ eb deploy (o .\deploy.ps1)
│   └─ Verificar: eb logs --stream
│
└─ Frontend
    ├─ Hacer cambios en src/
    ├─ git push (si usas Vercel con Git)
    │   └─ Deploy automático
    │
    └─ O manual: vercel --prod
```

## Flujo de Troubleshooting

```
PROBLEMA DETECTADO
│
├─ Backend no responde
│   ├─ eb logs --stream
│   ├─ Verificar:
│   │   ├─ dist/ existe
│   │   ├─ Variables de entorno
│   │   └─ Puerto correcto
│   ├─ Recompilar: npm run build
│   └─ Redeploy: eb deploy
│
├─ Error de CORS
│   ├─ Verificar server.ts
│   ├─ Agregar URL del frontend
│   ├─ npm run build
│   └─ eb deploy
│
├─ Uploads no persisten
│   ├─ Configurar S3
│   ├─ Ver: backend/S3_SETUP.md
│   └─ Implementar servicio S3
│
└─ Frontend no conecta
    ├─ Verificar .env.local
    ├─ Verificar NEXT_PUBLIC_API_URL
    ├─ Verificar CORS en backend
    └─ Rebuild frontend
```

## Flujo de Configuración de S3

```
CONFIGURAR S3 PARA UPLOADS
│
├─ 1. Crear Bucket
│   └─ aws s3 mb s3://art-mind-uploads
│
├─ 2. Configurar IAM
│   ├─ Crear política
│   └─ Adjuntar a rol de EB
│
├─ 3. Instalar SDK
│   └─ npm install @aws-sdk/client-s3
│
├─ 4. Crear Servicio
│   └─ backend/src/services/s3Service.ts
│
├─ 5. Actualizar Multer
│   └─ memoryStorage() en server.ts
│
├─ 6. Actualizar Rutas
│   └─ Usar S3Service.uploadFile()
│
├─ 7. Configurar Variables
│   └─ eb setenv S3_BUCKET_NAME=xxx
│
└─ 8. Desplegar
    ├─ npm run build
    └─ eb deploy
```

## Flujo de Monitoreo

```
MONITOREO CONTINUO
│
├─ Logs en Tiempo Real
│   └─ eb logs --stream
│
├─ Estado del Ambiente
│   ├─ eb status
│   └─ eb health
│
├─ Consola AWS
│   ├─ eb console
│   └─ CloudWatch Metrics
│
└─ Alertas
    ├─ Configurar CloudWatch Alarms
    ├─ CPU > 80%
    ├─ Error rate > 5%
    └─ Notificaciones por email
```

## Decisiones Clave

### 1. ¿Script Automatizado o Manual?

```
┌─────────────────────────────────────┐
│ ¿Eres principiante?                 │
│ ¿Quieres rapidez?                   │
│ ¿Confías en los defaults?           │
└─────────────────────────────────────┘
         │              │
        SÍ             NO
         │              │
         ▼              ▼
  ┌──────────┐   ┌──────────┐
  │ SCRIPT   │   │ MANUAL   │
  │ setup-eb │   │ eb init  │
  │   .ps1   │   │ eb create│
  └──────────┘   └──────────┘
```

### 2. ¿Qué plataforma para Frontend?

```
┌─────────────────────────────────────┐
│ ¿Usas Next.js?                      │
│ ¿Quieres simplicidad?               │
│ ¿Gratis es suficiente?              │
└─────────────────────────────────────┘
         │              │
        SÍ             NO
         │              │
         ▼              ▼
  ┌──────────┐   ┌──────────────┐
  │ VERCEL   │   │ ¿Todo en AWS?│
  │ (Gratis) │   └──────────────┘
  └──────────┘          │
                       SÍ
                        │
                        ▼
                 ┌──────────┐
                 │ AMPLIFY  │
                 │ o S3+CF  │
                 └──────────┘
```

### 3. ¿Configurar S3?

```
┌─────────────────────────────────────┐
│ ¿Necesitas persistencia?            │
│ ¿Uploads importantes?                │
│ ¿Múltiples instancias?              │
└─────────────────────────────────────┘
         │              │
        SÍ             NO
         │              │
         ▼              ▼
  ┌──────────┐   ┌──────────┐
  │ USAR S3  │   │ LOCAL    │
  │ (Reco-   │   │ (Efímero)│
  │ mendado) │   └──────────┘
  └──────────┘
```

## Timeline Estimado

### Deployment Rápido (Script Automatizado)
```
0:00 - Leer QUICK_START.md (5 min)
0:05 - Ejecutar setup-eb.ps1 (10 min)
0:15 - Verificar backend (2 min)
0:17 - Desplegar frontend Vercel (5 min)
0:22 - Configurar CORS (3 min)
0:25 - Testing (5 min)
─────────────────────────────────────
Total: 30 minutos
```

### Deployment Manual Completo
```
0:00 - Leer documentación (30 min)
0:30 - Instalar herramientas (10 min)
0:40 - Configurar AWS (5 min)
0:45 - Compilar backend (2 min)
0:47 - eb init (5 min)
0:52 - eb create (10 min)
1:02 - Configurar variables (3 min)
1:05 - Verificar backend (5 min)
1:10 - Desplegar frontend (10 min)
1:20 - Configurar CORS (5 min)
1:25 - Testing (10 min)
1:35 - Configurar S3 (30 min)
2:05 - Testing final (10 min)
─────────────────────────────────────
Total: 2 horas 15 minutos
```

### Deployment Producción Completo
```
Día 1: Setup básico (2 horas)
Día 2: Configurar S3 (1 hora)
Día 3: Configurar HTTPS (1 hora)
Día 4: Configurar dominio (1 hora)
Día 5: Auto Scaling (2 horas)
Día 6: Monitoreo y alertas (2 horas)
Día 7: Testing y optimización (2 horas)
─────────────────────────────────────
Total: 11 horas (1 semana)
```

## Checklist Visual

```
DEPLOYMENT CHECKLIST
│
├─ ☐ Pre-requisitos
│   ├─ ☐ Cuenta AWS
│   ├─ ☐ AWS CLI instalado
│   ├─ ☐ EB CLI instalado
│   ├─ ☐ Credenciales configuradas
│   └─ ☐ GEMINI_API_KEY lista
│
├─ ☐ Backend
│   ├─ ☐ Código compilado
│   ├─ ☐ EB inicializado
│   ├─ ☐ Ambiente creado
│   ├─ ☐ Variables configuradas
│   └─ ☐ Backend funcionando
│
├─ ☐ Frontend
│   ├─ ☐ Plataforma elegida
│   ├─ ☐ URL del backend configurada
│   ├─ ☐ Frontend desplegado
│   └─ ☐ Frontend funcionando
│
├─ ☐ Integración
│   ├─ ☐ CORS configurado
│   ├─ ☐ Frontend conecta a backend
│   └─ ☐ Testing completo
│
└─ ☐ Opcional
    ├─ ☐ S3 configurado
    ├─ ☐ HTTPS configurado
    └─ ☐ Dominio configurado
```

## Próximos Pasos

Después de completar el deployment básico:

```
MEJORAS CONTINUAS
│
├─ Corto Plazo (1 semana)
│   ├─ Configurar S3
│   ├─ Configurar HTTPS
│   └─ Monitoreo básico
│
├─ Mediano Plazo (1 mes)
│   ├─ Dominio personalizado
│   ├─ Auto Scaling
│   └─ CloudWatch alarms
│
└─ Largo Plazo (3 meses)
    ├─ Autenticación
    ├─ Base de datos
    └─ Multi-region
```

---

**Art Mind** - Creative Art Intelligence Platform
