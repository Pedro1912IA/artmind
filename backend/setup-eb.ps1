# Script de configuración inicial para AWS Elastic Beanstalk
# Uso: .\setup-eb.ps1

Write-Host "🔧 Configuración inicial de AWS Elastic Beanstalk" -ForegroundColor Cyan

# Verificar AWS CLI
try {
    $awsVersion = aws --version
    Write-Host "✅ AWS CLI encontrado: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI no está instalado. Descárgalo desde: https://aws.amazon.com/cli/" -ForegroundColor Red
    exit 1
}

# Verificar EB CLI
try {
    $ebVersion = eb --version
    Write-Host "✅ EB CLI encontrado: $ebVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  EB CLI no está instalado. Instalando..." -ForegroundColor Yellow
    pip install awsebcli --upgrade --user
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al instalar EB CLI" -ForegroundColor Red
        exit 1
    }
}

# Verificar credenciales AWS
Write-Host "`n🔐 Verificando credenciales AWS..." -ForegroundColor Yellow
try {
    aws sts get-caller-identity | Out-Null
    Write-Host "✅ Credenciales AWS configuradas correctamente" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Credenciales AWS no configuradas. Ejecuta: aws configure" -ForegroundColor Yellow
    Write-Host "Necesitarás:" -ForegroundColor Cyan
    Write-Host "  - AWS Access Key ID" -ForegroundColor White
    Write-Host "  - AWS Secret Access Key" -ForegroundColor White
    Write-Host "  - Default region (ej: us-east-1)" -ForegroundColor White
    
    $configure = Read-Host "`n¿Deseas configurar ahora? (s/n)"
    if ($configure -eq "s") {
        aws configure
    } else {
        Write-Host "❌ Configuración cancelada. Ejecuta 'aws configure' manualmente." -ForegroundColor Red
        exit 1
    }
}

# Compilar el proyecto
Write-Host "`n📦 Compilando proyecto..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al compilar" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Compilación exitosa" -ForegroundColor Green

# Inicializar EB
Write-Host "`n🚀 Inicializando Elastic Beanstalk..." -ForegroundColor Yellow
Write-Host "Responde las siguientes preguntas:" -ForegroundColor Cyan
Write-Host "  1. Region: Elige tu región preferida (ej: us-east-1)" -ForegroundColor White
Write-Host "  2. Application name: art-mind-backend (o el que prefieras)" -ForegroundColor White
Write-Host "  3. Platform: Node.js" -ForegroundColor White
Write-Host "  4. Platform branch: Node.js 18 o superior" -ForegroundColor White
Write-Host "  5. CodeCommit: n (No)" -ForegroundColor White
Write-Host "  6. SSH: y (Sí, recomendado)" -ForegroundColor White

Read-Host "`nPresiona Enter para continuar"

eb init

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al inicializar EB" -ForegroundColor Red
    exit 1
}

# Crear ambiente
Write-Host "`n🌍 Creando ambiente de Elastic Beanstalk..." -ForegroundColor Yellow
Write-Host "Esto tomará varios minutos (5-10 min)..." -ForegroundColor Cyan

$envName = Read-Host "`nNombre del ambiente (ej: art-mind-env)"
$instanceType = Read-Host "Tipo de instancia (t3.micro para free tier, t3.small recomendado)"

if ([string]::IsNullOrWhiteSpace($instanceType)) {
    $instanceType = "t3.small"
}

Write-Host "`n⚠️  IMPORTANTE: Necesitarás configurar GEMINI_API_KEY después de crear el ambiente" -ForegroundColor Yellow

eb create $envName --instance-type $instanceType --envvars PORT=8080

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al crear ambiente" -ForegroundColor Red
    exit 1
}

# Solicitar API Key
Write-Host "`n🔑 Configurando variables de entorno..." -ForegroundColor Yellow
$apiKey = Read-Host "Ingresa tu GEMINI_API_KEY (o presiona Enter para configurar después)"

if (-not [string]::IsNullOrWhiteSpace($apiKey)) {
    eb setenv GEMINI_API_KEY=$apiKey NODE_ENV=production
    Write-Host "✅ Variables de entorno configuradas" -ForegroundColor Green
} else {
    Write-Host "⚠️  Recuerda configurar GEMINI_API_KEY con: eb setenv GEMINI_API_KEY=tu_key" -ForegroundColor Yellow
}

Write-Host "`n✅ ¡Configuración completada!" -ForegroundColor Green
Write-Host "`n📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Ver estado: eb status" -ForegroundColor White
Write-Host "  2. Ver logs: eb logs --stream" -ForegroundColor White
Write-Host "  3. Abrir app: eb open" -ForegroundColor White
Write-Host "  4. Desplegar cambios: .\deploy.ps1" -ForegroundColor White

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host "`n⚠️  NO OLVIDES configurar GEMINI_API_KEY:" -ForegroundColor Yellow
    Write-Host "  eb setenv GEMINI_API_KEY=tu_key_aqui" -ForegroundColor White
}
