"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

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
};

export default function PaiementsPro() {
  const [items, setItems] = useState<Payment[]>([]);
  const [message, setMessage] = useState("Chargement…");

  async function load() {
    const s = createClient();
    const { data, error } = await s
      .from("payment_records")
      .select(
        "id,mission_id,extra_id,hours,employer_hourly_ttc,employer_amount_ttc,status,provider,provider_reference,created_at",
      )
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Impossible de charger les paiements.");
    } else {
      setItems(data || []);
      setMessage("");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="appShell">
      <header className="appHeader">
        <Link className="brand" href="/">
          FOOD<span>FORCE</span>
        </Link>
        <div className="appName">PRO</div>
        <nav>
          <Link href="/pro">Accueil</Link>
          <Link href="/pro/candidatures">Candidatures</Link>
          <Link href="/pro/heures">Heures</Link>
        </nav>
      </header>

      <section className="pageIntro">
        <span className="eyebrow">FOODFORCE PRO</span>
        <h1>Paiements & facturation.</h1>
        <p>
          Les montants sont calculés automatiquement à partir des heures
          validées et de la grille officielle.
        </p>
      </section>

      <section className="missionGrid">
        {items.map((p) => (
          <article className="missionCard" key={p.id}>
            <span className={p.status === "paid" ? "tag acceptedTag" : "tag"}>
              {p.status}
            </span>
            <h3>{Number(p.employer_amount_ttc).toFixed(2)} MAD TTC</h3>
            <p>
              {p.hours} h × {Number(p.employer_hourly_ttc).toFixed(2)} MAD/h
            </p>
            <small>Référence extra : {p.extra_id.slice(0, 8)}…</small>
          </article>
        ))}
      </section>

      {message && <p className="statusMessage">{message}</p>}
    </main>
  );
}
