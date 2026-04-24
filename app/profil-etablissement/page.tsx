'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ProfilEtablissement() {
  const [user, setUser] = useState<any>(null);
  const [etablissement, setEtablissement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    nom_etablissement: '',
    type_etablissement: 'Restaurant',
    adresse: '',
    ville: 'Casablanca',
    code_postal: '',
    telephone: '',
    description: '',
    nombre_employes: '',
    secteur_activite: 'Restauration',
    site_web: ''
  });

  const typesEtablissement = ['Restaurant', 'Hôtel', 'Café', 'Bar', 'Traiteur', 'Boulangerie', 'Pâtisserie', 'Fast Food'];
  const villes = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès', 'Meknès', 'Oujda'];

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);

      const { data: etabData } = await supabase.from('etablissements').select('*').eq('email', user.email).single();
      if (etabData) {
        setEtablissement(etabData);
        setForm({
          nom_etablissement: etabData.nom_etablissement || '',
          type_etablissement: etabData.type_etablissement || 'Restaurant',
          adresse: etabData.adresse || '',
          ville: etabData.ville || 'Casablanca',
          code_postal: etabData.code_postal || '',
          telephone: etabData.telephone || '',
          description: etabData.description || '',
          nombre_employes: etabData.nombre_employes || '',
          secteur_activite: etabData.secteur_activite || 'Restauration',
          site_web: etabData.site_web || ''
        });
        if (etabData.logo_url) setPhotoUrl(etabData.logo_url);
      } else {
        window.location.href = '/dashboard-extra';
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const handlePhoto = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    await supabase.storage.from('logos').upload(fileName, file, { upsert: true });
    const { data } = supabase.storage.from('logos').getPublicUrl(fileName);
    await supabase.from('etablissements').update({ logo_url: data.publicUrl }).eq('email', user.email);
    setPhotoUrl(data.publicUrl);
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('etablissements').update(form).eq('email', user.email);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'Poppins, sans-serif' }}>Chargement...</div>;

  const inputStyle: any = { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' };
  const cardStyle: any = { background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '20px' };

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* NAV */}
      <nav style={{ background: 'white', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <div>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#1a1a1a' }}>Food</span>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#F47C20' }}>Force</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {saved && <span style={{ color: '#22c55e', fontWeight: 600, fontSize: '14px' }}>✅ Sauvegardé !</span>}
          <a href="/dashboard-etablissement" style={{ textDecoration: 'none', color: '#666', fontWeight: 600, fontSize: '14px' }}>Dashboard</a>
          <button onClick={handleLogout} style={{ background: '#f5f5f5', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
            Se déconnecter
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Profil de l'établissement</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>Gérez les informations de votre établissement</p>
        </div>

        {/* LOGO */}
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
            {photoUrl ? (
              <img src={photoUrl} alt="logo" style={{ width: '120px', height: '120px', borderRadius: '16px', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '120px', height: '120px', borderRadius: '16px', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: '#999' }}>🏢</div>
            )}
          </div>
          <div>
            <label style={{ background: '#F47C20', color: 'white', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
              {uploading ? '⏳ Upload...' : '📷 Changer le logo'}
              <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* INFOS */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Informations générales</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Nom de l'établissement *</label>
              <input style={inputStyle} value={form.nom_etablissement} onChange={(e) => setForm({ ...form, nom_etablissement: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Type d'établissement</label>
              <select style={inputStyle} value={form.type_etablissement} onChange={(e) => setForm({ ...form, type_etablissement: e.target.value })}>
                {typesEtablissement.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Secteur d'activité</label>
              <input style={inputStyle} value={form.secteur_activite} onChange={(e) => setForm({ ...form, secteur_activite: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Téléphone</label>
              <input style={inputStyle} value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email</label>
              <input style={{ ...inputStyle, background: '#f5f5f5', color: '#888' }} value={etablissement?.email || ''} disabled />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Adresse</label>
              <input style={inputStyle} value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Ville</label>
              <select style={inputStyle} value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })}>
                {villes.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Code postal</label>
              <input style={inputStyle} value={form.code_postal} onChange={(e) => setForm({ ...form, code_postal: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Site web</label>
              <input style={inputStyle} value={form.site_web} onChange={(e) => setForm({ ...form, site_web: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Nombre d'employés</label>
              <input style={inputStyle} value={form.nombre_employes} onChange={(e) => setForm({ ...form, nombre_employes: e.target.value })} placeholder="Ex: 10-50" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Description</label>
              <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Présentez votre établissement..." />
            </div>
          </div>
        </div>

        {/* BOUTONS */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
          <a href="/dashboard-etablissement" style={{ flex: 1, background: 'white', color: '#F47C20', border: '2px solid #F47C20', padding: '16px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
            Annuler
          </a>
          <button onClick={handleSave} disabled={saving} style={{ flex: 2, background: '#F47C20', color: 'white', padding: '16px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
            {saving ? 'Sauvegarde...' : '💾 Enregistrer'}
          </button>
        </div>
      </div>
    </main>
  );
}