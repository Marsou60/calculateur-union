import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("home");
  const [tab, setTab] = useState("remise");

  if (screen === "home") {
    return (
      <div className="home-screen">
        <img src="logo-union.png" alt="Logo Union" className="logo" />
        <h1>Bienvenue sur le Calculateur de Prix</h1>
        <p>Optimisez vos remises et vos marges avec Union</p>
        <button className="start-btn" onClick={() => setScreen("app")}>Accéder au calculateur</button>
      </div>
    );
  }

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
  const [recap, setRecap] = useState([]);

  const calculer = () => {
    try {
      const recapSteps = [];
      let p = parseFloat(prix.replace(",", "."));
      recapSteps.push({ name: "Départ", value: p });

      if (stock !== "aucune") {
        const stockVal = parseFloat(stock);
        p *= (100 - stockVal) / 100;
        recapSteps.push({ name: `Stock -${stockVal}%`, value: p });
      }

      const rfaVal = parseFloat(rfa.replace(",", "."));
      p *= (100 - rfaVal) / 100;
      recapSteps.push({ name: `RFA -${rfaVal}%`, value: p });

      if (tripartiteActive) {
        const t = parseFloat(tripartite.replace(",", "."));
        p *= (100 - t) / 100;
        recapSteps.push({ name: `Tripartite -${t}%`, value: p });
      }

      setResult(`Prix final : ${p.toFixed(2)} €`);
      setRecap(recapSteps);
    } catch {
      setResult("Erreur dans les données.");
      setRecap([]);
    }
  };

  const reset = () => {
    setPrix("");
    setStock("aucune");
    setRfa("");
    setTripartite("");
    setTripartiteActive(false);
    setResult("");
    setRecap([]);
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
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={calculer}>Calculer</button>
        <button className="reset-btn" onClick={reset}>Réinitialiser</button>
      </div>
      <p className="result">{result}</p>

      {recap.length > 0 && (
        <>
          <div className="recap">
            <h3>📄 Fiche Récap :</h3>
            <ul>
              {recap.map((item, index) => (
                <li key={index}>
                  {item.name} : {item.value.toFixed(2)} €
                </li>
              ))}
            </ul>
          </div>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={recap}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#F26400" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
