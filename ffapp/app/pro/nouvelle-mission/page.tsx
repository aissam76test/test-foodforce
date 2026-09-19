"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const jobs = [
  ["Serveur", 36.060209, 54.090314],
  ["Runner", 30.366492, 45.549738],
  ["Barman", 43.651832, 65.477749],
  ["Chef de partie", 68.324607, 102.486911],
  ["Commis de cuisine", 32.264398, 48.396597],
] as const;

export default function NouvelleMission() {
  const [job, setJob] = useState(jobs[0][0]);
  const [seats, setSeats] = useState(1);
  const selected = useMemo(() => jobs.find((x) => x[0] === job) ?? jobs[0], [job]);

  return (
    <main className="dashboard">
      <header>
        <div className="brand">FOOD<span>FORCE</span> PRO</div>
        <nav><Link href="/pro">Retour</Link></nav>
      </header>

      <section className="hero">
        <p className="eyebrow">FOODFORCE PRO</p>
        <h1>Publier une mission</h1>
        <p>Créez votre besoin. Le tarif FoodForce est automatiquement appliqué.</p>
      </section>

      <form className="panel" onSubmit={(e) => e.preventDefault()}>
        <label>Métier
          <select value={job} onChange={(e) => setJob(e.target.value)}>
            {jobs.map(([name]) => <option key={name}>{name}</option>)}
          </select>
        </label>

        <div className="priceBox">
          <span>Tarif officiel Extra</span>
          <strong>{selected[1].toFixed(2)} MAD/h</strong>
          <small>Tarif verrouillé par FoodForce</small>
        </div>

        <div className="priceBox">
          <span>Tarif facturé à l'établissement TTC</span>
          <strong>{selected[2].toFixed(2)} MAD/h</strong>
          <small>Impossible à modifier</small>
        </div>

        <label>Nombre d'extras
          <input type="number" min="1" value={seats} onChange={(e) => setSeats(Number(e.target.value))} />
        </label>

        <label>Date
          <input type="date" required />
        </label>

        <div className="two">
          <label>Début<input type="time" required /></label>
          <label>Fin<input type="time" required /></label>
        </div>

        <label>Lieu
          <input placeholder="Adresse de l'établissement" required />
        </label>

        <label>Informations complémentaires
          <textarea placeholder="Tenue, consignes, événement..." rows={4} />
        </label>

        <button type="submit">Publier la mission</button>
      </form>
    </main>
  );
}
