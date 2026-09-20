"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

export default function Pro() {
  const [stats, setStats] = useState({
    missions: 0,
    applications: 0,
    hours: 0,
  });

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

      const { data: profile } = await s
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "pro") {
        location.href = "/";
        return;
      }

      const { data: missions } = await s
        .from("missions")
        .select("id")
        .eq("pro_id", user.id);

      const missionIds = (missions || []).map((m) => m.id);

      let applications = 0;
      let hours = 0;

      if (missionIds.length) {
        const { count: applicationCount } = await s
          .from("applications")
          .select("id", { count: "exact", head: true })
          .in("mission_id", missionIds)
          .eq("status", "pending");

        const { count: hourCount } = await s
          .from("worked_hours")
          .select("id", { count: "exact", head: true })
          .in("mission_id", missionIds)
          .eq("status", "submitted");

        applications = applicationCount || 0;
        hours = hourCount || 0;
      }

      setStats({
        missions: missionIds.length,
        applications,
        hours,
      });
    })();
  }, []);

  async function logout() {
    const s = createClient();
    await s.auth.signOut();
    location.href = "/connexion";
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
          <Link href="/pro/heures">Heures</Link>
          <Link href="/pro/profil">Profil</Link>
          <button className="secondaryBtn" onClick={logout}>
            Déconnexion
          </button>
        </nav>
      </header>

      <section className="appHero proHero">
        <div>
          <p className="eyebrow">FOODFORCE PRO</p>
          <h1>
            Renforcez votre équipe,
            <br />
            <span>simplement.</span>
          </h1>
          <p>
            Publiez vos besoins, recevez des candidatures et gérez vos extras
            depuis un seul espace.
          </p>
          <Link className="primaryBtn" href="/pro/nouvelle-mission">
            + Publier une mission
          </Link>
        </div>

        <div className="proStats">
          <div>
            <b>{stats.missions}</b>
            <span>Missions en cours</span>
          </div>
          <div>
            <b>{stats.applications}</b>
            <span>Candidatures</span>
          </div>
          <div>
            <b>{stats.hours}</b>
            <span>Heures à valider</span>
          </div>
        </div>
      </section>

      <section className="proGrid">
        <Link className="proTile" href="/pro/nouvelle-mission">
          <span>＋</span>
          <b>Publier une mission</b>
          <small>
            Choisissez un métier et vos horaires. Le tarif FoodForce est
            automatique.
          </small>
        </Link>

        <Link className="proTile" href="/pro/candidatures">
          <span>◉</span>
          <b>Gérer les candidatures</b>
          <small>
            Sélectionnez vos extras et révélez les informations nécessaires
            après acceptation.
          </small>
        </Link>

        <Link className="proTile" href="/pro/heures">
          <span>✓</span>
          <b>Valider les heures</b>
          <small>
            Validez les heures réalisées pour déclencher la suite du paiement.
          </small>
        </Link>

        <Link className="proTile" href="/pro/paiements">
          <span>€</span>
          <b>Paiements & factures</b>
          <small>
            Retrouvez les montants calculés avec la grille officielle.
          </small>
        </Link>
      </section>

      <div className="lockedNotice">
        🔒
        <div>
          <b>Tarifs FoodForce verrouillés</b>
          <span>
            Le Pro choisit le métier, mais ne peut jamais modifier le tarif
            horaire. Le montant est imposé côté serveur.
          </span>
        </div>
      </div>
    </main>
  );
}
