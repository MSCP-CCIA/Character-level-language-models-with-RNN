
import httpx, uuid, pathlib

IMAGE_ENDPOINT = "https://01975b2936c4.ngrok-free.app/generate-image/"

async def fetch_image_bytes_from_ngrok(
    prompt: str,
    seed: int | None = None,
    timeout_connect: float = 10.0,
    timeout_read: float = 120.0
) -> bytes:
    payload = {"prompt": prompt}
    if seed is not None:
        payload["seed"] = seed
    else:
        payload["seed"] = 42

    timeout = httpx.Timeout(connect=timeout_connect, read=timeout_read)
    headers = {"Accept": "image/png", "Content-Type": "application/json"}

    async with httpx.AsyncClient(timeout=timeout) as client:
        r = await client.post(IMAGE_ENDPOINT, json=payload, headers=headers)
        r.raise_for_status()
        ctype = r.headers.get("content-type", "")
        if not ctype.startswith("image/"):
            raise RuntimeError(f"Upstream did not return an image (content-type={ctype})")
        return r.content

def save_image_bytes_to_static(img_bytes: bytes, ext: str = "png") -> str:
    folder = pathlib.Path("static/images")
    folder.mkdir(parents=True, exist_ok=True)
    fname = f"{uuid.uuid4().hex}.{ext}"
    (folder / fname).write_bytes(img_bytes)
    # devuelve una URL relativa servida por FastAPI StaticFiles
    return f"/static/images/{fname}"

