# app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.model_loader import get_model
from app.name_generator import generate_name
from app.services.text_gen import generate_description_sync

import os
import base64
import requests

# ---------- Config ----------
NGROK_TEXT_URL = os.getenv(
    "TEXT_API_URL",
    "https://charity-constructible-unredeemably.ngrok-free.dev/api/chat"
)
IMG_URL = os.getenv(
    "IMG_API_URL",
    "https://c5a76c95644b.ngrok-free.app/generate-image/"
)

REQUEST_TIMEOUT = float(os.getenv("REQUEST_TIMEOUT", "120"))

# ---------- FastAPI ----------
app = FastAPI(title="Dino Generator API")

# CORS para permitir llamadas desde el front en Vite (http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Modelos ----------
class DinoResponse(BaseModel):
    name: str
    description: str
    image_b64: str  # devolvemos data URI base64 para mostrar directo en el <img/>

# ---------- Carga de modelo (nombres) ----------
model, char_to_idx, idx_to_char = get_model()

# ---------- Rutas ----------
@app.get("/")
def health():
    return {"ok": True}

@app.get("/generate_dino", response_model=DinoResponse)
def generate_dino():
    # 1) Nombre
    name = generate_name(model, char_to_idx, idx_to_char)

    # 2) Descripción (Ollama vía tu endpoint ngrok/bridge)
    try:
        description = generate_description_sync(NGROK_TEXT_URL, name)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Text generation failed: {e}")

    # 3) Imagen (modelo de difusión)
    prompt = f"Scientific illustration of a dinosaur named {name}. {description}"
    img_headers = {
        "accept": "image/png",
        "content-type": "application/json",
    }
    img_payload = {
        "prompt": prompt,
        "seed": 123,
    }

    try:
        ires = requests.post(
            IMG_URL,
            json=img_payload,
            headers=img_headers,
            timeout=REQUEST_TIMEOUT
        )
        ires.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Image generation failed: {e}")

    # Convertimos a data URI para usarlo directo en el <img src="...">
    img_b64 = base64.b64encode(ires.content).decode("ascii")
    data_uri = f"data:image/png;base64,{img_b64}"

    return DinoResponse(
        name=name,
        description=description,
        image_b64=data_uri
    )
