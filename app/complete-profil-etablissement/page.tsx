'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function CompleteProfilEtablissement() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nom: '', telephone: '', type: '', ville: 'Casablanca', adresse: ''
  });

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }

      // Vérifier si le profil établissement existe déjà
      const { data: etab } = await supabase
        .from('etablissements')
        .select('id')
        .eq('email', user.email)
        .single();

      if (etab) {
        window.location.href = '/espace-etablissement';
        return;
      }

      setUser(user);
      setLoading(false);
    };
    init();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from('etablissements').insert([{
      nom: form.nom,
      email: user.email,
      telephone: form.telephone,
      type: form.type,
      ville: form.ville,
      adresse: form.adresse,
      user_id: user.id,
      statut: 'en_attente'
    }]);

    if (!error) {
      window.location.href = '/espace-etablissement';
    } else {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'Poppins, sans-serif' }}>
      Chargement...
    </div>
  );

  const inputStyle: any = {
    width: '100%', padding: '12px', borderRadius: '8px',
    border: '1px solid #ddd', marginBottom: '14px',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Poppins, sans-serif'
  };

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#FDF0E8', minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: '420px', margin: '0 auto', background: 'white', borderRadius: '18px', padding: '32px 28px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontWeight: 800, fontSize: '22px', color: '#1a1a1a' }}>Food</span>
            <span style={{ fontWeight: 800, fontSize: '22px', color: '#F47C20' }}>Force</span>
          </a>
        </div>

        {/* AVATAR GOOGLE */}
        {user?.user_metadata?.avatar_url && (
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <img src={user.user_metadata.avatar_url} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '3px solid #F47C20' }} />
          </div>
        )}

        <h1 style={{ fontSize: '20px', fontWeight: 800, textAlign: 'center', marginBottom: '6px' }}>
          Complétez votre profil
        </h1>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '13px', marginBottom: '8px' }}>
          Connecté avec : <strong>{user?.email}</strong>
        </p>
        <p style={{ textAlign: 'center', color: '#888', fontSize: '13px', marginBottom: '24px' }}>
          Renseignez les informations de votre établissement pour continuer.
        </p>

        <form onSubmit={handleSubmit}>
          <input required placeholder="Nom de l'établissement" value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })} style={inputStyle} />

          <input required placeholder="Téléphone" value={form.telephone}
            onChange={(e) => setForm({ ...form, telephone: e.target.value })} style={inputStyle} />

          <select required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
            <option value="">Type d'établissement</option>
            <option value="restaurant">Restaurant</option>
            <option value="hotel">Hôtel</option>
            <option value="cafe">Café</option>
            <option value="traiteur">Traiteur</option>
            <option value="evenementiel">Événementiel</option>
            <option value="brasserie">Brasserie</option>
            <option value="fastfood">Fast Food</option>
          </select>

          <select required value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} style={inputStyle}>
            <option value="Casablanca">Casablanca</option>
            <option value="Rabat">Rabat</option>
            <option value="Marrakech">Marrakech</option>
            <option value="Tanger">Tanger</option>
            <option value="Agadir">Agadir</option>
            <option value="Fès">Fès</option>
          </select>

          <input placeholder="Adresse (optionnel)" value={form.adresse}
            onChange={(e) => setForm({ ...form, adresse: e.target.value })} style={{ ...inputStyle, marginBottom: '20px' }} />

          <button type="submit" disabled={saving}
            style={{ width: '100%', background: '#F47C20', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '15px', cursor: 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'Poppins, sans-serif' }}>
            {saving ? 'Enregistrement...' : 'Accéder à mon espace →'}
          </button>
        </form>
      </div>
    </main>
  );
}