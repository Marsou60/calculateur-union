import React, { useState } from "react";
import "./App.css";

function App() {
  const [tab, setTab] = useState("remise");

  return (
    <div className="app-container">
      <header>
        <h1>🧮 Calculateur de Prix</h1>
        <div className="tabs">
          <button className={tab === "remise" ? "active" : ""} onClick={() => setTab("remise")}>
            Remise Globale
          </button>
          <button className={tab === "triple" ? "active" : ""} onClick={() => setTab("triple")}>
            Triple Net
          </button>
        </div>
      </header>

      <main>
        {tab === "remise" ? <RemiseGlobale /> : <TripleNet />}
      </main>
    </div>
  );
}

function RemiseGlobale() {
  const [r1, setR1] = useState("");
  const [r2, setR2] = useState("");
  const [result, setResult] = useState("");

  const calculer = () => {
    const val1 = parseFloat(r1.replace(",", "."));
    const val2 = parseFloat(r2.replace(",", "."));
    if (isNaN(val1) || isNaN(val2)) return;
    const remise = 100 - ((100 - val1) * (100 - val2) / 100);
    setResult(`Remise globale : ${remise.toFixed(1)} %`);
  };

  return (
    <div className="card">
      <h2>Calcul de Remise Globale</h2>
      <input value={r1} onChange={(e) => setR1(e.target.value)} placeholder="Première remise (%)" />
      <input value={r2} onChange={(e) => setR2(e.target.value)} placeholder="Deuxième remise (%)" />
      <button onClick={calculer}>Calculer</button>
      <p className="result">{result}</p>
    </div>
  );
}

function TripleNet() {
  const [prix, setPrix] = useState("");
  const [stock, setStock] = useState("aucune");
  const [rfa, setRfa] = useState("");
  const [tripartiteActive, setTripartiteActive] = useState(false);
  const [tripartite, setTripartite] = useState("");
  const [result, setResult] = useState("");

  const calculer = () => {
    try {
      let p = parseFloat(prix.replace(",", "."));
      if (stock !== "aucune") {
        p *= (100 - parseFloat(stock)) / 100;
      }
      const r = parseFloat(rfa.replace(",", "."));
      p *= (100 - r) / 100;
      if (tripartiteActive) {
        const t = parseFloat(tripartite.replace(",", "."));
        p *= (100 - t) / 100;
      }
      setResult(`Prix final : ${p.toFixed(2)} €`);
    } catch {
      setResult("Erreur dans les données.");
    }
  };

  return (
    <div className="card">
      <h2>Triple Net</h2>
      <input value={prix} onChange={(e) => setPrix(e.target.value)} placeholder="Prix d'achat HT (€)" />
      <select value={stock} onChange={(e) => setStock(e.target.value)}>
        <option value="aucune">Aucune remise stock</option>
        <option value="5">5 %</option>
        <option value="10">10 %</option>
        <option value="15">15 %</option>
      </select>
      <input value={rfa} onChange={(e) => setRfa(e.target.value)} placeholder="RFA Groupement (%)" />
      <label>
        <input type="checkbox" checked={tripartiteActive} onChange={() => setTripartiteActive(!tripartiteActive)} />
        Activer tripartite
      </label>
      {tripartiteActive && (
        <input value={tripartite} onChange={(e) => setTripartite(e.target.value)} placeholder="Tripartite (%)" />
      )}
      <button onClick={calculer}>Calculer</button>
      <p className="result">{result}</p>
    </div>
  );
}

export default App;