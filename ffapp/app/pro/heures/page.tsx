"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";
import { formatHours, formatMissionSlot, missionHours } from "../../../lib/mission-time";

type App = {
  id: string;
  extra_id: string;
  mission_id: string;
  status: string;
  missions: {
    city: string;
    starts_at: string;
    ends_at: string;
    candidate_rate: number;
    employer_ttc: number;
    tariff_grid: { job: string } | null;
  } | null;
};

type Worked = { mission_id: string; extra_id: string; hours: number };

export default function Heures() {
  const [apps, setApps] = useState<App[]>([]);
  const [worked, setWorked] = useState<Worked[]>([]);
  const [hours, setHours] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("Chargement…");

  async function load() {
    const s = createClient();
    const [a, w] = await Promise.all([
      s
        .from("applications")
        .select(
          "id,extra_id,mission_id,status,missions(city,starts_at,ends_at,candidate_rate,employer_ttc,tariff_grid(job))",
        )
        .eq("status", "accepted")
        .order("created_at", { ascending: false }),
      s.from("worked_hours").select("mission_id,extra_id,hours"),
    ]);

    if (a.error) {
      setMessage("Impossible de charger les heures : " + a.error.message);
      return;
    }

    const rows = (a.data || []) as unknown as App[];
    setApps(rows);
    setWorked((w.data || []) as Worked[]);
    // Pré-remplissage avec la durée prévue, service de nuit inclus.
    setHours((prev) => {
      const next = { ...prev };
      for (const r of rows) {
        if (next[r.id] === undefined) {
          const planned = missionHours(r.missions?.starts_at, r.missions?.ends_at);
          next[r.id] = planned ? String(Math.round(planned * 2) / 2) : "";
        }
      }
      return next;
    });
    setMessage("");
  }

  useEffect(() => {
    load();
  }, []);

  function validatedHours(a: App) {
    return worked.find((w) => w.mission_id === a.mission_id && w.extra_id === a.extra_id);
  }

  async function validate(a: App) {
    const value = Number(hours[a.id]);

    if (!value || value <= 0) {
      setMessage("Indiquez le nombre d'heures.");
      return;
    }

    setBusy(a.id);
    setMessage("Validation en cours…");
    const s = createClient();
    const { data, error } = await s.rpc("validate_worked_hours", {
      p_mission_id: a.mission_id,
      p_extra_id: a.extra_id,
      p_hours: value,
    });

    if (error) {
      setBusy(null);
      setMessage("Erreur : " + error.message);
      return;
    }

    const { error: paymentError } = await s.rpc("create_payment_record", {
      p_worked_hours_id: (data as { id: string }).id,
    });

    setBusy(null);
    setMessage(
      paymentError
        ? "Heures validées. La ligne de paiement n'a pas pu être créée : " + paymentError.message
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
        <p>
          Validez les heures réellement effectuées. La durée prévue est
          pré-remplie, y compris pour les services qui se terminent après minuit.
        </p>
      </section>

      <section className="missionGrid">
        {apps.map((a) => {
          const done = validatedHours(a);
          const planned = missionHours(a.missions?.starts_at, a.missions?.ends_at);
          const employerTtc = Number(a.missions?.employer_ttc || 0);
          const saisie = Number(hours[a.id] || 0);

          return (
            <article className="missionCard" key={a.id}>
              <span className="tag acceptedTag">{done ? "HEURES VALIDÉES" : "ACCEPTÉ"}</span>
              <h3>{a.missions?.tariff_grid?.job || "Mission"}</h3>
              <p className="missionTime">
                {a.missions?.city} · {formatMissionSlot(a.missions?.starts_at, a.missions?.ends_at)}
              </p>

              <div className="anonymous">
                <span>⏱</span>
                <div>
                  <b>Extra sélectionné</b>
                  <small>Référence : {a.extra_id.slice(0, 8)}…</small>
                </div>
              </div>

              {done ? (
                <p>
                  <b>{formatHours(Number(done.hours))} validées</b>
                  <br />
                  <small>
                    Facturé : {(Number(done.hours) * employerTtc).toFixed(2)} MAD TTC
                  </small>
                </p>
              ) : (
                <>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    placeholder={planned ? `Prévu : ${formatHours(planned)}` : "Nombre d'heures"}
                    value={hours[a.id] || ""}
                    onChange={(e) => setHours({ ...hours, [a.id]: e.target.value })}
                  />
                  {saisie > 0 && (
                    <small>
                      À facturer : {(saisie * employerTtc).toFixed(2)} MAD TTC
                    </small>
                  )}
                  <button
                    className="primaryBtn"
                    disabled={busy === a.id}
                    onClick={() => validate(a)}
                  >
                    {busy === a.id ? "Validation…" : "Valider les heures"}
                  </button>
                </>
              )}
            </article>
          );
        })}
      </section>

      {message && <p className="statusMessage">{message}</p>}
    </main>
  );
}
