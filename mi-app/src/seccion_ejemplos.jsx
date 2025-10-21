import React from "react";
import "./seccion_ejemplos.css";
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
export default function DinosauriosGallery() {
  const especies = [
    {
      nombre: "Pacospylus",
      descripcion:
        "Deriva del griego “pako” (pacífico) y “pylus” (piel). Terópodo mediano (6–8 m), dentición carnívora con dientes pequeños y redondeados. Jurásico Superior (~150 Ma), llanuras costeras y bosques ribereños de Patagonia, Argentina.",
      imgSrc: img1, // ej: "/images/pacospylus.jpg"
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
      imgSrc:  img6,
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
      imgSrc:  img8,
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

  return (
    <section aria-labelledby="galeria-dinos" className="galeria-dinos">
      <h2 id="galeria-dinos">DinoNames Generados</h2>
      <p>
        A continuación se presentan los nombres, descripciones e imágenes generadas por el grupo.
      </p>

      <div className="grid" role="list" aria-label="Galería de especies">
        {especies.map((e) => (
          <article className="card" role="listitem" key={e.nombre}>
            <div className="media">
              {e.imgSrc ? (
                <img src={e.imgSrc} alt={`Ilustración de ${e.nombre}`} loading="lazy" />
              ) : (
                <div className="placeholder" aria-label={`Espacio para la imagen de ${e.nombre}`}>
                  <span>Espacio para la foto</span>
                </div>
              )}
            </div>

            <div className="body">
              <h3>{e.nombre}</h3>
              <p>{e.descripcion}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
