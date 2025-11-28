# 🏗️ Art Mind - Arquitectura de Deployment

## Arquitectura Actual (Desarrollo)

```
┌─────────────────────────────────────────────────────────┐
│                     Local Development                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐         ┌──────────────────┐     │
│  │   Frontend       │         │    Backend       │     │
│  │   Next.js        │────────▶│    Express       │     │
│  │   Port 3000      │  HTTP   │    Port 3001     │     │
│  └──────────────────┘         └──────────────────┘     │
│                                        │                │
│                                        │                │
│                                        ▼                │
│                               ┌──────────────────┐     │
│                               │  Google Gemini   │     │
│                               │     API          │     │
│                               └──────────────────┘     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Arquitectura Recomendada (Producción)

```
┌─────────────────────────────────────────────────────────────────────┐
│                          AWS Cloud                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                    Frontend (Vercel)                        │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │  Next.js App                                          │  │   │
│  │  │  - Static files served via Vercel Edge Network       │  │   │
│  │  │  - Automatic HTTPS                                    │  │   │
│  │  │  - Global CDN                                         │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              │ HTTPS                                │
│                              ▼                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │         Backend (AWS Elastic Beanstalk)                    │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │  Load Balancer (Optional)                            │  │   │
│  │  │  - HTTPS termination                                 │  │   │
│  │  │  - Health checks                                     │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  │                          │                                  │   │
│  │                          ▼                                  │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │  EC2 Instance (t3.small)                             │  │   │
│  │  │  ┌────────────────────────────────────────────────┐  │  │   │
│  │  │  │  Express.js API                                │  │  │   │
│  │  │  │  - Node.js 18+                                 │  │  │   │
│  │  │  │  - TypeScript compiled to JavaScript          │  │  │   │
│  │  │  │  - Multer for file uploads                    │  │  │   │
│  │  │  │  - CORS configured                            │  │  │   │
│  │  │  └────────────────────────────────────────────────┘  │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              │                                      │
│                              ▼                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │              Amazon S3 (Optional)                          │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │  Bucket: art-mind-uploads                            │  │   │
│  │  │  - User uploaded images                              │  │   │
│  │  │  - AI generated images                               │  │   │
│  │  │  - Persistent storage                                │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               │ API Calls
                               ▼
                    ┌──────────────────────┐
                    │   Google Gemini API  │
                    │  - Vision Analysis   │
                    │  - Image Generation  │
                    └──────────────────────┘
```

## Flujo de Datos

### 1. Análisis de Arte

```
User → Frontend → Backend → Gemini Vision API → Backend → Frontend → User
     (Upload)   (Process)   (Analyze)          (Response)  (Display)
```

**Detalle:**
1. Usuario sube imagen en frontend
2. Frontend envía POST a `/api/analyze-art`
3. Backend recibe imagen con Multer
4. Backend envía imagen a Gemini Vision API
5. Gemini analiza y retorna análisis
6. Backend retorna análisis al frontend
7. Frontend muestra resultados al usuario

### 2. Generación de Fingerprint

```
User → Frontend → Backend → Gemini Vision API → Backend → Frontend → User
     (2-10 imgs) (Process)  (Analyze batch)    (Generate) (Display)
```

**Detalle:**
1. Usuario sube 2-10 imágenes
2. Frontend envía POST a `/api/fingerprint`
3. Backend procesa cada imagen con Gemini
4. Backend genera fingerprint único
5. Backend almacena fingerprint en memoria
6. Frontend muestra fingerprint al usuario

### 3. Generación de Variaciones

```
User → Frontend → Backend → Gemini Image API → S3 → Backend → Frontend → User
     (Request)  (Generate) (Create images)    (Store) (URLs)   (Display)
```

**Detalle:**
1. Usuario solicita variaciones
2. Frontend envía POST a `/api/variations`
3. Backend genera prompts con Gemini
4. Backend solicita imágenes a Gemini Image API
5. Backend guarda imágenes en S3 (o local)
6. Backend retorna URLs de imágenes
7. Frontend muestra imágenes al usuario

## Componentes del Sistema

### Frontend (Next.js)

**Tecnologías:**
- Next.js 16
- React
- TypeScript
- TailwindCSS
- Lucide Icons

**Responsabilidades:**
- UI/UX
- Validación de inputs
- Manejo de estado
- Comunicación con backend API
- Visualización de resultados

**Deployment:**
- Vercel (recomendado)
- AWS Amplify (alternativa)
- S3 + CloudFront (alternativa)

### Backend (Express.js)

**Tecnologías:**
- Express.js
- TypeScript
- Multer (file uploads)
- CORS
- Google Gemini SDK

**Responsabilidades:**
- API REST
- Procesamiento de imágenes
- Integración con Gemini API
- Gestión de fingerprints
- Manejo de errores

**Deployment:**
- AWS Elastic Beanstalk
- EC2 instance (t3.small)
- Node.js 18+ runtime

### Storage (S3)

**Uso:**
- Almacenamiento de uploads
- Almacenamiento de imágenes generadas
- Persistencia de datos

**Configuración:**
- Bucket privado con URLs firmadas
- O bucket público con políticas
- Lifecycle policies para limpieza

### AI (Google Gemini)

**Modelos usados:**
- **Gemini 1.5 Flash**: Análisis de imágenes y texto
- **Gemini 2.5 Flash Image**: Generación de imágenes

**APIs:**
- Vision API: Análisis de arte
- Text API: Generación de prompts
- Image API: Generación de variaciones

## Seguridad

### Frontend
- ✅ HTTPS automático (Vercel)
- ✅ Environment variables
- ✅ Input validation
- ✅ File size limits

### Backend
- ✅ CORS configurado
- ✅ Environment variables
- ✅ API key protection
- ✅ File upload limits (Multer)
- ⚠️ Rate limiting (recomendado)
- ⚠️ Authentication (si es necesario)

### AWS
- ✅ IAM roles y políticas
- ✅ Security groups
- ✅ VPC (opcional)
- ⚠️ WAF (recomendado para producción)

## Escalabilidad

### Actual (Single Instance)
```
┌──────────────────┐
│   EC2 Instance   │
│   (t3.small)     │
│   - 2 vCPU       │
│   - 2 GB RAM     │
└──────────────────┘
```

**Capacidad:**
- ~100-500 requests/min
- ~10-50 usuarios concurrentes

### Escalado Horizontal (Auto Scaling)
```
┌─────────────────────────────────────┐
│      Load Balancer                  │
└─────────────────────────────────────┘
         │         │         │
         ▼         ▼         ▼
    ┌────────┐ ┌────────┐ ┌────────┐
    │  EC2   │ │  EC2   │ │  EC2   │
    │Instance│ │Instance│ │Instance│
    └────────┘ └────────┘ └────────┘
