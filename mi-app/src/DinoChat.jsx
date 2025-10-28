import { useState, useEffect } from "react";
import axios from "axios";

/**
 * Props:
 *  - name: string (nombre del dinosaurio actual)
 *  - description: string (descripción del dinosaurio actual)
 *  - backendUrl: string (URL base del backend de chat, ej: "http://127.0.0.1:8001")
 *
 * Este componente:
 *   1. Asegura que el backend sepa "quién soy" (definir_contexto).
 *   2. Envía preguntas del usuario a /conversar.
 *   3. Muestra la conversación estilo chat.
 */
export default function DinoChat({ name, description, backendUrl }) {
  const [messages, setMessages] = useState([
    {
      sender: "dino",
      text:
        "Hi, I'm a dinosaur. I can talk to you about my life in the Mesozoic. 🦖 Ask me anything.",
    },
  ]);
  const [input, setInput] = useState("");
  const [ready, setReady] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(false);

  // Llamamos a /definir_contexto cuando cambie el dinosaurio seleccionado
  useEffect(() => {
    async function define() {
      if (!name || !description) return;
      try {
        await axios.post(
          `${backendUrl}/definir_contexto`,
          {
            nombre: name,
            descripcion: description,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Mensaje de sistema indicando que el contexto quedó cargado
        setMessages([
          {
            sender: "dino",
            text: `I'm ${name}. What do you want to know about me?`,
          },
        ]);
        setReady(true);
      } catch (err) {
        console.error("Error definiendo contexto:", err);
        setMessages([
          {
            sender: "dino",
            text:
              "No pude preparar el contexto del dinosaurio 😢. ¿El servidor de chat está corriendo?",
          },
        ]);
        setReady(false);
      }
    }

    define();
  }, [name, description, backendUrl]);

  async function handleSend(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !ready) return;

    // agregar el mensaje del usuario al chat
    setMessages((prev) => [...prev, { sender: "you", text: trimmed }]);
    setInput("");
    setLoadingMsg(true);

    try {
      // IMPORTANTE:
      // Aquí asumimos que tu /conversar responde JSON tipo { reply: "texto..." }.
      // Si tu /conversar actualmente hace streaming, puedes luego ajustarlo.
      const res = await axios.post(
        `${backendUrl}/conversar`,
        { mensaje: trimmed },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const botReply =
        res.data?.reply ||
        res.data?.mensaje ||
        typeof res.data === "string"
          ? res.data
          : "No entendí la respuesta del servidor 🥲";

      setMessages((prev) => [
        ...prev,
        { sender: "dino", text: botReply },
      ]);
    } catch (err) {
      console.error("Error conversando:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "dino",
          text:
            "Perdón, hubo un problema al responder. Puede que el backend de chat no esté activo.",
        },
      ]);
    } finally {
      setLoadingMsg(false);
    }
  }

  return (
    <section
      style={{
        backgroundColor: "#111620",
        border: "1px solid #1c2433",
        borderRadius: "1rem",
        padding: "1rem",
        color: "#e7ebf1",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Inter, Roboto, Arial, "Helvetica Neue"',
        display: "flex",
        flexDirection: "column",
        maxWidth: "400px",
        height: "420px",
      }}
    >
      <header style={{ marginBottom: "0.5rem" }}>
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            margin: 0,
            color: "#e7ebf1",
          }}
        >
          Chat con {name || "??"}
        </h2>
        {!ready && (
          <p
            style={{
              margin: "0.25rem 0 0 0",
              color: "#9aa6ba",
              fontSize: "0.8rem",
              lineHeight: 1.4,
            }}
          >
            Preparando personalidad...
          </p>
        )}
      </header>

      {/* Historial del chat */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid #1c2433",
          borderRadius: "0.5rem",
          padding: "0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          backgroundColor: "#0f1217",
        }}
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: m.sender === "you" ? "flex-end" : "flex-start",
              backgroundColor:
                m.sender === "you" ? "#2a2a2a" : "#1a3a1a",
              border: "1px solid #1c2433",
              borderRadius: "0.75rem",
              padding: "0.5rem 0.75rem",
              fontSize: "0.8rem",
              lineHeight: 1.4,
              maxWidth: "80%",
              whiteSpace: "pre-wrap",
            }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                opacity: 0.7,
                marginBottom: "0.25rem",
              }}
            >
              {m.sender === "you" ? "Tú" : name || "Dino"}
            </div>
            <div>{m.text}</div>
          </div>
        ))}

        {loadingMsg && (
          <div
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#1a3a1a",
              border: "1px solid #1c2433",
              borderRadius: "0.75rem",
              padding: "0.5rem 0.75rem",
              fontSize: "0.8rem",
              lineHeight: 1.4,
              maxWidth: "80%",
              color: "#e7ebf1",
              opacity: 0.8,
            }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                opacity: 0.7,
                marginBottom: "0.25rem",
              }}
            >
              {name || "Dino"}
            </div>
            <div>...</div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        style={{
          marginTop: "0.75rem",
          display: "flex",
          gap: "0.5rem",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!ready}
          placeholder={
            ready
              ? `Pregúntale algo a ${name}...`
              : "Esperando contexto..."
          }
          style={{
            flex: 1,
            backgroundColor: "#000",
            color: "#fff",
            border: "1px solid #1c2433",
            borderRadius: "0.5rem",
            padding: "0.6rem 0.75rem",
            fontSize: "0.8rem",
          }}
        />
        <button
          type="submit"
          disabled={!ready || !input.trim()}
          style={{
            backgroundColor: "#4ade80",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: 600,
            padding: "0.6rem 0.75rem",
            cursor: ready ? "pointer" : "not-allowed",
            fontSize: "0.8rem",
            color: "#000",
          }}
        >
          Enviar
        </button>
      </form>
    </section>
  );
}
