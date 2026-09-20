"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

export default function Admin() {
  const [stats, setStats] = useState({
    profiles: 0,
    missions: 0,
    applications: 0,
    tariffs: 0,
  });
  const [message, setMessage] = useState("Chargement…");

  useEffect(() => {
    (async () => {
      const s = createClient();
      const {
        data: { user },
      } = await s.auth.getUser();

      if (!user) {
        location.href = "/connexion";
        return;
      }

      const { data: p } = await s
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (p?.role !== "admin") {
        location.href = "/";
        return;
      }

      const [a, b, c, d] = await Promise.all([
        s.from("profiles").select("*", { count: "exact", head: true }),
        s.from("missions").select("*", { count: "exact", head: true }),
        s.from("applications").select("*", { count: "exact", head: true }),
        s.from("tariff_grid").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        profiles: a.count || 0,
        missions: b.count || 0,
        applications: c.count || 0,
        tariffs: d.count || 0,
      });
      setMessage("");
    })();
  }, []);

  return (
    <main className="appShell">
      <header className="appHeader">
        <Link className="brand" href="/">
          FOOD<span>FORCE</span>
        </Link>
        <div className="appName">ADMIN</div>
        <nav>
          <Link href="/admin/tarifs">Grille tarifaire</Link>
          <Link href="/">Accueil</Link>
        </nav>
      </header>

      <section className="pageIntro">
        <span className="eyebrow">FOODFORCE ADMIN</span>
        <h1>Pilotage.</h1>
        <p>Vue de contrôle de la plateforme.</p>
      </section>

      <section className="proGrid">
        <article className="proTile">
          <span>◎</span>
          <b>{stats.profiles}</b>
          <small>Profils</small>
        </article>
        <article className="proTile">
          <span>▣</span>
          <b>{stats.missions}</b>
          <small>Missions</small>
        </article>
        <article className="proTile">
          <span>◉</span>
          <b>{stats.applications}</b>
          <small>Candidatures</small>
        </article>
        <article className="proTile">
          <span>€</span>
          <b>{stats.tariffs}</b>
          <small>Métiers tarifés</small>
        </article>
      </section>

      {message && <p className="statusMessage">{message}</p>}

      <div className="lockedNotice">
        🔒
        <div>
          <b>Accès administrateur</b>
          <span>
            Les tarifs officiels sont consultables ici mais ne sont jamais
            modifiables par un établissement.
          </span>
        </div>
      </div>
    </main>
  );
}
