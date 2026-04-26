'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert('❌ Erreur : ' + error.message);
      setLoading(false);
      return;
    }

    // Vérifier le type d'utilisateur
    const { data: extraData } = await supabase.from('extras').select('*').eq('email', email).single();
    const { data: etabData } = await supabase.from('etablissements').select('*').eq('email', email).single();

    if (extraData) {
      window.location.href = '/dashboard-extra';
    } else if (etabData) {
      window.location.href = '/dashboard-etablissement';
    } else {
      alert('❌ Compte non trouvé');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard-extra`
      }
    });
    if (error) alert('❌ Erreur Google : ' + error.message);
  };

  const bg = darkMode ? '#0a0a0a' : 'linear-gradient(135deg, #FDF0E8 0%, #fff 100%)';
  const cardBg = darkMode ? 'rgba(255, 255, 255, 0.05)' : '#fff';
  const textPrimary = darkMode ? '#fff' : '#1a1a1a';
  const textSecondary = darkMode ? '#999' : '#666';
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.08)';

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden', transition: 'background 0.3s ease' }}>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Animated Background Elements */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: darkMode ? 'rgba(244, 124, 32, 0.1)' : 'rgba(244, 124, 32, 0.15)', borderRadius: '50%', filter: 'blur(80px)', animation: 'float 6s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', background: darkMode ? 'rgba(255, 154, 86, 0.1)' : 'rgba(255, 154, 86, 0.15)', borderRadius: '50%', filter: 'blur(100px)', animation: 'float 8s ease-in-out infinite' }} />

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 1, animation: 'fadeIn 0.8s ease' }}>
        {/* Dark Mode Toggle */}
        <div style={{ position: 'absolute', top: '-60px', right: '0' }}>
          <button onClick={() => setDarkMode(!darkMode)} style={{
            background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            border: 'none',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            transition: 'all 0.3s ease'
          }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div style={{ 
          background: cardBg,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '32px', 
          padding: '48px', 
          boxShadow: darkMode ? '0 20px 80px rgba(0,0,0,0.6)' : '0 20px 80px rgba(0,0,0,0.12)',
          border: `1px solid ${borderColor}`
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="32" fill="url(#gradientLogo)"/>
                <path d="M24 20h16v4h-12v8h10v4h-10v12h-4V20z" fill="white"/>
                <defs>
                  <linearGradient id="gradientLogo" x1="0" y1="0" x2="64" y2="64">
                    <stop offset="0%" stopColor="#F47C20"/>
                    <stop offset="100%" stopColor="#FF9A56"/>
                  </linearGradient>
                </defs>
              </svg>
              <div>
                <span style={{ fontWeight: 800, fontSize: '28px', color: textPrimary }}>Food</span>
                <span style={{ fontWeight: 800, fontSize: '28px', background: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Force</span>
              </div>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0', color: textPrimary }}>Bon retour !</h1>
            <p style={{ color: textSecondary, fontSize: '15px', margin: 0 }}>Connectez-vous pour accéder à votre espace</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: textPrimary }}>Email</label>
              <div style={{ position: 'relative' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={textPrimary} strokeWidth="2"/>
                  <path d="M22 6l-10 7L2 6" stroke={textPrimary} strokeWidth="2"/>
                </svg>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: textPrimary }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={textPrimary} strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke={textPrimary} strokeWidth="2"/>
                </svg>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ 
                    width: '100%', 
                    padding: '16px 16px 16px 48px', 
                    borderRadius: '12px', 
                    border: `2px solid ${borderColor}`,
                    fontSize: '15px',
                    outline: 'none',
                    background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa',
                    color: textPrimary,
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
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
                marginBottom: '16px'
              }}
            >
              {loading ? '⏳ Connexion...' : '🚀 Se connecter'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
              <div style={{ flex: 1, height: '1px', background: borderColor }} />
              <span style={{ fontSize: '13px', color: textSecondary, fontWeight: 600 }}>OU</span>
              <div style={{ flex: 1, height: '1px', background: borderColor }} />
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              style={{ 
                width: '100%', 
                background: cardBg,
                backdropFilter: 'blur(20px)',
                color: textPrimary, 
                padding: '16px', 
                borderRadius: '12px', 
                border: `2px solid ${borderColor}`,
                fontSize: '15px', 
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuer avec Google
            </button>
          </form>

          {/* Footer Links */}
          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: textSecondary }}>
            Pas encore de compte ?{' '}
            <a href="/inscription-extra" style={{ color: '#F47C20', textDecoration: 'none', fontWeight: 700 }}>
              S&apos;inscrire
            </a>
          </div>
        </div>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/" style={{ color: textSecondary, textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            ← Retour à l&apos;accueil
          </a>
        </div>
      </div>
    </main>
  );
}