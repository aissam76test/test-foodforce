'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function InscriptionExtra() {
  const [step, setStep] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signUpData, setSignUpData] = useState<any>(null);
  
  const [form, setForm] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    telephone: '',
    ville: '',
    date_naissance: '',
    experience: '',
    disponibilite: 'temps_plein' as 'temps_plein' | 'temps_partiel' | 'weekend',
    competences: [] as string[]
  });

  const competencesList = [
    'Service en salle',
    'Bar / Barista',
    'Mixologie',
    'Cuisine',
    'Pâtisserie',
    'Plonge',
    'Accueil',
    'Caisse',
    'HACCP',
    'Réception hôtelière'
  ];

  const bg = darkMode ? '#0a0a0a' : 'linear-gradient(135deg, #FDF0E8 0%, #fff 100%)';
  const cardBg = darkMode ? 'rgba(255, 255, 255, 0.05)' : '#fff';
  const textPrimary = darkMode ? '#fff' : '#1a1a1a';
  const textSecondary = darkMode ? '#999' : '#666';
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.08)';

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { emailRedirectTo: `${window.location.origin}/login` }
    });

    if (error) {
      alert('❌ Erreur : ' + error.message);
      setLoading(false);
      return;
    }

    setSignUpData(data);
    setStep(2);
    setLoading(false);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!signUpData?.user?.id) {
      alert('❌ Erreur de session');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('extras').insert([{
      user_id: signUpData.user.id,
      email: form.email,
      nom: form.nom,
      prenom: form.prenom,
      telephone: form.telephone,
      ville: form.ville,
      date_naissance: form.date_naissance,
      experience: form.experience,
      disponibilite: form.disponibilite,
      competences: form.competences
    }]);

    if (error) {
      alert('❌ Erreur : ' + error.message);
      setLoading(false);
      return;
    }

    alert('✅ Inscription réussie ! Vous pouvez maintenant vous connecter.');
    window.location.href = '/login';
  };

  const toggleCompetence = (comp: string) => {
    if (form.competences.includes(comp)) {
      setForm({ ...form, competences: form.competences.filter(c => c !== comp) });
    } else {
      setForm({ ...form, competences: [...form.competences, comp] });
    }
  };

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', transition: 'background 0.3s ease', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes progressBar { from { width: 0%; } to { width: ${step === 1 ? '50%' : '100%'}; } }
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
        maxWidth: '600px',
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
              <circle cx="32" cy="32" r="32" fill="url(#gradientLogo2)"/>
              <path d="M24 20h16v4h-12v8h10v4h-10v12h-4V20z" fill="white"/>
              <defs>
                <linearGradient id="gradientLogo2" x1="0" y1="0" x2="64" y2="64">
                  <stop offset="0%" stopColor="#F47C20"/>
                  <stop offset="100%" stopColor="#FF9A56"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0', color: textPrimary, letterSpacing: '-1px' }}>
            Rejoignez FoodForce
          </h1>
          <p style={{ color: textSecondary, fontSize: '15px', margin: 0 }}>Créez votre profil candidat</p>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: step === 1 ? '#F47C20' : textSecondary }}>Étape 1</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: step === 2 ? '#F47C20' : textSecondary }}>Étape 2</span>
          </div>
          <div style={{ height: '6px', background: darkMode ? 'rgba(255,255,255,0.1)' : '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              background: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)', 
              borderRadius: '10px',
              transition: 'width 0.5s ease',
              width: step === 1 ? '50%' : '100%'
            }} />
          </div>
        </div>

        {/* STEP 1 - Compte */}
        {step === 1 && (
          <form onSubmit={handleStep1}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: textPrimary }}>Email *</label>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={textSecondary} strokeWidth="2"/>
                  <path d="M22 6l-10 7L2 6" stroke={textSecondary} strokeWidth="2"/>
                </svg>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="votre@email.com"
                  style={{ 
                    width: '100%', 
                    padding: '16px 16px 16px 48px', 
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

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: textPrimary }}>Mot de passe *</label>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={textSecondary} strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke={textSecondary} strokeWidth="2"/>
                </svg>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 caractères"
                  style={{ 
                    width: '100%', 
                    padding: '16px 16px 16px 48px', 
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

            <button
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%', 
                background: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)', 
                color: '#fff', 
                padding: '16px', 
                borderRadius: '12px', 
                border: 'none', 
                fontSize: '16px', 
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 8px 24px rgba(244, 124, 32, 0.3)',
                transition: 'all 0.3s ease',
                marginBottom: '24px'
              }}
            >
              {loading ? 'Chargement...' : 'Continuer →'}
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
        )}

        {/* STEP 2 - Profil */}
        {step === 2 && (
          <form onSubmit={handleStep2}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: textPrimary }}>Prénom *</label>
                <input
                  type="text"
                  required
                  value={form.prenom}
                  onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                  placeholder="Votre prénom"
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
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  placeholder="Votre nom"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: textPrimary }}>Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={form.telephone}
                  onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                  placeholder="06XXXXXXXX"
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
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: textPrimary }}>Date de naissance *</label>
              <input
                type="date"
                required
                value={form.date_naissance}
                onChange={(e) => setForm({ ...form, date_naissance: e.target.value })}
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
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: textPrimary }}>Expérience *</label>
              <select
                required
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
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
                <option value="">Sélectionnez</option>
                <option value="debutant">Débutant (0-1 an)</option>
                <option value="intermediaire">Intermédiaire (1-3 ans)</option>
                <option value="experimente">Expérimenté (3-5 ans)</option>
                <option value="expert">Expert (5+ ans)</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: textPrimary }}>Compétences</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {competencesList.map(comp => (
                  <label key={comp} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    cursor: 'pointer', 
                    background: form.competences.includes(comp) 
                      ? 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)' 
                      : darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa',
                    color: form.competences.includes(comp) ? '#fff' : textPrimary,
                    padding: '10px 16px', 
                    borderRadius: '20px', 
                    border: `2px solid ${form.competences.includes(comp) ? 'transparent' : borderColor}`,
                    transition: 'all 0.2s ease',
                    fontSize: '13px',
                    fontWeight: 600
                  }}>
                    <input 
                      type="checkbox" 
                      checked={form.competences.includes(comp)} 
                      onChange={() => toggleCompetence(comp)}
                      style={{ display: 'none' }}
                    />
                    {comp}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ 
                  flex: 1,
                  background: darkMode ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
                  color: textPrimary,
                  padding: '16px', 
                  borderRadius: '12px', 
                  border: 'none', 
                  fontSize: '15px', 
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                ← Retour
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{ 
                  flex: 2,
                  background: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)', 
                  color: '#fff', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  border: 'none', 
                  fontSize: '16px', 
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  boxShadow: '0 8px 24px rgba(244, 124, 32, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? 'Création...' : "S'inscrire ✓"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}