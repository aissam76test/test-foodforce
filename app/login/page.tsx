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
      return;
    }

    // Vérifier si c'est un établissement ou un extra
    const { data: etab } = await supabase
      .from('etablissements')
      .select('id')
      .eq('email', form.email)
      .single();

    if (etab) {
      window.location.href = '/dashboard-etablissement';
    } else {
      window.location.href = '/dashboard-extra';
    }
  };

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#FDF0E8', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '40px 32px', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' }}>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontWeight: 800, fontSize: '24px', color: '#1a1a1a' }}>Food</span>
            <span style={{ fontWeight: 800, fontSize: '24px', color: '#F47C20' }}>Force</span>
          </a>
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
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #eee', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as any }} />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: '6px' }}>Mot de passe *</label>
            <input type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #eee', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as any }} />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            <a href="/mot-de-passe-oublie" style={{ color: '#F47C20', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              Mot de passe oublié ?
            </a>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: '#F47C20', color: 'white', padding: '16px', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ borderTop: '1px solid #f0f0f0', marginTop: '24px', paddingTop: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
            Pas encore de compte ?
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <a href="/inscription-extra" style={{ background: '#F47C20', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '13px' }}>
              Je suis un extra
            </a>
            <a href="/inscription-etablissement" style={{ background: '#1a1a1a', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '13px' }}>
              Je suis un établissement
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}