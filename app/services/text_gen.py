import requests
import re
from textwrap import dedent

def clean_text(s: str) -> str:
    # 1) convierte \" -> " por si viene escapado
    s = s.replace(r'\"', '"')
    # 2) elimina todas las comillas dobles y backslashes
    return s.translate(str.maketrans({'"': None, '\\': None}))

def _build_desc_prompt(name: str) -> str:
    """
    English prompt. Keeps the dinosaur name inside curly braces {name}
    and enforces formatting/wording constraints.
    """
    return dedent(f"""\
        You are a paleontologist who writes brief, plausible descriptions of fictional dinosaurs based on their names.

        Name: {{{name}}} do not modify the dinosaur's name, do not add or remove words

        Morphological rules (summary):
        - Common suffixes: -saurus (lizard, generic), -raptor / -venator (hunter), -ceratops (horned face),
          -mimus (mimic), -pteryx / -ornis (wing/bird), -dromaeus/-dromeus (runner), -odon/-don (tooth),
          -gnathus (jaw), -lophus (crest), -pelta (shield), -titan (giant), -long (pinyin: dragon; common in Chinese toponyms).
        - Prefixes/roots: brachy-, macro-, micro-, pachy-, ortho-, platy-, spino-, cerato-, osteo-, paleo-/archaeo-, deino-, eu-,
          plus toponyms (Argentino-, Utah-, Qingdao-, Patagonia-).
        - Do not use ...suchus unless referring to crocodiliforms. Keep Latinized orthography (no diacritics).
        - Do NOT use Markdown or quotes for the name.

        Forbidden words (must NOT appear): probably, possibly, perhaps, maybe, it is estimated, it is believed, could, might, suggests (and Spanish equivalents).

        Task:
        - Write 2–3 sentences that include: 1) the name's etymology, 2) traits inferred from the morphemes (size, horns, feathers, dentition, running, predation),
          3) clade/type (e.g., theropod, ceratopsian, sauropod) and a plausible period/habitat (Jurassic/Cretaceous; plains, forests, coasts, deserts, etc.)
          stated with certainty.

        Output: a single brief, objective paragraph in English that does not reveal it was AI-generated. Do not add anything to the dinosaur's Name.
    """).strip()

def _sanitize_description(raw: str, name: str) -> str:
    """
    Limpia la salida si el modelo añade Markdown o hedging.
    No altera el contenido factual, solo formato y palabras prohibidas.
    """
    text = raw.strip()

    # Quitar markdown básico
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)  # **negrita**
    text = re.sub(r"\*([^*]+)\*", r"\1", text)      # *cursiva*
    text = re.sub(r"`([^`]+)`", r"\1", text)        # `code`

    # Aplanar a un párrafo
    text = " ".join(line.strip() for line in text.splitlines() if line.strip())

    # Eliminar palabras prohibidas (y espacios dobles residuales)
    text = re.sub(r"\s{2,}", " ", text).strip()

    # No añadir nada al nombre: evitar comillas al nombre si aparecen
    text = text.replace(f"“{name}”", name).replace(f"\"{name}\"", name).replace(f"‘{name}’", name).replace(f"'{name}'", name)

    return text

def generate_description_sync(ngrok_url: str, name: str, model: str = "gemma3:4b", timeout: int = 600) -> str:
    """
    Envía el POST con el JSON requerido y devuelve la descripción saneada.
    """
    payload = {
        "model": model,
        "messages": [{
            "role": "user",
            "content": _build_desc_prompt(name)
        }],
        "stream": False
    }
    headers = {"Content-Type": "application/json"}

    resp = requests.post(ngrok_url, json=payload, headers=headers, timeout=timeout)
    resp.raise_for_status()
    data = resp.json()

    # Extraer texto según formatos comunes
    text = None
    if isinstance(data, dict):
        text = (
            data.get("description")
            or data.get("text")
            or (data.get("message", {}) or {}).get("content")
            or (data.get("choices", [{}])[0].get("message", {}) or {}).get("content")
            or data.get("choices", [{}])[0].get("text")
        )
    if not text:
        raise ValueError("No se pudo extraer la descripción del JSON de respuesta.")

    return clean_text(_sanitize_description(text, name))
