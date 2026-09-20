"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

export default function ProfilExtra() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const s = createClient();
      const { data: { user } } = await s.auth.getUser();
      if (!user) {
        await new Promise(resolve => setTimeout(resolve, 800));
        const retry = await s.auth.getUser();
        if (!retry.data.user) { location.href = "/connexion"; return; }
        return;
      }
      const { data } = await s.from("profiles").select("full_name,phone,city,role,avatar_url").eq("id", user.id).single();
      if (!data) {
        setMessage("Impossible de charger votre profil. Réessayez dans quelques secondes.");
        return;
      }
      setName(data.full_name || "");
      setPhone(data.phone || "");
      setCity(data.city || "");
      if (data.avatar_url) setAvatarUrl(s.storage.from("avatars").getPublicUrl(data.avatar_url).data.publicUrl);
    })();
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    setMessage("Enregistrement…");
    const s = createClient();
    const { data: { user } } = await s.auth.getUser();
    if (!user) return;

    let avatarPath = "";
    if (photo) {
      if (photo.size > 1024 * 1024) { setMessage("Photo trop lourde : 1 Mo maximum."); return; }
      if (!["image/jpeg", "image/png", "image/webp"].includes(photo.type)) { setMessage("Format accepté : JPG, PNG ou WebP."); return; }
      const ext = photo.name.split(".").pop()?.toLowerCase() || "jpg";
      avatarPath = user.id + "/profile." + ext;
      const { error } = await s.storage.from("avatars").upload(avatarPath, photo, { contentType: photo.type, upsert: true });
      if (error) { setMessage(error.message); return; }
      setAvatarUrl(s.storage.from("avatars").getPublicUrl(avatarPath).data.publicUrl);
    }

    const update = avatarPath ? { full_name: name, phone, city, avatar_url: avatarPath } : { full_name: name, phone, city };
    const { error } = await s.from("profiles").update(update).eq("id", user.id);
    setMessage(error ? error.message : "Profil enregistré ✅");
  }

  return (
    <main className="dashboard">
      <header>
        <Link className="brand" href="/extras">FOOD<span>FORCE</span></Link>
        <nav><Link href="/extras">Missions</Link></nav>
      </header>

      <section className="hero profileHero">
        <div>
          <p className="eyebrow">FOODFORCE EXTRAS</p>
          <h1>Mon profil</h1>
          <p>Présentez-vous clairement pour recevoir les bonnes missions.</p>
        </div>
      </section>

      <form className="panel profilePanel" onSubmit={save}>
        <div className="profileTop">
          <div className="avatarPreview">
            {avatarUrl ? <img src={avatarUrl} alt="Photo de profil" /> : <span>{name ? name.charAt(0).toUpperCase() : "?"}</span>}
          </div>
          <div>
            <h2>Informations personnelles</h2>
            <p>Ces informations seront utilisées pour votre profil Extra.</p>
            <label className="photoLabel">Modifier la photo
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setPhoto(e.target.files?.[0] || null)} />
            </label>
            <small>JPG, PNG ou WebP · 1 Mo maximum</small>
          </div>
        </div>

        <div className="profileFields">
          <label>Nom complet<input value={name} onChange={e => setName(e.target.value)} required /></label>
          <label>Téléphone<input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+212 6 00 00 00 00" /></label>
          <label>Ville<input value={city} onChange={e => setCity(e.target.value)} required /></label>
        </div>

        <button className="profileSave">Enregistrer les modifications</button>
        {message && <p className="statusMessage">{message}</p>}
      </form>
    </main>
  );
}
