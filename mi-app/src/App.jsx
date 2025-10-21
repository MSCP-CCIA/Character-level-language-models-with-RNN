import React, { useState } from "react";
import "./App.css";
import nlpImg from "./assets/nlp.png";

import InformeNLP from "./descr_model";
import Examples from "./seccion_ejemplos";
import Interactive from "./seccion_interactiva";

const pages = [
  { key: "home", label: "Inicio" },
  { key: "descr_model", label: "Descripción" },
  { key: "seccion_ejemplos", label: "Ejemplos" },
  { key: "seccion_interactiva", label: "Interactiva" },
];

export default function App() {
  const [active, setActive] = useState("home");

  function ActivePage() {
    switch (active) {
      case "descr_model":
        return <InformeNLP />;
      case "seccion_ejemplos":
        return <Examples />;
      case "seccion_interactiva":
        return <Interactive />;
      default:
        return (
          <div className="hero-welcome">
            <div className="hero-text">
              <h1>Bienvenido</h1>
              <p className="muted">Usa la barra de navegación para ver las secciones.</p>
            <img src={nlpImg} alt="decor" className="decor-img" />
          </div>
          </div>
        );
    }
  }

  return (
    <div>
      <nav className="navbar">
        <div className="brand" onClick={() => setActive("home")} style={{cursor:"pointer"}}>
          <div className="title">NLP PARCIAL</div>
        </div>
        <ul className="nav-list">
          {pages.map((p) => (
            <li key={p.key}>
              <button
                onClick={() => setActive(p.key)}
                className={p.key === active ? "nav-link active" : "nav-link"}
              >
                {p.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <main>
        <ActivePage />
      </main>
    </div>
  );
}