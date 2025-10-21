import { useState } from "react";

export default function SeccionInteractiva() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Si usas variable de entorno en .env: VITE_API_BASE=http://localhost:8000
  const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "");

  async function generarDino() {
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch(`${API_BASE}/generate_dino`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json(); // { name, description, image_b64 }
      setItems((prev) => [data, ...prev]);
      setStatus("¡Nuevo dinosaurio generado con éxito!");
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <h2 style={styles.title}>Sección Interactiva — Generador de Dinosaurios</h2>
        <button
          onClick={generarDino}
          disabled={loading}
          style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
        >
          {loading ? "Generando..." : "Nuevo Dinosaurio"}
        </button>
      </div>

      <p
        style={{
          ...styles.status,
          color: status.startsWith("Error") ? "#ff8888" : "#9aa6ba",
        }}
      >
        {status}
      </p>

      <div style={styles.grid}>
        {items.map((dino, i) => (
          <article key={i} style={styles.card}>
            <div style={styles.media}>
              {dino.image_b64 ? (
                <img
                  src={dino.image_b64}
                  alt={`Ilustración de ${dino.name}`}
                  style={styles.img}
                  loading="lazy"
                />
              ) : (
                <div style={styles.placeholder}>Espacio para la imagen</div>
              )}
            </div>
            <div style={styles.body}>
              <h3 style={styles.cardTitle}>{dino.name}</h3>
              <p style={styles.desc}>{dino.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ======== ESTILOS ========
const styles = {
  section: {
    padding: 24,
    background: "#0f1217",
    color: "#e7ebf1",
    minHeight: "100vh",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Inter, Roboto, Arial, "Helvetica Neue"',
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    margin: 0,
  },
  button: {
    padding: "8px 14px",
    borderRadius: 10,
    border: "1px solid #1c2433",
    background: "#111620",
    color: "#e7ebf1",
    cursor: "pointer",
    transition: "transform .1s ease, background .2s ease",
  },
  buttonDisabled: {
    background: "#243042",
    cursor: "not-allowed",
    opacity: 0.8,
  },
  status: {
    margin: "8px 0 0",
    minHeight: "1.2em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
    marginTop: 16,
  },
  card: {
    background: "#111620",
    border: "1px solid #1c2433",
    borderRadius: 14,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "all .2s ease",
  },
  media: {
    width: "100%",
    aspectRatio: "16/9",
    background: "#0e1420",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    border: "1px dashed #212a3b",
    color: "#9aa6ba",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    padding: "12px 14px 14px",
  },
  cardTitle: {
    margin: "0 0 6px 0",
    fontSize: 18,
    fontWeight: 700,
  },
  desc: {
    margin: 0,
    color: "#9aa6ba",
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
  },
};
