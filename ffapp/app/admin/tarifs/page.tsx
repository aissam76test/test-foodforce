"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";
import { deriveFromCandidateRate } from "../../../packages/tariffs";

// Seules id, job, candidate_rate, employer_ttc et active sont exposées aux
// clients navigateur (grants colonne par colonne). Les autres valeurs de la
// grille sont reconstituées avec la formule officielle.
type Tariff = { id: number; job: string; candidate_rate: number; employer_ttc: number; active: boolean };

export default function Tarifs() {
  const [items, setItems] = useState<Tariff[]>([]);
  const [message, setMessage] = useState("Chargement…");

  useEffect(() => {
    (async () => {
      const s = createClient();
      const { data: { user } } = await s.auth.getUser();
      if (!user) { location.href = "/connexion"; return; }

      const { data: p } = await s.from("profiles").select("role").eq("id", user.id).single();
      if (p?.role !== "admin") { location.href = "/"; return; }

      const { data, error } = await s
        .from("tariff_grid")
        .select("id,job,candidate_rate,employer_ttc,active")
        .order("job");

      if (error) setMessage("Impossible de charger la grille : " + error.message);
      else { setItems((data || []) as Tariff[]); setMessage(""); }
    })();
  }, []);

  return (
    <main className="appShell">
      <header className="appHeader">
        <Link className="brand" href="/">FOOD<span>FORCE</span></Link>
        <div className="appName">ADMIN</div>
        <nav><Link href="/admin">Dashboard</Link></nav>
      </header>

      <section className="pageIntro">
        <span className="eyebrow">GRILLE OFFICIELLE</span>
        <h1>Tarifs FoodForce.</h1>
        <p>{items.length} métier(s) · lecture seule · tarifs verrouillés côté serveur.</p>
      </section>

      <section className="panel">
        {items.map((t) => {
          const d = deriveFromCandidateRate(Number(t.candidate_rate));
          return (
            <div className="row" key={t.id}>
              <span>
                <b>{t.job}{t.active ? "" : " · inactif"}</b>
                <small style={{ display: "block", color: "#7a848b" }}>
                  Base {d.avgRate.toFixed(2)} · Extra {Number(t.candidate_rate).toFixed(2)} ·
                  HT {d.employerHt.toFixed(2)} · TVA {d.vat.toFixed(2)}
                </small>
              </span>
              <b>{Number(t.employer_ttc).toFixed(2)} MAD/h TTC</b>
            </div>
          );
        })}
      </section>

      {message && <p className="statusMessage">{message}</p>}
    </main>
  );
}
