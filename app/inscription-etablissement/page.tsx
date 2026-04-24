'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function InscriptionEtablissement() {
  const [etape, setEtape] = useState(1);
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    nom: '', telephone: '', type: '', adresse: '', ville: 'Casablanca'
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/upload-documents-etablissement`
      }
    });
  };

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
        <p style={{ color: '#666', marginBottom: '24px', lineHeight: 1.6 }}>Veuillez maintenant uploader vos documents pour validation.</p>
        <a href="/upload-documents-etablissement" style={{ background: '#F47C20', color: 'white', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', display: 'inline-block' }}>
          Uploader mes documents →
        </a>
      </div>
    </main>
  );

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#FDF0E8', minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: '420px', margin: '0 auto', background: 'white', borderRadius: '18px', padding: '32px 28px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>

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
            <button onClick={handleGoogle}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', borderRadius: '10px', border: '1px solid #e5e5e5', background: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer', marginBottom: '18px', fontFamily: 'Poppins, sans-serif' }}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3Z"/></svg>
              Continuer avec Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ flex: 1, height: '1px', background: '#eee' }} />
              <span style={{ margin: '0 10px', fontSize: '12px', color: '#999' }}>OU</span>
              <div style={{ flex: 1, height: '1px', background: '#eee' }} />
            </div>

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

              <button type="submit"
                style={{ width: '100%', background: '#F47C20', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '15px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
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