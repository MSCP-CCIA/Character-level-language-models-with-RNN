import numpy as np

def safe_normalize(probs):
    """Normaliza asegurando que no haya NaN ni división por cero."""
    probs = np.clip(probs, 1e-8, None)  # evitar ceros exactos
    probs_sum = np.sum(probs)
    if probs_sum == 0 or np.isnan(probs_sum):
        probs = np.ones_like(probs) / len(probs)
    else:
        probs = probs / probs_sum
    return probs

def apply_top_k(probs, top_k=None):
    probs = np.asarray(probs)
    probs = safe_normalize(probs)

    # --- Top-k ---
    if top_k is not None and top_k > 0:
        idx_sorted = np.argsort(probs)[::-1]
        idx_remove = idx_sorted[top_k:]
        probs[idx_remove] = 0
        probs = safe_normalize(probs)

    return probs
def generate_name(model, char_to_idx, idx_to_char, top_k=5, max_len=25):
    sequence = [char_to_idx["<START>"]]

    for _ in range(max_len):
        input_seq = np.array([sequence])
        preds = model.predict(input_seq, verbose=0)[0, -1, :]
        # Antes de normalizar:
        preds[char_to_idx['<PAD>']] = 0.0
        preds = np.maximum(preds, 1e-8)
        preds /= np.sum(preds)

        # Aplicar top-k / top-p
        preds = apply_top_k(preds, top_k)

        # Muestrear próximo token
        next_idx = np.random.choice(len(preds), p=preds)
        sequence.append(next_idx)

        if idx_to_char[next_idx] == "<END>":
            break

    return ''.join(idx_to_char[i] for i in sequence if idx_to_char[i] not in ['<PAD>','<START>', '<END>'])