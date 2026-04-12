'use client';
import { useState } from 'react';

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
    width: '100%', padding: '12px 16px', borderRadius: '8px',
    border: '1.5px solid #eee', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif'
  };

  if (sent) return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#FDF0E8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center', background: 'white', borderRadius: '20px', padding: '48px 32px', maxWidth: '440px', width: '100%', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a1a', marginBottom: '12px' }}>Compte créé !</h1>
        <p style={{ color: '#666', marginBottom: '8px' }}>Votre dossier est en cours de vérification.</p>
        <p style={{ color: '#666', marginBottom: '24px' }}>Notre équipe vous contacte sous 48h.</p>
        <a href="/login" style={{ background: '#F47C20', color: 'white', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', display: 'inline-block' }}>
          Se connecter
        </a>
      </div>
    </main>
  );

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#FDF0E8', minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '32px 24px', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' }}>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontWeight: 800, fontSize: '22px', color: '#1a1a1a' }}>Food</span>
            <span style={{ fontWeight: 800, fontSize: '22px', color: '#F47C20' }}>Force</span>
          </a>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px', textAlign: 'center' }}>Créer un compte recruteur</h1>
        <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px', textAlign: 'center' }}>Trouvez les talents dont vous avez besoin</p>

        {/* STEPPER */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F47C20', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>1</div>
          <div style={{ flex: 1, height: '2px', background: etape === 2 ? '#F47C20' : '#eee' }} />
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: etape === 2 ? '#F47C20' : '#eee', color: etape === 2 ? 'white' : '#999', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>2</div>
        </div>

        {/* ÉTAPE 1 */}
        {etape === 1 && (
          <form onSubmit={handleEtape1}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Informations de connexion</h2>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>Créez vos identifiants de connexion</p>

            {error && <div style={{ background: '#fee', color: '#c00', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

            {[
              { key: 'email', label: 'Email professionnel *', type: 'email' },
              { key: 'password', label: 'Mot de passe *', type: 'password', placeholder: 'Minimum 6 caractères' },
              { key: 'confirmPassword', label: 'Confirmer le mot de passe *', type: 'password' },
            ].map((field) => (
              <div key={field.key} style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                <input type={field.type} required placeholder={field.placeholder || ''}
                  value={(form as any)[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  style={inputStyle} />
              </div>
            ))}

            <button type="submit" style={{ width: '100%', background: '#F47C20', color: 'white', padding: '16px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginTop: '8px', fontFamily: 'Poppins, sans-serif' }}>
              Continuer →
            </button>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#666' }}>
              Déjà un compte ? <a href="/login" style={{ color: '#F47C20', fontWeight: 600 }}>Se connecter</a>
            </p>
          </form>
        )}

        {/* ÉTAPE 2 */}
        {etape === 2 && (
          <form onSubmit={handleSubmit}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Informations de l'établissement</h2>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>Renseignez les informations de votre établissement</p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Nom de l'établissement *</label>
              <input required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} style={inputStyle} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Téléphone *</label>
              <input required value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} style={inputStyle} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Type d'établissement *</label>
              <select required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                <option value="">Choisir</option>
                <option value="restaurant">Restaurant</option>
                <option value="hotel">Hôtel</option>
                <option value="cafe">Café</option>
                <option value="traiteur">Traiteur</option>
                <option value="evenementiel">Événementiel</option>
                <option value="brasserie">Brasserie</option>
                <option value="fastfood">Fast Food</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Ville *</label>
              <select required value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} style={inputStyle}>
                <option value="Casablanca">Casablanca</option>
                <option value="Rabat">Rabat</option>
                <option value="Marrakech">Marrakech</option>
                <option value="Tanger">Tanger</option>
                <option value="Agadir">Agadir</option>
                <option value="Fès">Fès</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Adresse</label>
              <input value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} style={inputStyle} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => setEtape(1)}
                style={{ flex: 1, background: '#f5f5f5', color: '#1a1a1a', padding: '16px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                ← Retour
              </button>
              <button type="submit" disabled={loading}
                style={{ flex: 2, background: '#F47C20', color: 'white', padding: '16px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'Poppins, sans-serif' }}>
                {loading ? 'Création...' : 'Créer mon compte'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}