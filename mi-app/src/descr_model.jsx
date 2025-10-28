// Informe técnico en React (.jsx)
// Nota: Estilos se aplicarán luego vía CSS externo.

import React from "react";
import "./descr_model.css";
import lstmImg from "./assets/lstm.jpg";
import gruImg from "./assets/gru.jpg";


export default function InformeNLP() {
  const bestNames = [
    "pacospylus",
    "parastiodys",
    "artasaurus",
    "aratops",
    "sherachisaurus",
    "crorodon",
    "cenatosaurus",
    "polosaurus",
    "alaticus",
    "calesaurus",
  ];

  const samplingSummary = [
    {
      parametro: "Temperature",
      valores: "0.7, 1.0, 2.5, 4 (explorado)",
      efecto:
        "Controla la aleatoriedad: 0.7 equilibra creatividad y coherencia; 1.0 incrementa variación con ligero ruido.",
      recomendado: "0.7",
    },
    {
      parametro: "Top-k",
      valores: "none, 5, 10 (explorado)",
      efecto:
        "Restringe el conjunto de tokens más probables: k=5 tiende a ser repetitivo; k=10 aporta diversidad natural pero genera mucho ruido.",
      recomendado: "5",
    },
    {
      parametro: "Top-p",
      valores: "none, 0.8, 0.9 (explorado)",
      efecto:
        "Núcleo de probabilidad acumulada: p=0.8 más predecible; p=0.9 equilibrio entre fluidez y novedad.",
      recomendado: "0.9",
    },
  ];

  const modelCompare = [
    {
      aspecto: "Tiempo de entrenamiento",
      lstm: "Mayor",
      gru: "≈ 20% más rápido",
    },
    {
      aspecto: "Estabilidad",
      lstm: "Muy alta",
      gru: "Buena",
    },
    {
      aspecto: "Creatividad",
      lstm: "Moderada",
      gru: "Más libre y variada",
    },
    {
      aspecto: "Estructura fonética",
      lstm: "A veces irregular",
      gru: " Más coherente",
    },
    {
      aspecto: "Mejor uso",
      lstm: "Exploración creativa ",
      gru: "Refinamiento final",
    },
  ];

  const metrics = [
    {
      modelo: "LSTM",
      epocaOptima: 18,
      valLoss: 1.98,
      valAcc: 0.50,
      notas: "Estabilidad alta; bajo sobreajuste.",
    },
    {
      modelo: "GRU",
      epocaOptima: 14,
      valLoss: 1.95,
      valAcc: 0.51,
      notas: "Rendimiento similar y entrenamiento más rápido.",
    },
  ];

  return (
    <article className="informe">
      {/* Encabezado */}
      <header className="informe__header">
        <h1 className="informe__title">
          Informe Técnico: Generación de Nombres con Modelos Secuenciales (LSTM y GRU)
        </h1>
        <p className="informe__subtitle">
          Análisis comparativo de modelos y parámetros de muestreo (top-k, top-p, temperature),
          con métricas de evaluación, curvas de aprendizaje y descripción de arquitectura.
        </p>
      </header>

      {/* Objetivo */}
      <section className="informe__section" aria-labelledby="objetivo">
        <h2 id="objetivo" className="section__title">1. Objetivo general</h2>
        <p className="section__text">
          Generar nombres originales con estructura fonética inspirada en la nomenclatura paleontológica
          utilizando redes neuronales recurrentes. Se comparan dos arquitecturas, LSTM y GRU, y se evaluan
          distintos esquemas de muestreo estocástico para el decodificado autoregresivo (temperature, top-k, top-p).
        </p>
      </section>

      {/* Arquitectura */}
      <section className="informe__section" aria-labelledby="arquitectura">
        <h2 id="arquitectura" className="section__title">2. Descripción de la arquitectura</h2>
        <ul className="bullets">
          
          <li>
            <strong>Recurrente</strong>:
            <ul>
              <li>Modelo <strong>LSTM</strong>: 2 capas (512 → 256 unidades) con <em>dropout</em> 0.3.</li>
              <li>Modelo <strong>GRU</strong>: 2 capas (512 → 256 unidades) con <em>dropout</em> 0.1.</li>
            </ul>
          </li>
          <li>
            <strong>Densa intermedia</strong>: 256 neuronas, activación ReLU.
          </li>
          <li>
            <strong>Salida</strong>: capa Softmax de tamaño <code>vocab_size</code>.
          </li>
          <li>
            <strong>Optimización</strong>: Adam (lr=0.001), pérdidas/precisión enmascaradas para ignorar <code>&lt;PAD&gt;</code>.
          </li>
          <li>
            <strong><code>&lt;EarlyStopping&gt;</code></strong> con patience de 15 para evitar entrenar extra innecesariamente
          </li>
          <li>
            <strong> <code>&lt;ReduceLROnPlateau &gt;</code></strong> para modificar el learning rate en caso de estancamiento
          </li>
          <li>
            <strong> <code>&lt;ModelCheckPoint &gt;</code> </strong>para ir guardando el mejor modelo a medida que se entrena
          </li>
        </ul>
      </section>

      {/* Métricas */}
      <section className="informe__section" aria-labelledby="metricas">
        <h2 id="metricas" className="section__title">3. Métricas de evaluación</h2>
        <table className="table table--metrics">
          <thead>
            <tr>
              <th>Modelo</th>
              <th>Época óptima</th>
              <th>val_loss</th>
              <th>val_acc</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.modelo}>
                <td>{m.modelo}</td>
                <td>{m.epocaOptima}</td>
                <td>{m.valLoss.toFixed(2)}</td>
                <td>{m.valAcc.toFixed(2)}</td>
                <td>{m.notas}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="section__text">
          Ambos modelos convergen a una precisión de validación cercana a 0.50–0.51 con pérdidas ≈ 1.95 al 1.98,
          lo que es coherente con tareas de generación carácter a carácter. GRU logra tiempos de
          entrenamiento menores sin sacrificar rendimiento.
        </p>
      </section>

      {/* Curvas de aprendizaje */}
      {/* Curvas de aprendizaje */}
<section className="informe__section" aria-labelledby="curvas">
  <h2 id="curvas" className="section__title">4. Curvas de aprendizaje</h2>
  <p className="section__text">
    Las curvas de entrenamiento/validación muestran descenso sostenido de la pérdida y aumento de la precisión
    hasta estabilizarse alrededor de la época 14 en gru y la epoca 18 en lstm. Se emplearon estrategias de control como <em>early stopping</em>
    y reducción de tasa de aprendizaje en meseta para evitar sobreajuste.
  </p>

  {/* Comparación LSTM vs GRU */}
  <div className="curvas__grid comparativa" role="group" aria-label="Comparación de curvas LSTM vs GRU">
    <figure className="curva">
      <img
        src={lstmImg}
        alt="Curvas de pérdida y precisión del modelo LSTM"
        className="curva__img"
        loading="lazy"
      />
      <figcaption className="curva__caption">LSTM</figcaption>
    </figure>

    <figure className="curva">
      <img
        src={gruImg}
        alt="Curvas de pérdida y precisión del modelo GRU"
        className="curva__img"
        loading="lazy"
      />
      <figcaption className="curva__caption">GRU</figcaption>
    </figure>
  </div>

</section>


      {/* Muestreo */}
      <section className="informe__section" aria-labelledby="muestreo">
        <h2 id="muestreo" className="section__title">5. Parámetros de muestreo (decodificación)</h2>
        <table className="table table--sampling">
          <thead>
            <tr>
              <th>Parámetro</th>
              <th>Valores probados</th>
              <th>Efecto observado</th>
              <th>Valor recomendado</th>
            </tr>
          </thead>
          <tbody>
            {samplingSummary.map((row, idx) => (
              <tr key={idx}>
                <td>{row.parametro}</td>
                <td>{row.valores}</td>
                <td>{row.efecto}</td>
                <td>{row.recomendado}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <aside className="callout">
          <strong>Configuración sugerida:</strong> GRU + combinar con top-k=5
          para maximizar naturalidad y diversidad.
        </aside>
      </section>

      {/* Comparación de modelos */}
      <section className="informe__section" aria-labelledby="comparacion">
        <h2 id="comparacion" className="section__title">6. Comparación entre modelos (LSTM vs GRU)</h2>
        <table className="table table--compare">
          <thead>
            <tr>
              <th>Aspecto</th>
              <th>LSTM</th>
              <th>GRU</th>
            </tr>
          </thead>
          <tbody>
            {modelCompare.map((row, idx) => (
              <tr key={idx}>
                <td>{row.aspecto}</td>
                <td>{row.lstm}</td>
                <td>{row.gru}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="section__text">
          En términos cualitativos, LSTM ofrece mejor relación tiempo/creatividad y  GRU proporciona
          una estructura fonética ligeramente más estable. En la práctica,  LSTM se recomienda para exploración
          y GRU para etapas de refinamiento.
        </p>
      </section>

      {/* Mejores nombres */}
      <section className="informe__section" aria-labelledby="mejores-nombres">
        <h2 id="mejores-nombres" className="section__title">7. Mejores 10 nombres generados</h2>
        <ol className="lista-nombres">
          {bestNames.map((n) => (
            <li key={n} className="nombre-item">{n}</li>
          ))}
        </ol>
        <p className="section__text">
          Los seleccionados mantienen sufijos taxonómicos plausibles (p.ej., <em>-saurus</em>, <em>-mus</em>) y raíces
          que suenan naturales, con longitud cercana a 10–12 caracteres y buena memorización.
        </p>
      </section>

      
    </article>
  );
}
