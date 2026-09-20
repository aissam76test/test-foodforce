"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type App = {
  id: string;
  extra_id: string;
  mission_id: string;
  status: string;
  missions: {
    city: string;
    starts_at: string;
    tariff_grid: { job: string } | null;
  } | null;
};

export default function Heures() {
  const [apps, setApps] = useState<App[]>([]);
  const [hours, setHours] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("Chargement…");

  async function load() {
    const s = createClient();
    const { data, error } = await s
      .from("applications")
      .select("id,extra_id,mission_id,status,missions(city,starts_at,tariff_grid(job))")
      .eq("status", "accepted")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Impossible de charger les heures.");
    } else {
      setApps((data || []) as unknown as App[]);
      setMessage("");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function validate(a: App) {
    const value = Number(hours[a.id]);

    if (!value || value <= 0) {
      setMessage("Indiquez le nombre d'heures.");
      return;
    }

    const s = createClient();
    const { data, error } = await s.rpc("validate_worked_hours", {
      p_mission_id: a.mission_id,
      p_extra_id: a.extra_id,
      p_hours: value,
    });

    if (error) {
      setMessage("Erreur : " + error.message);
      return;
    }

    const { error: paymentError } = await s.rpc("create_payment_record", {
      p_worked_hours_id: (data as { id: string }).id,
    });

    setMessage(
      paymentError
        ? "Heures validées, mais paiement à préparer manuellement."
        : "Heures validées et paiement préparé ✅",
    );

    load();
  }

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
          <Link href="/pro/paiements">Paiements</Link>
        </nav>
      </header>

      <section className="pageIntro">
        <span className="eyebrow">FOODFORCE PRO</span>
        <h1>Heures travaillées.</h1>
        <p>Validez les heures réellement effectuées par les extras.</p>
      </section>

      <section className="missionGrid">
        {apps.map((a) => (
          <article className="missionCard" key={a.id}>
            <span className="tag acceptedTag">ACCEPTÉ</span>
            <h3>{a.missions?.tariff_grid?.job || "Mission"}</h3>
            <p className="missionTime">
              {a.missions?.city} ·{" "}
              {a.missions?.starts_at
                ? new Date(a.missions.starts_at).toLocaleString("fr-FR")
                : ""}
            </p>

            <div className="anonymous">
              <span>⏱</span>
              <div>
                <b>Extra sélectionné</b>
                <small>Référence : {a.extra_id.slice(0, 8)}…</small>
              </div>
            </div>

            <input
              type="number"
              min="0.5"
              step="0.5"
              placeholder="Nombre d'heures"
              value={hours[a.id] || ""}
              onChange={(e) =>
                setHours({ ...hours, [a.id]: e.target.value })
              }
            />
            <button className="primaryBtn" onClick={() => validate(a)}>
              Valider les heures
            </button>
          </article>
        ))}
      </section>

      {message && <p className="statusMessage">{message}</p>}
    </main>
  );
}
