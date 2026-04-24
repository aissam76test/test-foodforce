'use client';
import { useState } from 'react';

export default function InscriptionEtablissement() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    email: '',
    password: '',
    nom_etablissement: '',
    type_etablissement: 'Restaurant',
    adresse: '',
    ville: '',
    telephone: '',
    nom_gerant: '',
    prenom_gerant: ''
  });

  const typesEtablissement = ['Restaurant', 'Hôtel', 'Café', 'Bar', 'Traiteur', 'Événementiel'];

  const bg = darkMode ? '#0a0a0a' : 'linear-gradient(135deg, #FDF0E8 0%, #fff 100%)';
  const cardBg = darkMode ? 'rgba(255, 255, 255, 0.05)' : '#fff';
  const textPrimary = darkMode ? '#fff' : '#1a1a1a';
  const textSecondary = darkMode ? '#999' : '#666';
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.08)';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/inscription-etablissement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      alert('✅ Inscription réussie ! Veuillez maintenant uploader vos documents.');
      window.location.href = '/upload-documents-etablissement';
    } catch (error: any) {
      alert('❌ ' + error.message);
      setLoading(false);
    }
  };

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', transition: 'background 0.3s ease', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Animated Background */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: darkMode ? 'rgba(244, 124, 32, 0.05)' : 'rgba(244, 124, 32, 0.1)', borderRadius: '50%', filter: 'blur(100px)', animation: 'float 6s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: '400px', height: '400px', background: darkMode ? 'rgba(255, 154, 86, 0.05)' : 'rgba(255, 154, 86, 0.1)', borderRadius: '50%', filter: 'blur(120px)', animation: 'float 8s ease-in-out infinite' }} />

      {/* Dark Mode Toggle */}
      <button onClick={() => setDarkMode(!darkMode)} style={{
        position: 'absolute',
        top: '24px',
        right: '24px',
        background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        backdropFilter: 'blur(10px)',
        border: 'none',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        transition: 'all 0.3s ease',
        zIndex: 10,
        boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        {darkMode ? '☀️' : '🌙'}
      </button>

      <div style={{ 
        background: cardBg,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: '32px', 
        padding: '48px', 
        width: '100%', 
        maxWidth: '700px',
        boxShadow: darkMode ? '0 20px 80px rgba(0,0,0,0.6)' : '0 20px 80px rgba(0,0,0,0.12)',
        border: `1px solid ${borderColor}`,
        position: 'relative',
        zIndex: 1,
        animation: 'slideIn 0.6s ease'
      }}>
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="32" fill="url(#gradientLogo3)"/>
              <path d="M24 20h16v4h-12v8h10v4h-10v12h-4V20z" fill="white"/>
              <defs>
                <linearGradient id="gradientLogo3" x1="0" y1="0" x2="64" y2="64">
                  <stop offset="0%" stopColor="#F47C20"/>
                  <stop offset="100%" stopColor="#FF9A56"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0', color: textPrimary, letterSpacing: '-1px' }}>
            Recrutez avec FoodForce
          </h1>
          <p style={{ color: textSecondary, fontSize: '15px', margin: 0 }}>Créez votre compte établissement</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Informations du compte */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: textPrimary, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={textPrimary} strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke={textPrimary} strokeWidth="2"/>
              </svg>
              Informations du compte
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: textPrimary }}>Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="contact@restaurant.com"
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '12px', 
                  border: `2px solid ${borderColor}`,
                  fontSize: '15px',
                  outline: 'none',
                  background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa',
                  color: textPrimary,
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#F47C20'}
                onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: textPrimary }}>Mot de passe *</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 caractères"
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '12px', 
                  border: `2px solid ${borderColor}`,
                  fontSize: '15px',
                  outline: 'none',
                  background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa',
                  color: textPrimary,
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#F47C20'}
                onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
              />
            </div>
          </div>

          {/* Informations de l'établissement */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: textPrimary, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke={textPrimary} strokeWidth="2"/>
                <path d="M9 22V12h6v10" stroke={textPrimary} strokeWidth="2"/>
              </svg>
              Informations de l'établissement
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: textPrimary }}>Nom de l'établissement *</label>
              <input
                type="text"
                required
                value={form.nom_etablissement}
                onChange={(e) => setForm({ ...form, nom_etablissement: e.target.value })}
                placeholder="Restaurant Le Gourmet"
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '12px', 
                  border: `2px solid ${borderColor}`,
                  fontSize: '15px',
                  outline: 'none',
                  background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa',
                  color: textPrimary,
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#F47C20'}
                onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: textPrimary }}>Type *</label>
                <select
                  required
                  value={form.type_etablissement}
                  onChange={(e) => setForm({ ...form, type_etablissement: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    borderRadius: '12px', 
                    border: `2px solid ${borderColor}`,
                    fontSize: '15px',
                    outline: 'none',
                    background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa',
                    color: textPrimary,
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F47C20'}
                  onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
                >
                  {typesEtablissement.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: textPrimary }}>Ville *</label>
                <input
                  type="text"
                  required
                  value={form.ville}
                  onChange={(e) => setForm({ ...form, ville: e.target.value })}
                  placeholder="Casablanca"
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    borderRadius: '12px', 
                    border: `2px solid ${borderColor}`,
                    fontSize: '15px',
                    outline: 'none',
                    background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa',
                    color: textPrimary,
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F47C20'}
                  onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: textPrimary }}>Adresse *</label>
              <input
                type="text"
                required
                value={form.adresse}
                onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                placeholder="123 Boulevard Mohammed V"
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '12px', 
                  border: `2px solid ${borderColor}`,
                  fontSize: '15px',
                  outline: 'none',
                  background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa',
                  color: textPrimary,
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#F47C20'}
                onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: textPrimary }}>Téléphone *</label>
              <input
                type="tel"
                required
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                placeholder="0522XXXXXX"
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '12px', 
                  border: `2px solid ${borderColor}`,
                  fontSize: '15px',
                  outline: 'none',
                  background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa',
                  color: textPrimary,
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#F47C20'}
                onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
              />
            </div>
          </div>

          {/* Informations du gérant */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: textPrimary, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={textPrimary} strokeWidth="2"/>
                <circle cx="12" cy="7" r="4" stroke={textPrimary} strokeWidth="2"/>
              </svg>
              Informations du gérant
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: textPrimary }}>Prénom *</label>
                <input
                  type="text"
                  required
                  value={form.prenom_gerant}
                  onChange={(e) => setForm({ ...form, prenom_gerant: e.target.value })}
                  placeholder="Prénom"
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    borderRadius: '12px', 
                    border: `2px solid ${borderColor}`,
                    fontSize: '15px',
                    outline: 'none',
                    background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa',
                    color: textPrimary,
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F47C20'}
                  onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: textPrimary }}>Nom *</label>
                <input
                  type="text"
                  required
                  value={form.nom_gerant}
                  onChange={(e) => setForm({ ...form, nom_gerant: e.target.value })}
                  placeholder="Nom"
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    borderRadius: '12px', 
                    border: `2px solid ${borderColor}`,
                    fontSize: '15px',
                    outline: 'none',
                    background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa',
                    color: textPrimary,
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F47C20'}
                  onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)', 
              color: '#fff', 
              padding: '18px', 
              borderRadius: '12px', 
              border: 'none', 
              fontSize: '16px', 
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 8px 24px rgba(244, 124, 32, 0.3)',
              transition: 'all 0.3s ease',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <>
                <div style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                Création...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 4L12 14.01l-3-3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Créer mon compte
              </>
            )}
          </button>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: textSecondary, fontSize: '14px', margin: 0 }}>
              Déjà inscrit ?{' '}
              <a href="/login" style={{ color: '#F47C20', textDecoration: 'none', fontWeight: 600 }}>
                Se connecter
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}