import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

app = FastAPI(title="Chat con Dinosaurios", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

contexto_global = {
    "nombre": None,
    "descripcion": None,
    "conversation": [],
    "configurado": False
}


class DinosaurioContexto(BaseModel):
    """
    Modelo que representa el contexto de un dinosaurio.

    Atributos:
        nombre: El nombre del dinosaurio que será simulado
        descripcion: La descripción completa de la personalidad, características y conocimientos del dinosaurio
    """
    nombre: str
    descripcion: str


class MensajeUsuario(BaseModel):
    """
    Modelo que encapsula el mensaje enviado por el usuario.

    Atributos:
        mensaje: El texto del mensaje que el usuario desea enviar al dinosaurio
    """
    mensaje: str


class ConfirmacionContexto(BaseModel):
    """
    Modelo de respuesta para confirmar la actualización del contexto.

    Atributos:
        mensaje: Mensaje de confirmación indicando el éxito de la operación
    """
    mensaje: str


modelo = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.7,
    google_api_key="AIzaSyDr-xiw2KT6fV81j3kFLXsiNL3AMoaQ1js"
)

prompt_template = ChatPromptTemplate.from_messages([
    ("system",
     "You are {dino_nombre}. Your personality, knowledge, and memories are strictly limited to the following description: '{dino_descripcion}'. The actual conversation with the user is: '{conversation}'. Respond to the user by acting like this dinosaur, based solely on that information. Do not fabricate facts or knowledge outside of that description. Be direct and stay in character at all times."),
    ("user", "{mensaje_usuario}")
])

cadena = prompt_template | modelo


@app.post("/definir_contexto", response_model=ConfirmacionContexto)
async def definir_contexto(contexto: DinosaurioContexto):
    """
    Endpoint para establecer o actualizar el contexto del dinosaurio activo.

    Este endpoint actualiza el estado global de la aplicación con la información
    del dinosaurio que será simulado en las conversaciones posteriores.
    DEBE ser llamado antes de usar el endpoint /conversar.

    Args:
        contexto: Objeto DinosaurioContexto con el nombre y descripción del dinosaurio

    Returns:
        ConfirmacionContexto: Mensaje confirmando la actualización del contexto
    """
    contexto_global["nombre"] = contexto.nombre
    contexto_global["descripcion"] = contexto.descripcion
    contexto_global["conversation"] = []
    contexto_global["configurado"] = True
    return ConfirmacionContexto(mensaje=f"Contexto actualizado a {contexto.nombre}")


@app.post("/conversar")
async def conversar(mensaje: MensajeUsuario):
    """
    Endpoint para mantener una conversación con el dinosaurio configurado.

    Este endpoint utiliza el contexto global del dinosaurio activo y procesa
    el mensaje del usuario mediante LangChain con streaming, enviando los tokens
    de respuesta al cliente a medida que se generan para minimizar la latencia percibida.

    IMPORTANTE: Debe llamarse /definir_contexto primero para configurar el dinosaurio.

    Args:
        mensaje: Objeto MensajeUsuario con el texto enviado por el usuario

    Returns:
        StreamingResponse: Respuesta en streaming con los tokens generados en tiempo real

    Raises:
        HTTPException: Si no se ha configurado un contexto de dinosaurio previamente
    """
    if not contexto_global["configurado"]:
        raise HTTPException(
            status_code=400,
            detail="Debes definir el contexto del dinosaurio primero usando POST /definir_contexto"
        )

    async def generar_respuesta():
        async for chunk in cadena.astream({
            "dino_nombre": contexto_global["nombre"],
            "dino_descripcion": contexto_global["descripcion"],
            "conversation": "\n".join(contexto_global["conversation"]),
            "mensaje_usuario": mensaje.mensaje
        }):
            if hasattr(chunk, 'content'):
                yield chunk.content

    return StreamingResponse(
        generar_respuesta(),
        media_type="text/plain"
    )


@app.get("/")
async def root():
    """
    Endpoint raíz que proporciona información básica del servicio.

    Returns:
        dict: Información sobre el servicio y el estado de configuración actual
    """
    return {
        "servicio": "Chat con Dinosaurios",
        "version": "1.0.0",
        "configurado": contexto_global["configurado"],
        "dinosaurio_actual": contexto_global["nombre"] if contexto_global["configurado"] else "Sin configurar"
    }


if __name__ == "__main__":
    """
    Esta sección permite que la aplicación se inicie directamente
    ejecutando el script de Python (ej: `python main.py`).
    """
    api_key = "AIzaSyDr-xiw2KT6fV81j3kFLXsiNL3AMoaQ1js"
    if not api_key:
        print("Error: La variable de entorno GOOGLE_API_KEY no está configurada.")
        print("Por favor, crea un archivo .env y añade tu API key.")
    else:
        print(f"Iniciando servidor FastAPI en http://127.0.0.1:8000")
        print("Estado inicial: Sin dinosaurio configurado")
        print("Usa POST /definir_contexto para configurar un dinosaurio antes de conversar")
        uvicorn.run(app, host="0.0.0.0", port=8001)
