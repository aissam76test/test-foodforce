'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function CreerMission() {
  const [user, setUser] = useState<any>(null);
  const [etablissement, setEtablissement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        
        // BLOQUER SI PAS VALIDÉ - Vérifier TOUS les documents
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

    window.location.href = '/dashboard-etablissement';
  };

  const toggleCompetence = (comp: string) => {
    if (form.competences_requises.includes(comp)) {
      setForm({ ...form, competences_requises: form.competences_requises.filter(c => c !== comp) });
    } else {
      setForm({ ...form, competences_requises: [...form.competences_requises, comp] });
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'Poppins, sans-serif' }}>Chargement...</div>;

  const inputStyle: any = { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' };

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      <nav style={{ background: 'white', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <div>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#1a1a1a' }}>Food</span>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#F47C20' }}>Force</span>
        </div>
        <a href="/dashboard-etablissement" style={{ textDecoration: 'none', color: '#666', fontWeight: 600, fontSize: '14px' }}>← Retour au dashboard</a>
      </nav>

      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Créer une nouvelle mission</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>Remplissez les informations de votre mission</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Informations générales</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Titre de la mission *</label>
              <input required style={inputStyle} value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} placeholder="Ex: Serveur pour événement corporate" />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Description</label>
              <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Décrivez la mission en détail..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Secteur *</label>
                <select required style={inputStyle} value={form.secteur} onChange={(e) => setForm({ ...form, secteur: e.target.value })}>
                  {secteurs.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Poste requis *</label>
                <select required style={inputStyle} value={form.poste_requis} onChange={(e) => setForm({ ...form, poste_requis: e.target.value })}>
                  {postes.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Lieu *</label>
              <input required style={inputStyle} value={form.lieu} onChange={(e) => setForm({ ...form, lieu: e.target.value })} placeholder="Ex: Casablanca, Anfa" />
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Date et horaires</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Date *</label>
                <input type="date" required style={inputStyle} value={form.date_mission} onChange={(e) => setForm({ ...form, date_mission: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Heure début *</label>
                <input type="time" required style={inputStyle} value={form.heure_debut} onChange={(e) => setForm({ ...form, heure_debut: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Heure fin *</label>
                <input type="time" required style={inputStyle} value={form.heure_fin} onChange={(e) => setForm({ ...form, heure_fin: e.target.value })} />
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Rémunération et effectif</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Nombre d'extras *</label>
                <input type="number" min="1" required style={inputStyle} value={form.nombre_extras} onChange={(e) => setForm({ ...form, nombre_extras: parseInt(e.target.value) })} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Taux horaire (MAD) *</label>
                <input type="number" min="50" required style={inputStyle} value={form.taux_horaire} onChange={(e) => setForm({ ...form, taux_horaire: parseInt(e.target.value) })} />
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Compétences requises (optionnel)</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {competences.map(comp => (
                <label key={comp} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: form.competences_requises.includes(comp) ? '#FDF0E8' : '#f9f9f9', padding: '10px 16px', borderRadius: '8px', border: `2px solid ${form.competences_requises.includes(comp) ? '#F47C20' : 'transparent'}` }}>
                  <input type="checkbox" checked={form.competences_requises.includes(comp)} onChange={() => toggleCompetence(comp)} style={{ accentColor: '#F47C20' }} />
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{comp}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="/dashboard-etablissement" style={{ flex: 1, background: 'white', color: '#F47C20', border: '2px solid #F47C20', padding: '16px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
              Annuler
            </a>
            <button type="submit" disabled={saving} style={{ flex: 2, background: '#F47C20', color: 'white', padding: '16px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
              {saving ? '⏳ Création...' : '🚀 Créer la mission'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}