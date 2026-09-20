"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";
import { formatMad, paymentStatusLabel, sumBy } from "../../../lib/billing";
import { formatHours } from "../../../lib/mission-time";

type Payment = {
  id: string;
  mission_id: string;
  hours: number;
  candidate_hourly_rate: number;
  extra_amount: number;
  status: string;
  paid_at: string | null;
  created_at: string;
  missions: { city: string; starts_at: string; tariff_grid: { job: string } | null } | null;
};

export default function Paiements() {
  const [items, setItems] = useState<Payment[]>([]);
  const [message, setMessage] = useState("Chargement…");

  useEffect(() => {
    (async () => {
      const s = createClient();
      const { data: { user } } = await s.auth.getUser();
      if (!user) { location.href = "/connexion"; return; }

      const { data, error } = await s
        .from("payment_records")
        .select(
          "id,mission_id,hours,candidate_hourly_rate,extra_amount,status,paid_at,created_at,missions(city,starts_at,tariff_grid(job))",
        )
        .eq("extra_id", user.id)
        .order("created_at", { ascending: false });

      if (error) setMessage("Impossible de charger vos paiements : " + error.message);
      else { setItems((data || []) as unknown as Payment[]); setMessage(""); }
    })();
  }, []);

  const pending = items.filter((p) => p.status === "pending");
  const totalPending = sumBy(pending, (p) => p.extra_amount);
  const totalPaid = sumBy(items.filter((p) => p.status === "paid"), (p) => p.extra_amount);

  return (
    <main className="appShell">
      <header className="appHeader">
        <Link className="brand" href="/">FOOD<span>FORCE</span></Link>
        <div className="appName">EXTRAS</div>
        <nav>
          <Link href="/extras">Missions</Link>
          <Link href="/extras/mes-missions">Mes missions</Link>
          <Link href="/extras/profil">Profil</Link>
        </nav>
      </header>

      <section className="pageIntro">
        <span className="eyebrow">FOODFORCE EXTRAS</span>
        <h1>Mes revenus.</h1>
        <p>Les montants sont générés après validation de vos heures par l&apos;établissement.</p>
      </section>

      <section className="proGrid">
        <article className="proTile">
          <span>⏳</span>
          <b>{formatMad(totalPending)}</b>
          <small>En attente de versement ({pending.length})</small>
        </article>
        <article className="proTile">
          <span>✓</span>
          <b>{formatMad(totalPaid)}</b>
          <small>Déjà versé</small>
        </article>
      </section>

      <section className="missionGrid">
        {items.map((p) => (
          <article className="missionCard" key={p.id}>
            <div className="missionTop">
              <span className={p.status === "paid" ? "tag acceptedTag" : "tag"}>{paymentStatusLabel(p.status)}</span>
              <span>{p.missions?.city}</span>
            </div>
            <h3>{p.missions?.tariff_grid?.job || "Mission"}</h3>
            <div className="missionBottom">
              <strong>{formatMad(Number(p.extra_amount))}</strong>
              <span>{formatHours(Number(p.hours))} × {Number(p.candidate_hourly_rate).toFixed(2)} MAD/h</span>
            </div>
            <small>
              {p.paid_at
                ? "Versé le " + new Date(p.paid_at).toLocaleDateString("fr-FR")
                : "En attente de versement"}
            </small>
          </article>
        ))}
      </section>

      {!items.length && !message && <p className="statusMessage">Aucun paiement pour le moment.</p>}
      {message && <p className="statusMessage">{message}</p>}
    </main>
  );
}