```

**Configuración:**
- Min instances: 1
- Max instances: 5
- Scale on: CPU > 70%

**Capacidad:**
- ~500-2500 requests/min
- ~50-250 usuarios concurrentes

## Monitoreo

### CloudWatch Metrics
- CPU utilization
- Network in/out
- Request count
- Response time
- Error rate

### Logs
- Application logs (CloudWatch Logs)
- Access logs
- Error logs

### Alarms
- High CPU (> 80%)
- High error rate (> 5%)
- Low health (< 2 healthy instances)

## Costos Mensuales Estimados

### Configuración Mínima (Free Tier)
```
EC2 t3.micro (Free Tier)     $0.00
Vercel (Hobby)               $0.00
S3 (5 GB)                    $0.12
Data Transfer (10 GB)        $0.00
─────────────────────────────────
Total                        $0.12/mes
```

### Configuración Recomendada
```
EC2 t3.small                 $15.00
Vercel (Hobby)               $0.00
S3 (50 GB)                   $1.15
Data Transfer (100 GB)       $0.00
CloudWatch                   $3.00
─────────────────────────────────
Total                        $19.15/mes
```

### Configuración Producción
```
EC2 t3.small (2 instances)   $30.00
Load Balancer                $16.00
Vercel (Pro)                 $20.00
S3 (200 GB)                  $4.60
Data Transfer (500 GB)       $45.00
CloudWatch                   $10.00
WAF                          $5.00
─────────────────────────────────
Total                        $130.60/mes
```

## Performance

### Latencia Esperada
- Frontend → Backend: 50-200ms
- Backend → Gemini API: 1-5s
- S3 upload: 100-500ms
- Total (análisis): 1.5-6s

### Optimizaciones
- ✅ CDN para frontend (Vercel Edge)
- ✅ Compresión de imágenes
- ⚠️ Caching de resultados (recomendado)
- ⚠️ CloudFront para S3 (recomendado)
- ⚠️ Redis para fingerprints (recomendado)

## Disaster Recovery

### Backups
- **S3**: Versionado habilitado
- **Fingerprints**: Almacenar en DynamoDB o RDS
- **Configuración**: Git repository

### Recovery Time Objective (RTO)
- Frontend: < 5 minutos (Vercel redeploy)
- Backend: < 15 minutos (EB redeploy)
- Data: < 1 hora (S3 restore)

### Recovery Point Objective (RPO)
- S3 data: 0 (versionado)
- Fingerprints: Depende del storage

## Mejoras Futuras

### Corto Plazo
- [ ] Implementar S3 para uploads
- [ ] Configurar HTTPS en backend
- [ ] Agregar rate limiting
- [ ] Implementar caching

### Mediano Plazo
- [ ] Agregar autenticación (Auth0/Cognito)
- [ ] Implementar base de datos (DynamoDB/RDS)
- [ ] Configurar Auto Scaling
- [ ] Agregar CloudFront CDN

### Largo Plazo
- [ ] Microservicios architecture
- [ ] Kubernetes deployment
- [ ] Multi-region deployment
- [ ] Machine learning pipeline

## Resumen

**Arquitectura Actual:**
- ✅ Simple y fácil de mantener
- ✅ Bajo costo
- ✅ Suficiente para MVP y pruebas
- ⚠️ Limitada escalabilidad
- ⚠️ Sin redundancia

**Arquitectura Recomendada:**
- ✅ Escalable
- ✅ Resiliente
- ✅ Monitoreable
- ✅ Segura
- ⚠️ Mayor costo
- ⚠️ Mayor complejidad

**Próximo Paso:**
Empezar con la arquitectura simple y escalar según necesidad.

---

**Art Mind** - Creative Art Intelligence Platform
