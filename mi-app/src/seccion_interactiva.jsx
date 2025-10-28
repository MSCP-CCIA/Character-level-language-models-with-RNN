import { useState } from "react";
import axios from "axios";
import DinoChat from "./DinoChat";

export default function SeccionInteractiva() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState(null);

  // Si usas variable de entorno en .env: VITE_API_BASE=http://localhost:8000
  const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "");

  const CHAT_BACKEND = "http://127.0.0.1:8001";

  // === Nueva función para definir el contexto en el backend ===
  const definirContexto = async (nombre, descripcion) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8001/definir_contexto",
        { nombre, descripcion },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: false,
          timeout: 10000,
        }
      );

      alert(response.data.mensaje);
    } catch (error) {
      console.error("❌ Error:", error);

      if (error.response) {
        alert(
          `Error del servidor (${error.response.status}): ${
            error.response.data?.mensaje || "Desconocido"
          }`
        );
      } else if (error.request) {
        alert(
          "⚠️ El servidor no respondió (posible CORS o endpoint inactivo)."
        );
      } else {
        alert("Error al preparar la solicitud.");
      }
    }
  };

  // === Función para generar dinosaurio ===
  async function generarDino() {
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch(`${API_BASE}/generate_dino`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json(); // { name, description, image_b64 }
      setItems((prev) => [data, ...prev]);
      setSelected({
        name: data.name,
        description: data.description,
        img: data.image_b64,
      });

      setStatus(`¡Dinosaurio generado! - ${data.name}`);
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
        <h2 style={styles.title}>
          Sección Interactiva — Generador de Dinosaurios + DinoChat
        </h2>
        <button
          onClick={generarDino}
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
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

        <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          alignItems: "flex-start",
        }}
      >
        {/* IZQUIERDA: lista de dinosaurios generados */}
        <div style={{ flex: "2 1 320px" }}>
          <div style={styles.grid}>
            {items.map((dino, i) => (
              <article
                key={i}
                style={{
                  ...styles.card,
                  outline:
                    selected && selected.name === dino.name
                      ? "2px solid #4ade80"
                      : "none",
                }}
              >
                <button
                  style={styles.cardButton}
                  onClick={() =>
                    setSelected({
                      name: dino.name,
                      description: dino.description,
                      img: dino.image_b64,
                    })
                  }
                  title="Haz clic para chatear con este dinosaurio"
                >
                  <div style={styles.media}>
                    {dino.image_b64 ? (
                      <img
                        src={dino.image_b64}
                        alt={dino.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          borderRadius: "8px",
                          border: "1px solid #1c2433",
                          background: "#000",
                        }}
                      />
                    ) : (
                      <div style={styles.placeholder}>
                        Espacio para la imagen
                      </div>
                    )}
                  </div>

                  <div style={styles.body}>
                    <h3 style={styles.cardTitle}>{dino.name}</h3>
                    <p style={styles.desc}>{dino.description}</p>
                  </div>
                </button>
              </article>
            ))}
          </div>
        </div>

        {/* DERECHA: chat con el dinosaurio seleccionado */}
        <div style={{ flex: "1 1 320px" }}>
          {selected ? (
            <DinoChat
              name={selected.name}
              description={selected.description}
              backendUrl={CHAT_BACKEND}
            />
          ) : (
            <div
              style={{
                background: "#0f1217",
                border: "1px solid #1c2433",
                borderRadius: "1rem",
                padding: "1rem",
                color: "#9aa6ba",
                fontSize: "0.9rem",
                lineHeight: 1.5,
              }}
            >
              Genera un dinosaurio o haz clic en uno existente para iniciar el
              chat 🦖💬
            </div>
          )}
        </div>
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
  cardButton: {
    all: "unset",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
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
