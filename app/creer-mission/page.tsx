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
    taux_horaire: 62,
    competences_requises: [] as string[],
    lieu: '',
    statut: 'ouverte'
  });

  const secteurs = ['Restaurant', 'Hôtel', 'Événementiel', 'Café', 'Bar', 'Traiteur'];
  const competences = ['Service en salle', 'Barista', 'Mixologie', 'HACCP', 'Caisse', 'Accueil client'];

  // GRILLE TARIFAIRE RÉELLE FOODFORCE
  const grillePoste: any = {
    'Directeur Food & Beverage': 458, 'Directeur': 393, 'Manager': 223, 'Responsable de salle': 151,
    'Maître d\'hôtel': 131, 'Assistant maître d\'hôtel': 101, 'Chef de Rang': 82, 'Serveur': 62,
    'Runner': 52, 'Officier': 52, 'Limonadier': 62, 'Garçon de café': 52, 'Chef Barman': 118,
    'Barman': 75, 'Commis de salle': 49, 'Barista': 65, 'Cafetier': 52, 'Sommelier': 98,
    'Hôte / Hôtesse de caisse': 59, 'Hôte / Hôtesse d\'accueil': 59, 'Vestiaire': 48,
    'Employé polyvalent restauration': 52, 'Vendeur boulangerie': 52, 'Ménage': 45,
    'Chef de cuisine': 327, 'Second de cuisine': 177, 'Chef de partie': 118, 'Demi-chef de partie': 82,
    'Commis de cuisine': 56, 'Chocolatier': 98, 'Chef pâtissier': 157, 'Pâtissier': 82,
    'Pâtissier (nuit)': 92, 'Pâtissier en laboratoire': 82, 'Commis de pâtisserie': 52,
    'Boulanger': 75, 'Commis boulanger': 52, 'Crêpier': 62, 'Pizzaiolo': 75, 'Cuisinier Collectif': 65,
    'Écailler': 75, 'Économe': 62, 'Plongeur': 48, 'Préparateur de commandes': 52,
    'Employé polyvalent cuisine': 52, 'Bagagiste': 52, 'Cafetier (hôtel)': 52, 'Concierge': 98,
    'Employé polyvalent d\'hôtel': 56, 'Esthéticienne': 69, 'Femme / Valet de chambre': 51,
    'Gouvernante': 118, 'Linger': 52, 'Manutentionnaire': 48, 'Night Auditor': 92,
    'Premier de réception': 137, 'Réceptionniste': 75, 'Room service': 56, 'Voiturier': 56
  };

  const postes = Object.keys(grillePoste).sort();

  const calculerHeures = () => {
    if (!form.heure_debut || !form.heure_fin) return 0;
    const [debutH, debutM] = form.heure_debut.split(':').map(Number);
    const [finH, finM] = form.heure_fin.split(':').map(Number);
    let debut = debutH + debutM / 60;
    let fin = finH + finM / 60;
    if (fin < debut) fin += 24;
    return Math.round((fin - debut) * 100) / 100;
  };

  const calculerPrixTotal = () => {
    const heures = calculerHeures();
    const total = form.taux_horaire * heures * form.nombre_extras;
    return Math.round(total * 100) / 100;
  };

  useEffect(() => {
    const tarifPoste = grillePoste[form.poste_requis];
    if (tarifPoste) setForm({ ...form, taux_horaire: tarifPoste });
  }, [form.poste_requis]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);

      const { data: etabData } = await supabase.from('etablissements').select('*').eq('email', user.email).single();
      if (etabData) {
        setEtablissement(etabData);
        if (etabData.kbis_statut !== 'validé' || etabData.patente_statut !== 'validé' || etabData.cin_gerant_statut !== 'validé' || etabData.rib_statut !== 'validé') {
          alert('⚠️ Votre profil doit être validé avant de créer des missions.');
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
    await supabase.from('missions').insert([{ ...form, etablissement_id: etablissement.id }]);
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

  const tarifActuel = grillePoste[form.poste_requis];
  const nbHeures = calculerHeures();
  const prixTotal = calculerPrixTotal();

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: bg, minHeight: '100vh', transition: 'background 0.3s ease' }}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(244, 124, 32, 0.3); } 50% { box-shadow: 0 0 40px rgba(244, 124, 32, 0.6), 0 0 60px rgba(244, 124, 32, 0.4); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes countUp { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
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
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="/dashboard-etablissement" style={{ textDecoration: 'none', color: textSecondary, fontWeight: 600, fontSize: '14px', padding: '10px 16px', borderRadius: '10px' }}>
            ← Retour
          </a>
          <button onClick={() => setDarkMode(!darkMode)} style={{ background: darkMode ? 'rgba(255,255,255,0.1)' : '#f5f5f5', border: 'none', width: '40px', height: '40px', borderRadius: '10px', cursor: 'pointer', fontSize: '18px' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ marginBottom: '32px', animation: 'slideIn 0.6s ease' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px 0', color: textPrimary }}>Créer une mission</h1>
          <p style={{ color: textSecondary, fontSize: '15px', margin: 0 }}>Configurez votre mission et découvrez le prix instantanément</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
          {/* FORMULAIRE */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* INFO GÉNÉRALES */}
            <div style={{ background: cardBg, backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '28px', boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)', border: `1px solid ${borderColor}` }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: textPrimary }}>📋 Informations</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px', color: textPrimary }}>Titre *</label>
                  <input required value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} placeholder="Ex: Serveur événement VIP" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${borderColor}`, fontSize: '15px', outline: 'none', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', color: textPrimary, boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px', color: textPrimary }}>Secteur *</label>
                    <select required value={form.secteur} onChange={(e) => setForm({ ...form, secteur: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${borderColor}`, fontSize: '15px', outline: 'none', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', color: textPrimary, boxSizing: 'border-box' }}>
                      {secteurs.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px', color: textPrimary }}>Poste *</label>
                    <select required value={form.poste_requis} onChange={(e) => setForm({ ...form, poste_requis: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${borderColor}`, fontSize: '15px', outline: 'none', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', color: textPrimary, boxSizing: 'border-box' }}>
                      {postes.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px', color: textPrimary }}>Lieu *</label>
                  <input required value={form.lieu} onChange={(e) => setForm({ ...form, lieu: e.target.value })} placeholder="Ex: Casablanca, Anfa" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${borderColor}`, fontSize: '15px', outline: 'none', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', color: textPrimary, boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

            {/* DATE & HORAIRES */}
            <div style={{ background: cardBg, backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '28px', boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)', border: `1px solid ${borderColor}` }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: textPrimary }}>🕐 Planification</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px', color: textPrimary }}>Date *</label>
                  <input type="date" required value={form.date_mission} onChange={(e) => setForm({ ...form, date_mission: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${borderColor}`, fontSize: '15px', outline: 'none', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', color: textPrimary, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px', color: textPrimary }}>Début *</label>
                  <input type="time" required value={form.heure_debut} onChange={(e) => setForm({ ...form, heure_debut: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${borderColor}`, fontSize: '15px', outline: 'none', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', color: textPrimary, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px', color: textPrimary }}>Fin *</label>
                  <input type="time" required value={form.heure_fin} onChange={(e) => setForm({ ...form, heure_fin: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${borderColor}`, fontSize: '15px', outline: 'none', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', color: textPrimary, boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

            {/* EFFECTIF */}
            <div style={{ background: cardBg, backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '28px', boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)', border: `1px solid ${borderColor}` }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: textPrimary }}>👥 Effectif</h2>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px', color: textPrimary }}>Nombre d&apos;extras *</label>
                <input type="number" min="1" required value={form.nombre_extras} onChange={(e) => setForm({ ...form, nombre_extras: parseInt(e.target.value) })} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${borderColor}`, fontSize: '15px', outline: 'none', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', color: textPrimary, boxSizing: 'border-box' }} />
              </div>
            </div>

            {/* COMPÉTENCES */}
            <div style={{ background: cardBg, backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '28px', boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)', border: `1px solid ${borderColor}` }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: textPrimary }}>⭐ Compétences (optionnel)</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {competences.map(comp => (
                  <label key={comp} style={{ cursor: 'pointer', background: form.competences_requises.includes(comp) ? 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)' : darkMode ? 'rgba(255,255,255,0.05)' : '#f9f9f9', color: form.competences_requises.includes(comp) ? '#fff' : textPrimary, padding: '8px 14px', borderRadius: '20px', border: `2px solid ${form.competences_requises.includes(comp) ? 'transparent' : borderColor}`, fontSize: '13px', fontWeight: 600, transition: 'all 0.2s ease' }}>
                    <input type="checkbox" checked={form.competences_requises.includes(comp)} onChange={() => toggleCompetence(comp)} style={{ display: 'none' }} />
                    {comp}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="/dashboard-etablissement" style={{ flex: 1, background: darkMode ? 'rgba(255,255,255,0.05)' : '#f5f5f5', color: textPrimary, border: `2px solid ${borderColor}`, padding: '16px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                Annuler
              </a>
              <button type="submit" disabled={saving} style={{ flex: 2, background: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)', color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(244, 124, 32, 0.3)' }}>
                {saving ? '⏳ Création...' : '🚀 Créer la mission'}
              </button>
            </div>
          </form>

          {/* CALCULATEUR DE PRIX - STICKY */}
          <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
            {/* TARIF HORAIRE */}
            <div style={{ 
              background: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)',
              borderRadius: '28px', 
              padding: '32px', 
              marginBottom: '20px',
              boxShadow: '0 20px 60px rgba(244, 124, 32, 0.4)',
              animation: 'glow 3s ease-in-out infinite',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(60px)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: '12px', letterSpacing: '1px' }}>💰 TARIF FOODFORCE</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>{form.poste_requis}</div>
                <div style={{ fontSize: '56px', fontWeight: 900, color: '#fff', lineHeight: '1', marginBottom: '8px', animation: 'countUp 0.6s ease' }}>{tarifActuel}</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>MAD/heure</div>
              </div>
            </div>

            {/* DÉTAILS DU CALCUL */}
            {nbHeures > 0 && (
              <div style={{ background: cardBg, backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '24px', boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)', border: `1px solid ${borderColor}`, marginBottom: '20px', animation: 'slideUp 0.5s ease' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: textSecondary, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Détails</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: darkMode ? 'rgba(255,255,255,0.03)' : '#fafafa', borderRadius: '12px' }}>
                    <span style={{ fontSize: '14px', color: textSecondary }}>⏱️ Durée</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: textPrimary }}>{nbHeures}h</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: darkMode ? 'rgba(255,255,255,0.03)' : '#fafafa', borderRadius: '12px' }}>
                    <span style={{ fontSize: '14px', color: textSecondary }}>💵 Taux horaire</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: textPrimary }}>{tarifActuel} MAD</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: darkMode ? 'rgba(255,255,255,0.03)' : '#fafafa', borderRadius: '12px' }}>
                    <span style={{ fontSize: '14px', color: textSecondary }}>👥 Extras</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: textPrimary }}>{form.nombre_extras}</span>
                  </div>
                </div>
              </div>
            )}

            {/* PRIX TOTAL */}
            {prixTotal > 0 && (
              <div style={{ 
                background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                borderRadius: '28px', 
                padding: '36px', 
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(34, 197, 94, 0.4)',
                animation: 'slideUp 0.6s ease, glow 3s ease-in-out infinite',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', filter: 'blur(60px)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: '16px', letterSpacing: '1.5px' }}>💵 PRIX TOTAL</div>
                  <div style={{ fontSize: '64px', fontWeight: 900, color: '#fff', lineHeight: '1', marginBottom: '12px', animation: 'countUp 0.8s ease' }}>
                    {prixTotal.toLocaleString('fr-MA', { maximumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: '20px' }}>MAD</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.15)', padding: '10px 16px', borderRadius: '12px', display: 'inline-block' }}>
                    {tarifActuel} × {nbHeures}h × {form.nombre_extras}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}