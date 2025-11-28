# Script para crear ZIP compatible con Linux
$source = "C:\Users\pedro\OneDrive\Escritorio\Art Mind\backend"
$destination = "C:\Users\pedro\OneDrive\Escritorio\Art Mind\backend\artmind-deploy-linux.zip"

# Eliminar ZIP anterior si existe
if (Test-Path $destination) {
    Remove-Item $destination -Force
}

# Crear directorio temporal
$tempDir = "C:\Users\pedro\OneDrive\Escritorio\Art Mind\backend\temp-deploy"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copiar archivos necesarios
Copy-Item "$source\dist" -Destination "$tempDir\dist" -Recurse
Copy-Item "$source\package.json" -Destination "$tempDir\"
Copy-Item "$source\Procfile" -Destination "$tempDir\"
Copy-Item "$source\.npmrc" -Destination "$tempDir\"
Copy-Item "$source\.ebextensions" -Destination "$tempDir\.ebextensions" -Recurse
Copy-Item "$source\.platform" -Destination "$tempDir\.platform" -Recurse

# Cambiar al directorio temporal y crear ZIP desde ahí
Push-Location $tempDir
Compress-Archive -Path * -DestinationPath $destination -Force
Pop-Location

# Limpiar directorio temporal
Remove-Item $tempDir -Recurse -Force

Write-Host "ZIP creado exitosamente en: $destination" -ForegroundColor Green
