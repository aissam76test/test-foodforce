"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

type Stats = { profiles: number; missions: number; applications: number; tariffs: number };
type Billing = { count: number; pending: number; employerTtc: number; extraAmount: number };

const EMPTY_BILLING: Billing = { count: 0, pending: 0, employerTtc: 0, extraAmount: 0 };

export default function Admin() {
  const [stats, setStats] = useState<Stats>({ profiles: 0, missions: 0, applications: 0, tariffs: 0 });
  const [billing, setBilling] = useState<Billing>(EMPTY_BILLING);
  const [message, setMessage] = useState("Chargement…");

  useEffect(() => {
    (async () => {
      const s = createClient();
      const { data: { user } } = await s.auth.getUser();
      if (!user) { location.href = "/connexion"; return; }

      const { data: p } = await s.from("profiles").select("role").eq("id", user.id).single();
      if (p?.role !== "admin") { location.href = "/"; return; }

      // Les comptages portent sur une colonne explicitement autorisée :
      // `select=*` échoue depuis que les droits sont accordés colonne par colonne.
      const [a, b, c, d, pay] = await Promise.all([
        s.from("profiles").select("id", { count: "exact", head: true }),
        s.from("missions").select("id", { count: "exact", head: true }),
        s.from("applications").select("id", { count: "exact", head: true }),
        s.from("tariff_grid").select("id", { count: "exact", head: true }),
        s.from("payment_records").select("status,employer_amount_ttc,extra_amount"),
      ]);

      setStats({
        profiles: a.count || 0,
        missions: b.count || 0,
        applications: c.count || 0,
        tariffs: d.count || 0,
      });

      const rows = (pay.data || []) as { status: string; employer_amount_ttc: number; extra_amount: number }[];
      setBilling({
        count: rows.length,
        pending: rows.filter((r) => r.status === "pending").length,
        employerTtc: rows.reduce((t, r) => t + Number(r.employer_amount_ttc || 0), 0),
        extraAmount: rows.reduce((t, r) => t + Number(r.extra_amount || 0), 0),
      });

      const failed = [a, b, c, d, pay].map((r) => r.error?.message).filter(Boolean);
      setMessage(failed.length ? "Chargement partiel : " + failed.join(" · ") : "");
    })();
  }, []);

  const commission = billing.employerTtc / 1.2 - billing.extraAmount;

  return (
    <main className="appShell">
      <header className="appHeader">
        <Link className="brand" href="/">FOOD<span>FORCE</span></Link>
        <div className="appName">ADMIN</div>
        <nav>
          <Link href="/admin/tarifs">Grille tarifaire</Link>
          <Link href="/">Accueil</Link>
          <button className="secondaryBtn" onClick={async()=>{const s=createClient();await s.auth.signOut();location.href="/connexion";}}>Déconnexion</button>
        </nav>
      </header>

      <section className="pageIntro">
        <span className="eyebrow">FOODFORCE ADMIN</span>
        <h1>Pilotage.</h1>
        <p>Vue de contrôle de la plateforme.</p>
      </section>

      <section className="proGrid">
        <article className="proTile"><span>◎</span><b>{stats.profiles}</b><small>Profils</small></article>
        <article className="proTile"><span>▣</span><b>{stats.missions}</b><small>Missions</small></article>
        <article className="proTile"><span>◉</span><b>{stats.applications}</b><small>Candidatures</small></article>
        <article className="proTile"><span>€</span><b>{stats.tariffs}</b><small>Métiers tarifés</small></article>
      </section>

      <div className="sectionHead">
        <div><span className="eyebrow">FACTURATION</span><h2>Encours plateforme</h2></div>
        <span className="count">{billing.count} ligne(s) · {billing.pending} en attente</span>
      </div>

      <section className="proGrid">
        <article className="proTile">
          <span>🧾</span>
          <b>{billing.employerTtc.toFixed(2)} MAD</b>
          <small>Facturé aux établissements (TTC)</small>
        </article>
        <article className="proTile">
          <span>💸</span>
          <b>{billing.extraAmount.toFixed(2)} MAD</b>
          <small>À reverser aux extras</small>
        </article>
        <article className="proTile">
          <span>◆</span>
          <b>{commission.toFixed(2)} MAD</b>
          <small>Commission FoodForce (HT)</small>
        </article>
        <article className="proTile">
          <span>⏳</span>
          <b>{billing.pending}</b>
          <small>Paiements en attente</small>
        </article>
      </section>

      {message && <p className="statusMessage">{message}</p>}

      <div className="lockedNotice">
        🔒
        <div>
          <b>Accès administrateur</b>
          <span>Les tarifs officiels sont consultables ici mais ne sont jamais modifiables par un établissement.</span>
        </div>
      </div>
    </main>
  );
}
