# Script de deployment para AWS Elastic Beanstalk
# Uso: .\deploy.ps1

Write-Host "🚀 Iniciando deployment de Art Mind Backend a AWS Elastic Beanstalk..." -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encuentra package.json. Asegúrate de estar en el directorio backend." -ForegroundColor Red
    exit 1
}

# Verificar que EB CLI está instalado
try {
    $ebVersion = eb --version
    Write-Host "✅ EB CLI encontrado: $ebVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: EB CLI no está instalado. Instálalo con: pip install awsebcli" -ForegroundColor Red
    exit 1
}

# Compilar TypeScript
Write-Host "`n📦 Compilando TypeScript..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al compilar TypeScript" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Compilación exitosa" -ForegroundColor Green

# Verificar que dist/ existe
if (-not (Test-Path "dist")) {
    Write-Host "❌ Error: No se encontró el directorio dist/" -ForegroundColor Red
    exit 1
}

# Desplegar a Elastic Beanstalk
Write-Host "`n🚀 Desplegando a AWS Elastic Beanstalk..." -ForegroundColor Yellow
eb deploy

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al desplegar" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Deployment completado exitosamente!" -ForegroundColor Green
Write-Host "`n📊 Ver estado: eb status" -ForegroundColor Cyan
Write-Host "📝 Ver logs: eb logs --stream" -ForegroundColor Cyan
Write-Host "🌐 Abrir app: eb open" -ForegroundColor Cyan
