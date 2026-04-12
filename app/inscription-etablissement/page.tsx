'use client';
import { useState } from 'react';
import { signIn } from "next-auth/react";

export default function InscriptionEtablissement() {
  const [etape, setEtape] = useState(1);
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    nom: '', telephone: '', type: '', adresse: '', ville: 'Casablanca'
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEtape1 = (e: any) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (form.password.length < 6) {
      setError('Minimum 6 caractères');
      return;
    }
    setError('');
    setEtape(2);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/inscription-etablissement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) setSent(true);
    else setLoading(false);
  };

  const inputStyle: any = {
    width: '100%', padding: '12px', borderRadius: '8px',
    border: '1px solid #ddd', marginBottom: '14px',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Poppins, sans-serif'
  };

  if (sent) return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#FDF0E8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center', background: 'white', borderRadius: '18px', padding: '48px 32px', maxWidth: '420px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', marginBottom: '12px' }}>Compte créé !</h1>
        <p style={{ color: '#666', marginBottom: '24px', lineHeight: 1.6 }}>Votre dossier est en cours de vérification. Notre équipe vous contacte sous 48h.</p>
        <a href="/login" style={{ background: '#F47C20', color: 'white', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', display: 'inline-block' }}>
          Se connecter
        </a>
      </div>
    </main>
  );

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#FDF0E8', minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: '420px', margin: '0 auto', background: 'white', borderRadius: '18px', padding: '32px 28px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontWeight: 800, fontSize: '22px', color: '#1a1a1a' }}>Food</span>
            <span style={{ fontWeight: 800, fontSize: '22px', color: '#F47C20' }}>Force</span>
          </a>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 800, textAlign: 'center', marginBottom: '6px' }}>
          Créer un compte recruteur
        </h1>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '26px' }}>
          Trouvez les talents dont vous avez besoin
        </p>

        {etape === 1 && (
          <>
            {/* GOOGLE BUTTON */}
            <button
              onClick={() => signIn("google", { callbackUrl: '/espace-etablissement' })}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', borderRadius: '10px', border: '1px solid #e5e5e5', background: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer', marginBottom: '18px', fontFamily: 'Poppins, sans-serif' }}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" style={{ width: '18px' }} />
              Continuer avec Google
            </button>

            {/* SEPARATOR */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ flex: 1, height: '1px', background: '#eee' }} />
              <span style={{ margin: '0 10px', fontSize: '12px', color: '#999' }}>OU</span>
              <div style={{ flex: 1, height: '1px', background: '#eee' }} />
            </div>

            {/* FORM ETAPE 1 */}
            <form onSubmit={handleEtape1}>
              {error && (
                <div style={{ background: '#fee', color: '#c00', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px' }}>
                  {error}
                </div>
              )}

              <input type="email" placeholder="Email professionnel" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />

              <input type="password" placeholder="Mot de passe (min. 6 caractères)" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} style={inputStyle} />

              <input type="password" placeholder="Confirmer le mot de passe" required value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} style={{ ...inputStyle, marginBottom: '18px' }} />

              <button type="submit" style={{ width: '100%', background: '#F47C20', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '15px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                Continuer →
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#666' }}>
              Déjà un compte ? <a href="/login" style={{ color: '#F47C20', fontWeight: 600 }}>Se connecter</a>
            </p>
          </>
        )}

        {etape === 2 && (
          <>
            {/* STEPPER */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#22c55e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' }}>✓</div>
              <div style={{ flex: 1, height: '2px', background: '#F47C20' }} />
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#F47C20', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' }}>2</div>
            </div>

            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Informations de l'établissement</h2>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>Renseignez les informations de votre établissement</p>

            <form onSubmit={handleSubmit}>
              <input required placeholder="Nom de l'établissement" value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })} style={inputStyle} />

              <input required placeholder="Téléphone" value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })} style={inputStyle} />

              <select required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                <option value="">Type d'établissement</option>
                <option value="restaurant">Restaurant</option>
                <option value="hotel">Hôtel</option>
                <option value="cafe">Café</option>
                <option value="traiteur">Traiteur</option>
                <option value="evenementiel">Événementiel</option>
                <option value="brasserie">Brasserie</option>
                <option value="fastfood">Fast Food</option>
              </select>

              <select required value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} style={inputStyle}>
                <option value="Casablanca">Casablanca</option>
                <option value="Rabat">Rabat</option>
                <option value="Marrakech">Marrakech</option>
                <option value="Tanger">Tanger</option>
                <option value="Agadir">Agadir</option>
                <option value="Fès">Fès</option>
              </select>

              <input placeholder="Adresse (optionnel)" value={form.adresse}
                onChange={(e) => setForm({ ...form, adresse: e.target.value })} style={{ ...inputStyle, marginBottom: '20px' }} />

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setEtape(1)}
                  style={{ flex: 1, background: '#f5f5f5', color: '#1a1a1a', padding: '14px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                  ← Retour
                </button>
                <button type="submit" disabled={loading}
                  style={{ flex: 2, background: '#F47C20', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'Poppins, sans-serif' }}>
                  {loading ? 'Création...' : 'Créer mon compte'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}