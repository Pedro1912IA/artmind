# Script para crear ZIP MÍNIMO sin .ebextensions
$source = "C:\Users\pedro\OneDrive\Escritorio\Art Mind\backend"
$destination = "C:\Users\pedro\OneDrive\Escritorio\Art Mind\backend\artmind-minimal.zip"

# Eliminar ZIP anterior si existe
if (Test-Path $destination) {
    Remove-Item $destination -Force
}

# Crear directorio temporal
$tempDir = "C:\Users\pedro\OneDrive\Escritorio\Art Mind\backend\temp-minimal"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copiar SOLO los archivos esenciales
Copy-Item "$source\dist" -Destination "$tempDir\dist" -Recurse
Copy-Item "$source\package.json" -Destination "$tempDir\"
Copy-Item "$source\Procfile" -Destination "$tempDir\"

# Cambiar al directorio temporal y crear ZIP desde ahí
Push-Location $tempDir
Compress-Archive -Path * -DestinationPath $destination -Force
Pop-Location

# Limpiar directorio temporal
Remove-Item $tempDir -Recurse -Force

Write-Host "ZIP MÍNIMO creado exitosamente en: $destination" -ForegroundColor Green
Write-Host "Contenido: dist/, package.json, Procfile" -ForegroundColor Cyan
