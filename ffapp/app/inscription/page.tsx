"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

export default function Inscription() {
  const [role, setRole] = useState<"extra" | "pro">("extra");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");

  async function signup(e: FormEvent) {
    e.preventDefault();
    setMessage("Création du compte…");

    const s = createClient();
    const { data, error } = await s.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: name,
          city,
          phone,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (photo && data.user && data.session) {
      const ext = photo.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = data.user.id + "/profile." + ext;
      const { error: uploadError } = await s.storage.from("avatars").upload(path, photo, {
        contentType: photo.type,
        upsert: true,
      });
      if (uploadError) {
        setMessage("Compte créé, mais la photo n'a pas pu être enregistrée.");
        return;
      }
      await s.from("profiles").update({ avatar_url: path }).eq("id", data.user.id);
    }

    setMessage(
      "Compte créé. Vérifiez votre email si une confirmation est demandée.",
    );
  }

  return (
    <main className="appShell">
      <header className="appHeader">
        <Link className="brand" href="/">
          FOOD<span>FORCE</span>
        </Link>
        <div className="appName">INSCRIPTION</div>
        <nav>
          <Link href="/">Accueil</Link>
          <Link href="/connexion">Connexion</Link>
        </nav>
      </header>

      <section className="pageIntro">
        <span className="eyebrow">FOODFORCE</span>
        <h1>Créer votre espace.</h1>
        <p>
          Un compte Extra pour trouver des missions ou un compte Pro pour
          recruter.
        </p>
      </section>

      <form className="panel formPanel" onSubmit={signup}>
        <label>
          Votre espace
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "extra" | "pro")
            }
          >
            <option value="extra">
              FoodForce Extras — je cherche des missions
            </option>
            <option value="pro">
              FoodForce Pro — je recrute des extras
            </option>
          </select>
        </label>

        <label>
          {role === "extra" ? "Nom et prénom" : "Nom / établissement"}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        {role === "extra" && (
          <label>
            Photo de profil
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            />
            <small>Photo nette de vous, 1 Mo maximum.</small>
          </label>
        )}

        <label>
          Téléphone
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+212 6 00 00 00 00"
            required
          />
        </label>

        <label>
          Ville
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Mot de passe
          <input
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button>Créer mon compte</button>

        {message && <p className="statusMessage">{message}</p>}
      </form>
    </main>
  );
}
