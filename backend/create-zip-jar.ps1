# Script para crear ZIP usando Java JAR (compatible con Linux)
$source = "C:\Users\pedro\OneDrive\Escritorio\Art Mind\backend"
$destination = "C:\Users\pedro\OneDrive\Escritorio\Art Mind\backend\artmind-java.zip"

# Eliminar ZIP anterior si existe
if (Test-Path $destination) {
    Remove-Item $destination -Force
}

# Crear directorio temporal
$tempDir = "C:\Users\pedro\OneDrive\Escritorio\Art Mind\backend\temp-java"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copiar archivos necesarios
Copy-Item "$source\dist" -Destination "$tempDir\dist" -Recurse
Copy-Item "$source\package.json" -Destination "$tempDir\"
Copy-Item "$source\Procfile" -Destination "$tempDir\"
Copy-Item "$source\.npmrc" -Destination "$tempDir\" -ErrorAction SilentlyContinue
Copy-Item "$source\.ebextensions" -Destination "$tempDir\.ebextensions" -Recurse -ErrorAction SilentlyContinue

# Usar jar (viene con Java) para crear ZIP compatible con Linux
Push-Location $tempDir
$jarPath = (Get-Command jar -ErrorAction SilentlyContinue).Source
if ($jarPath) {
    jar -cfM $destination *
    Write-Host "ZIP creado con JAR exitosamente" -ForegroundColor Green
} else {
    # Fallback: usar Python si está disponible
    $pythonPath = (Get-Command python -ErrorAction SilentlyContinue).Source
    if ($pythonPath) {
        python -c "import zipfile, os; z = zipfile.ZipFile('$destination', 'w', zipfile.ZIP_DEFLATED); [z.write(os.path.join(r,f), os.path.join(r,f).replace('$tempDir\\', '')) for r,d,files in os.walk('.') for f in files]; z.close()"
        Write-Host "ZIP creado con Python exitosamente" -ForegroundColor Green
    } else {
        Write-Host "ERROR: No se encontró ni JAR ni Python. Instala Java o Python." -ForegroundColor Red
        Pop-Location
        Remove-Item $tempDir -Recurse -Force
        exit 1
    }
}
Pop-Location

# Limpiar directorio temporal
Remove-Item $tempDir -Recurse -Force

Write-Host "ZIP creado en: $destination" -ForegroundColor Cyan
