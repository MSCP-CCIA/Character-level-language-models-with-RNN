from fastapi import FastAPI
from app.model_loader import get_model
from app.name_generator import generate_name
from pydantic import BaseModel
import requests, base64
from app.services.text_gen import generate_description_sync
#from app.services.image_gen import stream_image_from_ngrok
class DinoResponse(BaseModel):
    name: str
    description: str
    image_url: str
app = FastAPI()
model, char_to_idx,idx_to_char = get_model()
ngrok_url='https://charity-constructible-unredeemably.ngrok-free.dev/api/chat'
IMG_URL = "https://01975b2936c4.ngrok-free.app/generate-image/"
@app.get("/generate_dino")
def generate_dino():
    name = generate_name(model, char_to_idx, idx_to_char)
    description = generate_description_sync(ngrok_url, name)
    prompt = name+description
    img_headers = {"accept": "image/png", "content-type": "application/json"}
    img_payload = {"prompt": f"Scientific illustration of a dinosaur named {name}. {description}", "seed": 123}
    ires = requests.post(IMG_URL, json=img_payload, headers=img_headers, timeout=120)
    ires.raise_for_status()
    img_b64 = base64.b64encode(ires.content).decode("ascii")
    data_uri = f"data:image/png;base64,{img_b64}"
    return {
        "name": name,
        "description": description,
        "image_b64": data_uri
    }

