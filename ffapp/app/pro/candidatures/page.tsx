"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type Application = {
  id: string;
  status: string;
  created_at: string;
  extra_id: string;
  mission_id: string;
  missions: {
    id: string;
    city: string;
    starts_at: string;
    tariff_grid: { job: string } | null;
  } | null;
};

export default function Candidatures() {
  const [apps, setApps] = useState<Application[]>([]);
  const [message, setMessage] = useState("Chargement…");

  async function load() {
    const s = createClient();
    const { data, error } = await s
      .from("applications")
      .select(
        "id,status,created_at,extra_id,mission_id,missions(id,city,starts_at,tariff_grid(job))",
      )
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Impossible de charger les candidatures.");
    } else {
      setApps((data || []) as unknown as Application[]);
      setMessage("");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(id: string, status: "accepted" | "rejected") {
    const s = createClient();
    const { error } = await s.rpc("decide_application", {
      p_application_id: id,
      p_status: status,
    });

    if (error) {
      setMessage("Erreur : " + error.message);
    } else {
      setMessage(
        status === "accepted"
          ? "Extra accepté ✅"
          : "Candidature refusée",
      );
      load();
    }
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
          <Link href="/pro/heures">Heures</Link>
          <Link href="/pro/profil">Profil</Link>
        </nav>
      </header>

      <section className="pageIntro">
        <span className="eyebrow">FOODFORCE PRO</span>
        <h1>Candidatures.</h1>
        <p>Les extras qui ont postulé à vos missions.</p>
      </section>

      <section className="missionGrid">
        {apps.map((a) => (
          <article className="missionCard" key={a.id}>
            <div className="missionTop">
              <span
                className={
                  a.status === "accepted" ? "tag acceptedTag" : "tag"
                }
              >
                {a.status}
              </span>
              <span>{a.missions?.city}</span>
            </div>

            <h3>{a.missions?.tariff_grid?.job || "Mission"}</h3>

            <p className="missionTime">
              {a.missions?.starts_at
                ? new Date(a.missions.starts_at).toLocaleString("fr-FR")
                : ""}
            </p>

            <div className="anonymous">
              <span>👤</span>
              <div>
                <b>Extra candidat</b>
                <small>Profil candidat : {a.extra_id.slice(0, 8)}…</small>
              </div>
            </div>

            {a.status === "pending" && (
              <div className="heroActions">
                <button
                  className="primaryBtn"
                  onClick={() => decide(a.id, "accepted")}
                >
                  Accepter
                </button>
                <button
                  className="secondaryBtn"
                  onClick={() => decide(a.id, "rejected")}
                >
                  Refuser
                </button>
              </div>
            )}
          </article>
        ))}
      </section>

      {message && <p className="statusMessage">{message}</p>}
    </main>
  );
}
