#!/bin/bash

# =============================
# 🚀 Script para ejecutar todo el proyecto
# =============================

echo -e "${YELLOW}Iniciando proyecto completo...${RESET}"

# =============================
# 🦕 1️⃣ Ejecutar Backend
# =============================
echo -e "${GREEN}Levantando backend en puerto 8003...${RESET}"
uvicorn app.main:app --reload --host 127.0.0.1 --port 8003 &
BACKEND_PID=$!

# =============================
# 💬 2️⃣ Ejecutar Servicio LangChain
# =============================
echo -e "${GREEN}Levantando servicio LangChain...${RESET}"
cd app/services/ || exit
python3 lang_chain.py &
LANGCHAIN_PID=$!
cd ../../

# =============================
# 💻 3️⃣ Ejecutar Frontend
# =============================
echo -e "${GREEN}Levantando frontend (Vite)...${RESET}"
cd mi-app/ || exit
npm run dev -- --host 0.0.0.0 &
FRONT_PID=$!
cd ..

# =============================
# 🧩 Esperar y manejar cierre
# =============================
echo -e "${YELLOW}Todo iniciado correctamente.${RESET}"
echo -e "Backend PID: $BACKEND_PID"
echo -e "LangChain PID: $LANGCHAIN_PID"
echo -e "Frontend PID: $FRONT_PID"
echo -e "${YELLOW}Presiona Ctrl+C para detener todos los servicios.${RESET}"

# Capturar Ctrl+C para cerrar todo limpio
trap "echo -e '\n🛑 Deteniendo servicios...'; kill $BACKEND_PID $LANGCHAIN_PID $FRONT_PID; exit 0" SIGINT

# Mantener script en ejecución para no cerrar los procesos
wait
