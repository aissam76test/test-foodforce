'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError('Email ou mot de passe incorrect');
      setLoading(false);
    } else {
      window.location.href = '/profil';
    }
  };

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#FDF0E8', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '440px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontWeight: 800, fontSize: '22px', color: '#1a1a1a' }}>Food</span>
          <span style={{ fontWeight: 800, fontSize: '22px', color: '#F47C20' }}>Force</span>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '4px', textAlign: 'center' }}>Connexion</h1>
        <p style={{ color: '#666', marginBottom: '32px', fontSize: '14px', textAlign: 'center' }}>
          Accédez à votre espace personnel
        </p>

        {error && (
          <div style={{ background: '#fee', color: '#c00', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: '6px' }}>Email *</label>
            <input type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #eee', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: '6px' }}>Mot de passe *</label>
            <input type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #eee', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: '#F47C20', color: 'white', padding: '16px', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#666' }}>
          Pas encore de compte ? <a href="/inscription-extra" style={{ color: '#F47C20', fontWeight: 600 }}>S'inscrire</a>
        </p>
      </div>
    </main>
  );
}