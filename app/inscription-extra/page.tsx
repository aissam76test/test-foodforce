'use client';
import { useState } from 'react';

const metiers: any = {
  salle: [
    'Directeur Food & Beverage', 'Directeur', 'Manager', 'Responsable de salle',
    "Maitre d'hôtel", "Assistant maitre d'hôtel", 'Chef de Rang', 'Serveur',
    'Runner', 'Officier', 'Limonadier', 'Garçon de café', 'Chef barman', 'Barman',
    'Commis de salle', 'Barista', 'Cafetier', 'Sommelier', 'Hôte / Hôtesse de caisse',
    "Hôte / Hôtesse d'accueil", 'Vestiaire', 'Employé polyvalent restauration',
    'Vendeur boulangerie', 'Ménage'
  ],
  cuisine: [
    'Chef de cuisine', 'Second de cuisine', 'Chef de partie', 'Demi-chef de partie',
    'Commis de cuisine', 'Chocolatier', 'Chef pâtissier', 'Pâtissier',
    'Pâtissier (nuit)', 'Pâtissier en laboratoire', 'Commis de pâtisserie',
    'Boulanger', 'Commis boulanger', 'Crêpier', 'Pizzaiolo', 'Cuisinier Collective',
    'Ecailler', 'Econome', 'Plongeur', 'Préparateur de commandes',
    'Employé polyvalent cuisine'
  ],
  hotel: [
    'Bagagiste', 'Cafetier', 'Concierge', "Employé polyvalent d'hôtel",
    'Esthéticienne', 'Femme / Valet de chambre', 'Gouvernante', 'Linger',
    'Manutentionnaire', 'Night Auditor', 'Premier de réception', 'Réceptionniste',
    'Room service', 'Voiturier'
  ]
};

export default function InscriptionExtra() {
  const [etape, setEtape] = useState(1);
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    nom: '', prenom: '', telephone: '', secteur: '', metier: '', experience: ''
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
    const res = await fetch('/api/inscription-extra', {
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
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a1a', marginBottom: '12px' }}>Inscription envoyée !</h1>
        <p style={{ color: '#666', marginBottom: '24px', lineHeight: 1.6 }}>Votre dossier est en cours de vérification. Vous recevrez un email de confirmation sous 48h.</p>
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

        <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px', textAlign: 'center' }}>Créer un compte candidat</h1>
        <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px', textAlign: 'center' }}>Trouvez des opportunités qui vous correspondent</p>

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
              { key: 'email', label: 'Email *', type: 'email' },
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
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Informations personnelles</h2>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>Complétez votre profil</p>

            {[
              { key: 'prenom', label: 'Prénom *', type: 'text' },
              { key: 'nom', label: 'Nom *', type: 'text' },
              { key: 'telephone', label: 'Téléphone *', type: 'tel' },
            ].map((field) => (
              <div key={field.key} style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                <input type={field.type} required value={(form as any)[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  style={inputStyle} />
              </div>
            ))}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: '6px' }}>Catégorie *</label>
              <select value={form.secteur} onChange={(e) => setForm({ ...form, secteur: e.target.value, metier: '' })} required style={inputStyle}>
                <option value="">Choisir une catégorie</option>
                <option value="salle">Salle & Service</option>
                <option value="cuisine">Cuisine</option>
                <option value="hotel">Hôtel</option>
              </select>
            </div>

            {form.secteur && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: '6px' }}>Métier *</label>
                <select value={form.metier} onChange={(e) => setForm({ ...form, metier: e.target.value })} required style={inputStyle}>
                  <option value="">Choisir un métier</option>
                  {metiers[form.secteur].map((m: string) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: '6px' }}>Expérience *</label>
              <select value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} required style={inputStyle}>
                <option value="">Choisir</option>
                <option value="debutant">Débutant (moins d'1 an)</option>
                <option value="intermediaire">Intermédiaire (1-3 ans)</option>
                <option value="confirme">Confirmé (3-5 ans)</option>
                <option value="expert">Expert (5+ ans)</option>
              </select>
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