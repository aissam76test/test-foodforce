'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

export default function InscriptionExtra() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Minimum 6 caractères');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Créer le compte dans Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: window.location.origin + '/profil'
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Vérifier que l'utilisateur a bien été créé
      if (!signUpData.user) {
        setError('Erreur lors de la création du compte');
        setLoading(false);
        return;
      }

      // Créer l'entrée dans la table extras avec le user_id
      const { error: insertError } = await supabase.from('extras').insert([{
        email: email,
        user_id: signUpData.user.id
      }]);

      if (insertError) {
        console.error('Erreur insertion extras:', insertError);
        // On continue quand même vers la page de login
      }

      // Redirection vers login
      router.push('/login');
      
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur est survenue');
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/profil'
      }
    });
  };

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#FDF0E8', minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: '420px', margin: '0 auto', background: 'white', borderRadius: '18px', padding: '32px 28px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontWeight: 800, fontSize: '24px', color: '#1a1a1a' }}>Food</span>
            <span style={{ fontWeight: 800, fontSize: '24px', color: '#F47C20' }}>Force</span>
          </a>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 800, textAlign: 'center', marginBottom: '20px' }}>
          Créer un compte candidat
        </h1>

        {error && (
          <div style={{ background: '#fee', color: '#c00', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleGoogle}
          style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #e5e5e5', background: '#fff', marginBottom: '18px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '14px' }}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3Z"/></svg>
          Continuer avec Google
        </button>

        <div style={{ textAlign: 'center', color: '#888', fontSize: '13px', marginBottom: '18px' }}>OU</div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '14px', boxSizing: 'border-box', fontSize: '14px' }}
          />

          <input
            type="password"
            placeholder="Mot de passe (min. 6 caractères)"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '14px', boxSizing: 'border-box', fontSize: '14px' }}
          />

          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '18px', boxSizing: 'border-box', fontSize: '14px' }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: '#F47C20', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1, fontSize: '15px' }}>
            {loading ? 'Création...' : 'Créer mon compte →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#666' }}>
          Déjà un compte ? <a href="/login" style={{ color: '#F47C20', fontWeight: 600, textDecoration: 'none' }}>Se connecter</a>
        </div>

      </div>
    </main>
  );
}