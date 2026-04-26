'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function CreerMission() {
  const [user, setUser] = useState<any>(null);
  const [etablissement, setEtablissement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [form, setForm] = useState({
    titre: '',
    description: '',
    secteur: 'Restaurant',
    poste_requis: 'Serveur',
    date_mission: '',
    heure_debut: '',
    heure_fin: '',
    nombre_extras: 1,
    taux_horaire: 80,
    competences_requises: [] as string[],
    lieu: '',
    statut: 'ouverte'
  });

  const secteurs = ['Restaurant', 'Hôtel', 'Événementiel', 'Café', 'Bar', 'Traiteur'];
  const postes = ['Serveur', 'Barman', 'Chef de rang', 'Commis de salle', 'Plongeur', 'Cuisinier', 'Pâtissier', 'Réceptionniste'];
  const competences = ['Service en salle', 'Barista', 'Mixologie', 'HACCP', 'Caisse', 'Accueil client'];

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);

      const { data: etabData } = await supabase.from('etablissements').select('*').eq('email', user.email).single();
      if (etabData) {
        setEtablissement(etabData);
        
        if (etabData.kbis_statut !== 'validé' || etabData.patente_statut !== 'validé' || etabData.cin_gerant_statut !== 'validé' || etabData.rib_statut !== 'validé') {
          alert('⚠️ Votre profil doit être validé avant de créer des missions. Veuillez uploader vos documents.');
          window.location.href = '/upload-documents-etablissement';
          return;
        }
      } else {
        window.location.href = '/dashboard-extra';
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    await supabase.from('missions').insert([{
      ...form,
      etablissement_id: etablissement.id
    }]);

    alert('✅ Mission créée avec succès !');
    window.location.href = '/dashboard-etablissement';
  };

  const toggleCompetence = (comp: string) => {
    if (form.competences_requises.includes(comp)) {
      setForm({ ...form, competences_requises: form.competences_requises.filter(c => c !== comp) });
    } else {
      setForm({ ...form, competences_requises: [...form.competences_requises, comp] });
    }
  };

  const bg = darkMode ? '#0a0a0a' : 'linear-gradient(135deg, #FDF0E8 0%, #fff 100%)';
  const cardBg = darkMode ? 'rgba(255, 255, 255, 0.05)' : '#fff';
  const textPrimary = darkMode ? '#fff' : '#1a1a1a';
  const textSecondary = darkMode ? '#999' : '#666';
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.08)';

  if (loading) return (
    <div style={{ fontFamily: 'Poppins, sans-serif', background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '48px', height: '48px', border: '4px solid #e3e8ee', borderTop: '4px solid #F47C20', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: bg, minHeight: '100vh', transition: 'background 0.3s ease' }}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ 
        background: darkMode ? 'rgba(10, 10, 10, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(20px) saturate(180%)',
        padding: '16px 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        boxShadow: darkMode ? '0 4px 30px rgba(0,0,0,0.3)' : '0 4px 30px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: `1px solid ${borderColor}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="url(#gradient1)"/>
              <path d="M12 10h8v2h-6v4h5v2h-5v6h-2V10z" fill="white"/>
              <defs>
                <linearGradient id="gradient1" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#F47C20"/>
                  <stop offset="100%" stopColor="#FF9A56"/>
                </linearGradient>
              </defs>
            </svg>
            <div>
              <span style={{ fontWeight: 800, fontSize: '24px', color: textPrimary }}>Food</span>
              <span style={{ fontWeight: 800, fontSize: '24px', background: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Force</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="/dashboard-etablissement" style={{ 
            textDecoration: 'none', 
            color: textSecondary, 
            fontWeight: 600, 
            fontSize: '14px',
            padding: '10px 16px',
            borderRadius: '10px',
            transition: 'all 0.2s ease'
          }}>
            ← Retour au dashboard
          </a>
          <button onClick={() => setDarkMode(!darkMode)} style={{
            background: darkMode ? 'rgba(255,255,255,0.1)' : '#f5f5f5',
            border: 'none',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        {/* HEADER */}
        <div style={{ marginBottom: '32px', animation: 'slideIn 0.6s ease' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px 0', color: textPrimary }}>
            Créer une nouvelle mission
          </h1>
          <p style={{ color: textSecondary, fontSize: '15px', margin: 0 }}>Remplissez les informations de votre mission</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* INFORMATIONS GÉNÉRALES */}
          <div style={{ 
            background: cardBg,
            backdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '24px', 
            padding: '28px', 
            boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
            border: `1px solid ${borderColor}`,
            marginBottom: '20px',
            animation: 'slideIn 0.7s ease'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: textPrimary }}>Informations générales</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px', color: textPrimary }}>Titre de la mission *</label>
              <input required value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} placeholder="Ex: Serveur pour événement corporate" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${borderColor}`, fontSize: '15px', outline: 'none', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', color: textPrimary, boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px', color: textPrimary }}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Décrivez la mission en détail..." style={{ width: '100%', height: '100px', padding: '14px', borderRadius: '12px', border: `2px solid ${borderColor}`, fontSize: '15px', outline: 'none', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', color: textPrimary, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px', color: textPrimary }}>Secteur *</label>
                <select required value={form.secteur} onChange={(e) => setForm({ ...form, secteur: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${borderColor}`, fontSize: '15px', outline: 'none', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', color: textPrimary, boxSizing: 'border-box' }}>
                  {secteurs.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px', color: textPrimary }}>Poste requis *</label>
                <select required value={form.poste_requis} onChange={(e) => setForm({ ...form, poste_requis: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${borderColor}`, fontSize: '15px', outline: 'none', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', color: textPrimary, boxSizing: 'border-box' }}>
                  {postes.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px', color: textPrimary }}>Lieu *</label>
              <input required value={form.lieu} onChange={(e) => setForm({ ...form, lieu: e.target.value })} placeholder="Ex: Casablanca, Anfa" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${borderColor}`, fontSize: '15px', outline: 'none', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', color: textPrimary, boxSizing: 'border-box' }} />
            </div>
          </div>

          {/* DATE ET HORAIRES */}
          <div style={{ 
            background: cardBg,
            backdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '24px', 
            padding: '28px', 
            boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
            border: `1px solid ${borderColor}`,
            marginBottom: '20px',
            animation: 'slideIn 0.8s ease'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: textPrimary }}>Date et horaires</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px', color: textPrimary }}>Date *</label>
                <input type="date" required value={form.date_mission} onChange={(e) => setForm({ ...form, date_mission: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${borderColor}`, fontSize: '15px', outline: 'none', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', color: textPrimary, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px', color: textPrimary }}>Heure début *</label>
                <input type="time" required value={form.heure_debut} onChange={(e) => setForm({ ...form, heure_debut: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${borderColor}`, fontSize: '15px', outline: 'none', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', color: textPrimary, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px', color: textPrimary }}>Heure fin *</label>
                <input type="time" required value={form.heure_fin} onChange={(e) => setForm({ ...form, heure_fin: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${borderColor}`, fontSize: '15px', outline: 'none', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', color: textPrimary, boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          {/* RÉMUNÉRATION */}
          <div style={{ 
            background: cardBg,
            backdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '24px', 
            padding: '28px', 
            boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
            border: `1px solid ${borderColor}`,
            marginBottom: '20px',
            animation: 'slideIn 0.9s ease'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: textPrimary }}>Rémunération et effectif</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px', color: textPrimary }}>Nombre d'extras *</label>
                <input type="number" min="1" required value={form.nombre_extras} onChange={(e) => setForm({ ...form, nombre_extras: parseInt(e.target.value) })} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${borderColor}`, fontSize: '15px', outline: 'none', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', color: textPrimary, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px', color: textPrimary }}>Taux horaire (MAD) *</label>
                <input type="number" min="50" required value={form.taux_horaire} onChange={(e) => setForm({ ...form, taux_horaire: parseInt(e.target.value) })} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${borderColor}`, fontSize: '15px', outline: 'none', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', color: textPrimary, boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          {/* COMPÉTENCES */}
          <div style={{ 
            background: cardBg,
            backdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '24px', 
            padding: '28px', 
            boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
            border: `1px solid ${borderColor}`,
            marginBottom: '20px',
            animation: 'slideIn 1s ease'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: textPrimary }}>Compétences requises (optionnel)</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {competences.map(comp => (
                <label key={comp} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer', 
                  background: form.competences_requises.includes(comp) ? 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)' : darkMode ? 'rgba(255,255,255,0.05)' : '#f9f9f9',
                  color: form.competences_requises.includes(comp) ? '#fff' : textPrimary,
                  padding: '10px 16px', 
                  borderRadius: '20px', 
                  border: `2px solid ${form.competences_requises.includes(comp) ? 'transparent' : borderColor}`,
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: 600
                }}>
                  <input type="checkbox" checked={form.competences_requises.includes(comp)} onChange={() => toggleCompetence(comp)} style={{ display: 'none' }} />
                  {comp}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', animation: 'slideIn 1.1s ease' }}>
            <a href="/dashboard-etablissement" style={{ flex: 1, background: darkMode ? 'rgba(255,255,255,0.05)' : '#f5f5f5', color: textPrimary, border: `2px solid ${borderColor}`, padding: '16px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
              Annuler
            </a>
            <button type="submit" disabled={saving} style={{ flex: 2, background: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)', color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(244, 124, 32, 0.3)' }}>
              {saving ? '⏳ Création...' : '🚀 Créer la mission'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}