#!/bin/bash
set -e

NGROK_EXEC="./ngrok"
NGROK_ZIP="ngrok-v3-stable-linux-amd64.zip"
PYTHON_SCRIPT="lang_chain.py"

echo "--- Python: Iniciar Servicio ---"
if [ -f "$PYTHON_SCRIPT" ]; then
    echo "Iniciando '$PYTHON_SCRIPT' en segundo plano (background)..."
    # Ejecuta el script de Python en background.
    # El & al final lo pone en background.
    # La salida se redirige a un archivo para evitar que contamine la terminal principal.
    nohup python3 "$PYTHON_SCRIPT" > "$PYTHON_SCRIPT.log" 2>&1 &
    PYTHON_PID=$!
    echo "Proceso de Python iniciado con PID: $PYTHON_PID"
    echo "Dando 5 segundos para que el script inicie el servicio..."
    sleep 5
else
    echo "ADVERTENCIA: No se encontró el archivo '$PYTHON_SCRIPT'. Asumiendo que el servicio ya está corriendo en el puerto 11434."
fi

echo -e "\n--- ngrok ---"
if [ -f "$NGROK_EXEC" ]; then
    echo "Ejecutable 'ngrok' ya existe."
else
    echo "No se encontró '$NGROK_EXEC'. Buscando archivo zip..."
    if [ ! -f "$NGROK_ZIP" ]; then
        echo "Descargando ngrok..."
        wget https://bin.equinox.io/c/bNyj1mQVY4c/$NGROK_ZIP
    else
        echo "Archivo zip de ngrok ya existe."
    fi

    echo "Descomprimiendo ngrok..."
    unzip -o $NGROK_ZIP
fi

echo "Autenticando ngrok (se sobrescribirá si ya existe)..."
# Token de autenticación del script original
$NGROK_EXEC authtoken 34btNvrQweX7wuRROMOpK1jbpHy_qJBLUB9wrwGyGpxRyvR6

echo -e "\n--- Iniciar Túnel ---"
if pgrep -x "ngrok" > /dev/null; then
    echo "ngrok ya está corriendo en otro proceso."
    echo "La URL pública debería estar visible en la otra terminal."
    echo "Si necesitas reiniciar el túnel, detén el proceso 'ngrok' existente primero."
else
    echo "¡Listo! Exponiendo el puerto 8000. La URL pública se mostrará a continuación."
    $NGROK_EXEC http 8000
fi