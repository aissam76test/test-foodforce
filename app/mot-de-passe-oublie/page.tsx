'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function MotDePasseOublie() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError('Une erreur est survenue. Vérifiez votre email.');
      setLoading(false);
    } else {
      setSent(true);
    }
  };

  if (sent) return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#FDF0E8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center', background: 'white', borderRadius: '20px', padding: '48px 32px', maxWidth: '440px', width: '100%', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>📧</div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', marginBottom: '12px' }}>Email envoyé !</h1>
        <p style={{ color: '#666', marginBottom: '8px', lineHeight: 1.6 }}>
          Un lien de réinitialisation a été envoyé à <strong>{email}</strong>
        </p>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '24px' }}>
          Vérifiez votre boîte mail et vos spams. Le lien expire dans 24h.
        </p>
        <a href="/login" style={{ background: '#F47C20', color: 'white', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', display: 'inline-block' }}>
          Retour à la connexion
        </a>
      </div>
    </main>
  );

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#FDF0E8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '440px', width: '100%', background: 'white', borderRadius: '20px', padding: '40px 32px', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' }}>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontWeight: 800, fontSize: '22px', color: '#1a1a1a' }}>Food</span>
            <span style={{ fontWeight: 800, fontSize: '22px', color: '#F47C20' }}>Force</span>
          </a>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 800, textAlign: 'center', marginBottom: '8px' }}>
          Mot de passe oublié ?
        </h1>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '32px', lineHeight: 1.6 }}>
          Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        {error && (
          <div style={{ background: '#fee', color: '#c00', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Votre email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1.5px solid #eee', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as any, marginBottom: '16px', fontFamily: 'Poppins, sans-serif' }}
          />

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: '#F47C20', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'Poppins, sans-serif', marginBottom: '16px' }}>
            {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#666' }}>
            <a href="/login" style={{ color: '#F47C20', fontWeight: 600, textDecoration: 'none' }}>← Retour à la connexion</a>
          </p>
        </form>
      </div>
    </main>
  );
}