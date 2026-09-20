"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type N = {
  id: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
};

export default function Notifications() {
  const [items, setItems] = useState<N[]>([]);

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

      const { data } = await s
        .from("notifications")
        .select("id,title,body,read_at,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setItems(data || []);
    })();
  }, []);

  async function read(id: string) {
    const s = createClient();
    await s
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id);

    setItems(
      items.map((n) =>
        n.id === id
          ? { ...n, read_at: new Date().toISOString() }
          : n,
      ),
    );
  }

  return (
    <main className="appShell">
      <header className="appHeader">
        <Link className="brand" href="/">
          FOOD<span>FORCE</span>
        </Link>
        <div className="appName">EXTRAS</div>
        <nav>
          <Link href="/extras">Missions</Link>
          <Link href="/extras/mes-missions">Mes missions</Link>
          <Link href="/extras/profil">Profil</Link>
        </nav>
      </header>

      <section className="pageIntro">
        <span className="eyebrow">FOODFORCE EXTRAS</span>
        <h1>Notifications.</h1>
        <p>
          Les changements importants sur vos candidatures apparaissent ici.
        </p>
      </section>

      <section className="missionGrid">
        {items.map((n) => (
          <article className="missionCard" key={n.id}>
            <span className={n.read_at ? "tag" : "tag acceptedTag"}>
              {n.read_at ? "LUE" : "NOUVELLE"}
            </span>
            <h3>{n.title}</h3>
            <p>{n.body}</p>
            <small>{new Date(n.created_at).toLocaleString("fr-FR")}</small>
            {!n.read_at && (
              <button className="primaryBtn" onClick={() => read(n.id)}>
                Marquer comme lue
              </button>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
