'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 6) {
      setError('Minimum 6 caractères');
      return;
    }
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError('Une erreur est survenue. Réessayez.');
      setLoading(false);
    } else {
      setDone(true);
    }
  };

  if (done) return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#FDF0E8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center', background: 'white', borderRadius: '20px', padding: '48px 32px', maxWidth: '440px', width: '100%', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>✅</div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', marginBottom: '12px' }}>Mot de passe modifié !</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>Votre mot de passe a été mis à jour avec succès.</p>
        <a href="/login" style={{ background: '#F47C20', color: 'white', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', display: 'inline-block' }}>
          Se connecter
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
          Nouveau mot de passe
        </h1>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '32px' }}>
          Choisissez un nouveau mot de passe sécurisé.
        </p>

        {error && (
          <div style={{ background: '#fee', color: '#c00', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1.5px solid #eee', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as any, marginBottom: '14px', fontFamily: 'Poppins, sans-serif' }}
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1.5px solid #eee', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as any, marginBottom: '20px', fontFamily: 'Poppins, sans-serif' }}
          />

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: '#F47C20', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'Poppins, sans-serif' }}>
            {loading ? 'Modification...' : 'Modifier mon mot de passe'}
          </button>
        </form>
      </div>
    </main>
  );
}