import { useState } from "react";
import "./seccion_ejemplos.css";
import axios from "axios";
import DinoChat from "./DinoChat";

import img1 from "./assets/1.jpg";
import img2 from "./assets/2.jpg";
import img3 from "./assets/3.jpg";
import img4 from "./assets/4.jpg";
import img5 from "./assets/5.jpg";
import img6 from "./assets/6.jpg";
import img7 from "./assets/7.jpg";
import img8 from "./assets/8.jpg";
import img9 from "./assets/9.jpg";
import img10 from "./assets/10.jpg";

function ChatFloatingPanel({ dino, onClose, backendUrl }) {
  if (!dino) return null;

  return (
    <div
      style={{
        position: "fixed",
        right: "1.5rem",
        bottom: "1.5rem",
        width: "340px",
        maxWidth: "90vw",

        backgroundColor: "#0f1217",
        border: "1px solid #1c2433",
        borderRadius: "1rem",
        boxShadow:
          "0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(76,222,128,0.15)",

        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Inter, Roboto, Arial, "Helvetica Neue"',
      }}
    >
      {/* HEADER del panel flotante */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.75rem 1rem",
          background:
            "linear-gradient(to right, rgba(16,23,34,1) 0%, rgba(24,46,34,0.6) 100%)",
          borderBottom: "1px solid #1c2433",
        }}
      >
        {/* mini preview del dino */}
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "0.5rem",
            backgroundColor: "#0e1420",
            border: "1px solid #1c2433",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {dino.img ? (
            <img
              src={dino.img}
              alt={dino.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "grid",
                placeItems: "center",
                color: "#9aa6ba",
                fontSize: "0.6rem",
                padding: "0.25rem",
                textAlign: "center",
              }}
            >
              sin imagen
            </div>
          )}
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
            lineHeight: 1.3,
            color: "#e7ebf1",
          }}
        >
          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#e7ebf1",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
            title={dino.name}
          >
            {dino.name}
          </div>
          <div
            style={{
              fontSize: "0.7rem",
              color: "#4ade80",
              fontWeight: 500,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
            title="Dinosaurio disponible para chat"
          >
            Disponible para chat
          </div>
        </div>

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          style={{
            all: "unset",
            cursor: "pointer",
            color: "#9aa6ba",
            fontSize: "0.8rem",
            lineHeight: 1,
            padding: "0.4rem 0.5rem",
            borderRadius: "0.4rem",
            border: "1px solid #1c2433",
            backgroundColor: "rgba(15,18,23,0.6)",
          }}
          title="Cerrar chat"
        >
          ✕
        </button>
      </div>

      {/* El cuerpo del chat */}
      <div
        style={{
          padding: "0.75rem 1rem 1rem",
          backgroundColor: "#0f1217",
        }}
      >
        <DinoChat
          name={dino.name}
          description={dino.description}
          backendUrl={backendUrl}
        />
      </div>
    </div>
  );
}


