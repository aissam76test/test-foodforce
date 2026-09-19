"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

const jobs = [
  ["Serveur", 36.060209, 54.090314],
  ["Runner", 30.366492, 45.549738],
  ["Barman", 43.651832, 65.477749],
  ["Chef de partie", 68.324607, 102.486911],
  ["Commis de cuisine", 32.264398, 48.396597],
] as const;

export default function NouvelleMission() {
  const [job, setJob] = useState<string>(jobs[0][0]);
  const [seats, setSeats] = useState(1);
  const [status, setStatus] = useState("");
  const selected = useMemo(() => jobs.find((x) => x[0] === job) ?? jobs[0], [job]);

  async function publishMission(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Publication en cours…");
    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data: tariff } = await supabase
      .from("tariff_grid")
      .select("id")
      .eq("job", job)
      .eq("active", true)
      .single();

    if (!tariff) {
      setStatus("Tarif introuvable.");
      return;
    }

    const date = String(form.get("date"));
    const start = String(form.get("start"));
    const end = String(form.get("end"));

    const { error } = await supabase.rpc("create_mission", {
      p_tariff_id: tariff.id,
      p_city: String(form.get("city")),
      p_starts_at: date + "T" + start + ":00",
      p_ends_at: date + "T" + end + ":00",
      p_seats: seats,
      p_notes: String(form.get("notes") || ""),
    });

    setStatus(error ? "Erreur : " + error.message : "Mission publiée avec le tarif officiel FoodForce.");
  }

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

      <form className="panel" onSubmit={publishMission}>
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
          <input name="date" type="date" required />
        </label>

        <div className="two">
          <label>Début<input name="start" type="time" required /></label>
          <label>Fin<input name="end" type="time" required /></label>
        </div>

        <label>Lieu
          <input name="city" placeholder="Ville / adresse de l'établissement" required />
        </label>

        <label>Informations complémentaires
          <textarea name="notes" placeholder="Tenue, consignes, événement..." rows={4} />
        </label>

        <button type="submit">Publier la mission</button>
        {status && <p>{status}</p>}
      </form>
    </main>
  );
}
