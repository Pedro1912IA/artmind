#!/usr/bin/env python3
import zipfile
import os
import shutil

# Rutas
source_dir = r"C:\Users\pedro\OneDrive\Escritorio\Art Mind\backend"
temp_dir = r"C:\Users\pedro\OneDrive\Escritorio\Art Mind\backend\temp-python"
zip_path = r"C:\Users\pedro\OneDrive\Escritorio\Art Mind\backend\artmind-python.zip"

# Limpiar
if os.path.exists(zip_path):
    os.remove(zip_path)
if os.path.exists(temp_dir):
    shutil.rmtree(temp_dir)

# Crear directorio temporal
os.makedirs(temp_dir)

# Copiar archivos
print("Copiando archivos...")
shutil.copytree(os.path.join(source_dir, "dist"), os.path.join(temp_dir, "dist"))
shutil.copy2(os.path.join(source_dir, "package.json"), temp_dir)
shutil.copy2(os.path.join(source_dir, "Procfile"), temp_dir)

# Copiar .npmrc si existe
npmrc_path = os.path.join(source_dir, ".npmrc")
if os.path.exists(npmrc_path):
    shutil.copy2(npmrc_path, temp_dir)

# Copiar .ebextensions si existe
ebext_path = os.path.join(source_dir, ".ebextensions")
if os.path.exists(ebext_path):
    shutil.copytree(ebext_path, os.path.join(temp_dir, ".ebextensions"))

# Crear ZIP con forward slashes
print("Creando ZIP...")
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(temp_dir):
        for file in files:
            file_path = os.path.join(root, file)
            # Usar forward slashes y rutas relativas
            arcname = os.path.relpath(file_path, temp_dir).replace('\\', '/')
            zipf.write(file_path, arcname)
            print(f"  Agregado: {arcname}")

# Limpiar directorio temporal
shutil.rmtree(temp_dir)

print(f"\n✅ ZIP creado exitosamente: {zip_path}")
print(f"Tamaño: {os.path.getsize(zip_path)} bytes")
