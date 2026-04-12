'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function InscriptionExtra() {
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (form.password.length < 6) {
      setError("Minimum 6 caractères");
      return;
    }
    setError("");

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/profil`
      }
    });

    if (error) {
      setError(error.message);
    } else {
      window.location.href = '/profil';
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/profil`
      }
    });
  };

  return (
    <main style={{ fontFamily: "Poppins, sans-serif", background: "#FDF0E8", minHeight: "100vh", padding: "40px 16px" }}>
      <div style={{ maxWidth: "420px", margin: "0 auto", background: "white", borderRadius: "18px", padding: "32px 28px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>

        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontWeight: 800, fontSize: "22px", color: "#1a1a1a" }}>Food</span>
            <span style={{ fontWeight: 800, fontSize: "22px", color: "#F47C20" }}>Force</span>
          </a>
        </div>

        <h1 style={{ fontSize: "22px", fontWeight: 800, textAlign: "center", marginBottom: "6px" }}>
          Créer un compte candidat
        </h1>
        <p style={{ textAlign: "center", color: "#666", fontSize: "14px", marginBottom: "26px" }}>
          Trouvez des opportunités qui vous correspondent
        </p>

        {/* GOOGLE BUTTON */}
        <button onClick={handleGoogle}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "14px", borderRadius: "10px", border: "1px solid #e5e5e5", background: "#fff", fontWeight: 600, fontSize: "14px", cursor: "pointer", marginBottom: "18px", fontFamily: "Poppins, sans-serif" }}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" style={{ width: "18px" }} />
          Continuer avec Google
        </button>

        {/* SEPARATOR */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "18px" }}>
          <div style={{ flex: 1, height: "1px", background: "#eee" }} />
          <span style={{ margin: "0 10px", fontSize: "12px", color: "#999" }}>OU</span>
          <div style={{ flex: 1, height: "1px", background: "#eee" }} />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: "#fee", color: "#c00", padding: "10px", borderRadius: "8px", marginBottom: "14px", fontSize: "13px" }}>
              {error}
            </div>
          )}

          <input type="email" placeholder="Email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "14px", fontSize: "14px", outline: "none", boxSizing: "border-box" as any }} />

          <input type="password" placeholder="Mot de passe" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "14px", fontSize: "14px", outline: "none", boxSizing: "border-box" as any }} />

          <input type="password" placeholder="Confirmer le mot de passe" required value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "18px", fontSize: "14px", outline: "none", boxSizing: "border-box" as any }} />

          <button type="submit"
            style={{ width: "100%", background: "#F47C20", color: "white", padding: "14px", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "15px", cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
            Continuer →
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#666" }}>
          Déjà un compte ? <a href="/login" style={{ color: "#F47C20", fontWeight: 600 }}>Se connecter</a>
        </p>
      </div>
    </main>
  );
}