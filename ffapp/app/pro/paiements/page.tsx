"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";
import { formatMad, paymentStatusLabel, sumBy } from "../../../lib/billing";
import { formatHours } from "../../../lib/mission-time";

type Payment = {
  id: string;
  mission_id: string;
  extra_id: string;
  hours: number;
  employer_hourly_ttc: number;
  employer_amount_ttc: number;
  status: string;
  provider: string | null;
  provider_reference: string | null;
  created_at: string;
  missions: { city: string; starts_at: string; tariff_grid: { job: string } | null } | null;
};

export default function PaiementsPro() {
  const [items, setItems] = useState<Payment[]>([]);
  const [message, setMessage] = useState("Chargement…");

  useEffect(() => {
    (async () => {
      const s = createClient();
      const { data, error } = await s
        .from("payment_records")
        .select(
          "id,mission_id,extra_id,hours,employer_hourly_ttc,employer_amount_ttc,status,provider,provider_reference,created_at,missions(city,starts_at,tariff_grid(job))",
        )
        .order("created_at", { ascending: false });

      if (error) setMessage("Impossible de charger les paiements : " + error.message);
      else { setItems((data || []) as unknown as Payment[]); setMessage(""); }
    })();
  }, []);

  const due = items.filter((p) => p.status === "pending");
  const totalDue = sumBy(due, (p) => p.employer_amount_ttc);
  const totalPaid = sumBy(items.filter((p) => p.status === "paid"), (p) => p.employer_amount_ttc);

  return (
    <main className="appShell">
      <header className="appHeader">
        <Link className="brand" href="/">FOOD<span>FORCE</span></Link>
        <div className="appName">PRO</div>
        <nav>
          <Link href="/pro">Accueil</Link>
          <Link href="/pro/candidatures">Candidatures</Link>
          <Link href="/pro/heures">Heures</Link>
        </nav>
      </header>

      <section className="pageIntro">
        <span className="eyebrow">FOODFORCE PRO</span>
        <h1>Paiements &amp; facturation.</h1>
        <p>Les montants sont calculés à partir des heures validées et du tarif officiel figé à la publication de la mission.</p>
      </section>

      <section className="proGrid">
        <article className="proTile">
          <span>🧾</span>
          <b>{formatMad(totalDue)}</b>
          <small>Restant à régler ({due.length} ligne(s))</small>
        </article>
        <article className="proTile">
          <span>✓</span>
          <b>{formatMad(totalPaid)}</b>
          <small>Déjà réglé</small>
        </article>
      </section>

      <section className="missionGrid">
        {items.map((p) => (
          <article className="missionCard" key={p.id}>
            <div className="missionTop">
              <span className={p.status === "paid" ? "tag acceptedTag" : "tag"}>{paymentStatusLabel(p.status)}</span>
              <span>{new Date(p.created_at).toLocaleDateString("fr-FR")}</span>
            </div>
            <h3>{p.missions?.tariff_grid?.job || "Mission"}</h3>
            <p className="missionTime">
              {p.missions?.city}
              {p.missions?.starts_at ? " · " + new Date(p.missions.starts_at).toLocaleDateString("fr-FR") : ""}
            </p>
            <div className="missionBottom">
              <strong>{formatMad(Number(p.employer_amount_ttc))} <small>TTC</small></strong>
              <span>{formatHours(Number(p.hours))} × {Number(p.employer_hourly_ttc).toFixed(2)} MAD/h</span>
            </div>
            <small>
              Référence extra : {p.extra_id.slice(0, 8)}…
              {p.provider_reference ? " · " + p.provider_reference : ""}
            </small>
          </article>
        ))}
      </section>

      {!items.length && !message && <p className="statusMessage">Aucun paiement pour le moment.</p>}
      {message && <p className="statusMessage">{message}</p>}
    </main>
  );
}