export default function DinosauriosGallery() {
  const [selected, setSelected] = useState(null);

    const [showChat, setShowChat] = useState(false);

  const CHAT_BACKEND = "http://34.201.213.246:8001";


  const especies = [
    {
      nombre: "Pacospylus",
      descripcion:
        "Deriva del griego “pako” (pacífico) y “pylus” (piel). Terópodo mediano (6–8 m), dentición carnívora con dientes pequeños y redondeados. Jurásico Superior (~150 Ma), llanuras costeras y bosques ribereños de Patagonia, Argentina.",
      imgSrc: img1,
    },
    {
      nombre: "Parastiodys",
      descripcion:
        "De para (alrededor) y stios (diente). Terópodo grande (8–10 m), depredador ágil con musculatura posterior robusta. Cretácico Inferior en Patagonia; afinidad con carcarodontosaurios.",
      imgSrc: img2,
    },
    {
      nombre: "Artasaurus",
      descripcion:
        "De artes (habilidad) + saurus (lagarto). ~12 m, dentición serrada para desgarrar, estructuras óseas con queratina; locomoción corredora tipo dromeosáurido. Cretácico Inferior, caza en manada.",
      imgSrc: img3,
    },
    {
      nombre: "Aratops",
      descripcion:
        "De “ara” (cabeza) y “tops” (diente). ~6 m, mandíbula robusta con dientes afilados; carnívoro de presas medianas. Cretácico Superior en llanuras abiertas de Patagonia.",
      imgSrc: img4,
    },
    {
      nombre: "Sherachisaurus",
      descripcion:
        "De “sherachos” (piel) + saurus. Saurópodo ~25 m, dientes para triturar vegetación, plumas densas en cuello y dorso (termorregulación/cortejo). Cretácico Superior, llanuras inundadas y bosques densos del norte de Argentina.",
      imgSrc: img5,
    },
    {
      nombre: "Crorodon",
      descripcion:
        "De “cror-” (canto) + odon (diente). Terópodo ~6 m, dientes curvados para presas pequeñas, cresta/pico óseo dorsal (display). Jurásico Superior, bosques subtropicales patagónicos; caza en grupos.",
      imgSrc: img6,
    },
    {
      nombre: "Cenatosaurus",
      descripcion:
        "De “cen-” (cielo) + saurus. Terópodo ~8 m, dientes altos y afilados; plumas dispersas, posible vida arbórea/camuflaje. Cretácico Inferior, bosques densos y llanuras costeras de Patagonia.",
      imgSrc: img7,
    },
    {
      nombre: "Polosaurus",
      descripcion:
        "De “poly” (muchos) + saurus. ~6 m, carnívoro con plumas dorsales pequeñas (etapa temprana). Robusto y veloz, depredador ágil de llanuras del Cretácico Superior en Patagonia.",
      imgSrc: img8,
    },
    {
      nombre: "Alaticus",
      descripcion:
        "De “alatus” (alado) + -icus. Terópodo mediano (~6 m), cobertura plumosa en brazos/espalda; depredador de presas medianas. Jurásico Superior costero (marismas/bosques lodosos); afinidad con troodóntidos.",
      imgSrc: img9,
    },
    {
      nombre: "Calesaurus",
      descripcion:
        "De “kales” (piedra) + saurus. ~8 m, dentición para trituración de hueso, plumas plumosas superiores (camuflaje/display). Cretácico Inferior en llanuras rocosas de Patagonia.",
      imgSrc: img10,
    },
  ];

    function handleSelect(d) {
    setSelected({
      name: d.nombre,
      description: d.descripcion,
      img: d.imgSrc,
    });
    setShowChat(true);
  }

  return (
    <section aria-labelledby="galeria-dinos" className="galeria-dinos">
      <h2 id="galeria-dinos">DinoNames Generados</h2>
      <p>
        A continuación se presentan los nombres, descripciones e imágenes generadas por el grupo, Selecciona un dinosaurio para hablar con él. Abajo verás el chat.
      </p>

      <ul className="grid" aria-label="Galería de especies">
        {especies.map((e) => (
          <li key={e.nombre}>
            <button
              className="card"
              onClick={() => handleSelect(e)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleSelect(e);
                }
              }}
            >
              <div className="media">
                {e.imgSrc ? (
                  <img
                    src={e.imgSrc}
                    alt={`Ilustración de ${e.nombre}`}
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="placeholder"
                    aria-label={`Espacio para la imagen de ${e.nombre}`}
                  >
                    <span>Espacio para la foto</span>
                  </div>
                )}
              </div>

              <div className="body">
                <h3>{e.nombre}</h3>
                <p>{e.descripcion}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    
      {/* Panel flotante del chat */}
      {showChat && selected && (
        <ChatFloatingPanel
          dino={selected}
          backendUrl={CHAT_BACKEND}
          onClose={() => setShowChat(false)}
        />
      )}
     
    </section>
  );
}
