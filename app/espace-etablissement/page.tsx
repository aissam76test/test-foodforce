'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const GRILLE_TARIFAIRE: any = {
  "Directeur Food & Beverage": 229.06,
  "Directeur": 196.34,
  "Manager": 75.26,
  "Responsable de salle": 52.36,
  "Maitre d'hôtel": 62.17,
  "Assistant maitre d'hôtel": 42.54,
  "Chef de Rang": 34.36,
  "Serveur": 24.54,
  "Runner": 20.62,
  "Officier": 24.54,
  "Limonadier": 24.54,
  "Garçon de café": 22.25,
  "Chef barman": 42.54,
  "Barman": 27.81,
  "Commis de salle": 20.62,
  "Barista": 24.54,
  "Cafetier": 26.18,
  "Sommelier": 58.90,
  "Hôte / Hôtesse de caisse": 22.25,
  "Hôte / Hôtesse d'accueil": 24.54,
  "Vestiaire": 20.29,
  "Employé polyvalent restauration": 21.27,
  "Vendeur boulangerie": 22.25,
  "Ménage": 19.63,
  "Chef de cuisine": 114.53,
  "Second de cuisine": 62.17,
  "Chef de partie": 37.63,
  "Demi-chef de partie": 31.09,
  "Commis de cuisine": 21.60,
  "Chocolatier": 49.08,
  "Chef pâtissier": 85.08,
  "Pâtissier": 35.99,
  "Pâtissier (nuit)": 39.27,
  "Pâtissier en laboratoire": 34.36,
  "Commis de pâtisserie": 21.60,
  "Boulanger": 31.09,
  "Commis boulanger": 20.62,
  "Crêpier": 24.54,
  "Pizzaiolo": 35.99,
  "Cuisinier Collective": 29.45,
  "Ecailler": 34.36,
  "Econome": 32.72,
  "Plongeur": 18.98,
  "Préparateur de commandes": 21.60,
  "Employé polyvalent cuisine": 21.27,
  "Bagagiste": 21.60,
  "Concierge": 40.90,
  "Employé polyvalent d'hôtel": 21.27,
  "Esthéticienne": 31.09,
  "Femme / Valet de chambre": 19.96,
  "Gouvernante": 42.54,
  "Linger": 18.98,
  "Manutentionnaire": 20.29,
  "Night Auditor": 37.63,
  "Premier de réception": 42.54,
  "Réceptionniste": 29.45,
  "Room service": 24.54,
  "Voiturier": 22.25,
};

const POSTES_PAR_CATEGORIE: any = {
  "🍽️ Salle": ["Directeur Food & Beverage","Directeur","Manager","Responsable de salle","Maitre d'hôtel","Assistant maitre d'hôtel","Chef de Rang","Serveur","Runner","Officier","Limonadier","Garçon de café","Chef barman","Barman","Commis de salle","Barista","Cafetier","Sommelier","Hôte / Hôtesse de caisse","Hôte / Hôtesse d'accueil","Vestiaire","Employé polyvalent restauration","Vendeur boulangerie","Ménage"],
  "👨‍🍳 Cuisine": ["Chef de cuisine","Second de cuisine","Chef de partie","Demi-chef de partie","Commis de cuisine","Chocolatier","Chef pâtissier","Pâtissier","Pâtissier (nuit)","Pâtissier en laboratoire","Commis de pâtisserie","Boulanger","Commis boulanger","Crêpier","Pizzaiolo","Cuisinier Collective","Ecailler","Econome","Plongeur","Préparateur de commandes","Employé polyvalent cuisine"],
  "🏨 Hôtel": ["Bagagiste","Concierge","Employé polyvalent d'hôtel","Esthéticienne","Femme / Valet de chambre","Gouvernante","Linger","Manutentionnaire","Night Auditor","Premier de réception","Réceptionniste","Room service","Voiturier"],
};

export default function EspaceEtablissement() {
  const [user, setUser] = useState<any>(null);
  const [etablissement, setEtablissement] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [candidatures, setCandidatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [onglet, setOnglet] = useState('missions');
  const [showForm, setShowForm] = useState(false);
  const [uploadLoading, setUploadLoading] = useState<string | null>(null);
  const [mission, setMission] = useState({
    titre: '', poste: '', secteur: '', date_mission: '', heure_debut: '', heure_fin: '',
    taux_horaire: 0, nombre_extras: 1, description: ''
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);
      const { data: etab } = await supabase.from('etablissements').select('*').eq('email', user.email).single();
      setEtablissement(etab);
      if (etab) {
        const { data: m } = await supabase.from('missions').select('*').eq('etablissement_id', etab.id).order('created_at', { ascending: false });
        setMissions(m || []);
        const missionIds = (m || []).map((x: any) => x.id);
        if (missionIds.length > 0) {
          const { data: cands } = await supabase
            .from('candidatures')
            .select('*, extras(prenom, nom, photo_url, metier, telephone, email, ville, experience, bio, competences), missions(titre, date_mission, heure_debut, heure_fin)')
            .in('mission_id', missionIds)
            .order('created_at', { ascending: false });
          setCandidatures(cands || []);
        }
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const handlePosteChange = (poste: string) => {
    const taux = GRILLE_TARIFAIRE[poste] || 0;
    let secteur = '';
    if (POSTES_PAR_CATEGORIE["🍽️ Salle"].includes(poste)) secteur = 'salle';
    else if (POSTES_PAR_CATEGORIE["👨‍🍳 Cuisine"].includes(poste)) secteur = 'cuisine';
    else if (POSTES_PAR_CATEGORIE["🏨 Hôtel"].includes(poste)) secteur = 'hotel';
    setMission({ ...mission, poste, taux_horaire: taux, secteur, titre: poste });
  };

  const calculerDuree = () => {
    if (!mission.heure_debut || !mission.heure_fin) return 0;
    const [hd, md] = mission.heure_debut.split(':').map(Number);
    const [hf, mf] = mission.heure_fin.split(':').map(Number);
    const duree = (hf * 60 + mf - hd * 60 - md) / 60;
    return duree > 0 ? duree : 0;
  };

  const duree = calculerDuree();
  const coutTotal = Math.round(mission.taux_horaire * duree * mission.nombre_extras);

  const handleMission = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.from('missions').insert([{
      etablissement_id: etablissement.id,
      titre: mission.titre || mission.poste,
      secteur: mission.secteur,
      date_mission: mission.date_mission,
      heure_debut: mission.heure_debut,
      heure_fin: mission.heure_fin,
      taux_horaire: mission.taux_horaire,
      nombre_extras: mission.nombre_extras,
      description: mission.description,
      statut: 'ouverte'
    }]);
    if (!error) {
      const { data: m } = await supabase.from('missions').select('*').eq('etablissement_id', etablissement.id).order('created_at', { ascending: false });
      setMissions(m || []);
      setShowForm(false);
      setMission({ titre: '', poste: '', secteur: '', date_mission: '', heure_debut: '', heure_fin: '', taux_horaire: 0, nombre_extras: 1, description: '' });
    }
  };

  const handleUpload = async (file: File, champ: string, urlKey: string) => {
    if (!file) return;
    setUploadLoading(champ);
    const ext = file.name.split('.').pop();
    const path = `etablissements/${etablissement.id}/${champ}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('Document').upload(path, file, { upsert: true });
    if (uploadError) { setUploadLoading(null); return; }
    const { data } = supabase.storage.from('Document').getPublicUrl(path);
    await supabase.from('etablissements').update({ [urlKey]: data.publicUrl }).eq('id', etablissement.id);
    setEtablissement({ ...etablissement, [urlKey]: data.publicUrl });
    setUploadLoading(null);
  };

  const accepterCandidature = async (candidatureId: string) => {
    await supabase.from('candidatures').update({ statut: 'accepté' }).eq('id', candidatureId);
    setCandidatures(candidatures.map(c => c.id === candidatureId ? { ...c, statut: 'accepté' } : c));
  };

  const refuserCandidature = async (candidatureId: string) => {
    await supabase.from('candidatures').update({ statut: 'rejeté' }).eq('id', candidatureId);
    setCandidatures(candidatures.map(c => c.id === candidatureId ? { ...c, statut: 'rejeté' } : c));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'Poppins, sans-serif' }}>Chargement...</div>;

  const inputStyle: any = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' };

  const docs = [
    { label: 'Registre de commerce (KBIS)', champ: 'kbis', urlKey: 'kbis_url', statutKey: 'kbis_statut' },
    { label: 'Patente', champ: 'patente', urlKey: 'patente_url', statutKey: 'patente_statut' },
    { label: 'CIN du gérant', champ: 'cin_gerant', urlKey: 'cin_gerant_url', statutKey: 'cin_gerant_statut' },
    { label: 'RIB professionnel', champ: 'rib', urlKey: 'rib_url', statutKey: 'rib_statut' },
  ];

  const statutBadge = (statut: string) => {
    const colors: any = {
      'validé':     { bg: '#dcfce7', color: '#22c55e' },
      'accepté':    { bg: '#dcfce7', color: '#22c55e' },
      'rejeté':     { bg: '#fee2e2', color: '#ef4444' },
      'en_attente': { bg: '#FDF0E8', color: '#F47C20' },
    };
    const c = colors[statut] || colors['en_attente'];
    return (
      <span style={{ background: c.bg, color: c.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
        {statut || 'en_attente'}
      </span>
    );
  };

  const pendingCandidatures = candidatures.filter(c => c.statut === 'en_attente').length;

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>

      <nav style={{ background: 'white', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#1a1a1a' }}>Food</span>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#F47C20' }}>Force</span>
          <span style={{ fontSize: '13px', color: '#888', marginLeft: '12px' }}>Espace Recruteur</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{etablissement?.nom}</span>
          <button onClick={handleLogout} style={{ background: '#f5f5f5', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>Se déconnecter</button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>

        {etablissement?.statut !== 'validé' && (
          <div style={{ background: '#FDF0E8', border: '2px solid #F47C20', borderRadius: '16px', padding: '24px', marginBottom: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
            <h3 style={{ fontWeight: 700, margin: '0 0 8px' }}>Dossier en cours de validation</h3>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Notre équipe vérifie votre dossier. Vous pourrez poster des missions une fois validé.</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { id: 'missions', label: '📋 Missions' },
            { id: 'candidatures', label: `👥 Candidatures${pendingCandidatures > 0 ? ` (${pendingCandidatures})` : ''}` },
            { id: 'documents', label: '📄 Documents' },
          ].map(o => (
            <button key={o.id} onClick={() => setOnglet(o.id)}
              style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', background: onglet === o.id ? '#F47C20' : 'white', color: onglet === o.id ? 'white' : '#1a1a1a', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              {o.label}
            </button>
          ))}
        </div>

        {/* ── MISSIONS ── */}
        {onglet === 'missions' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Missions postées', value: missions.length, icon: '📋' },
                { label: 'Missions ouvertes', value: missions.filter(m => m.statut === 'ouverte').length, icon: '🟢' },
                { label: 'Missions fermées', value: missions.filter(m => m.statut === 'fermée').length, icon: '🔴' },
              ].map((stat) => (
                <div key={stat.label} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#F47C20' }}>{stat.value}</div>
                  <div style={{ fontSize: '13px', color: '#888' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {etablissement?.statut === 'validé' && (
              <button onClick={() => setShowForm(!showForm)}
                style={{ background: '#F47C20', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '15px', marginBottom: '24px' }}>
                {showForm ? '✕ Annuler' : '+ Poster une mission'}
              </button>
            )}

            {showForm && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>Nouvelle mission</h2>
                <form onSubmit={handleMission}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Poste recherché *</label>
                      <select required style={inputStyle} value={mission.poste} onChange={(e) => handlePosteChange(e.target.value)}>
                        <option value="">Choisir un poste</option>
                        {Object.entries(POSTES_PAR_CATEGORIE).map(([categorie, postes]: any) => (
                          <optgroup key={categorie} label={categorie}>
                            {postes.map((p: string) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    {mission.poste && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <div style={{ background: '#FDF0E8', borderRadius: '12px', padding: '16px' }}>
                          <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Taux horaire FoodForce (commission incluse)</div>
                          <div style={{ fontSize: '24px', fontWeight: 800, color: '#F47C20' }}>{mission.taux_horaire} MAD/h</div>
                        </div>
                      </div>
                    )}

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Titre de l'annonce *</label>
                      <input required style={inputStyle} value={mission.titre} placeholder="Ex: Serveur pour soirée privée" onChange={(e) => setMission({ ...mission, titre: e.target.value })} />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Date *</label>
                      <input type="date" required style={inputStyle} value={mission.date_mission} onChange={(e) => setMission({ ...mission, date_mission: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Nombre d'extras *</label>
                      <input type="number" required min="1" style={inputStyle} value={mission.nombre_extras} onChange={(e) => setMission({ ...mission, nombre_extras: parseInt(e.target.value) })} />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Heure début *</label>
                      <input type="time" required style={inputStyle} value={mission.heure_debut} onChange={(e) => setMission({ ...mission, heure_debut: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Heure fin *</label>
                      <input type="time" required style={inputStyle} value={mission.heure_fin} onChange={(e) => setMission({ ...mission, heure_fin: e.target.value })} />
                    </div>

                    {duree > 0 && mission.poste && (
                      <div style={{ gridColumn: '1 / -1', background: '#1a1a1a', borderRadius: '12px', padding: '20px', color: 'white' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>📊 Résumé de la mission</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                          <div>
                            <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Durée</div>
                            <div style={{ fontWeight: 700 }}>{duree.toFixed(1)}h</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Coût total</div>
                            <div style={{ fontWeight: 700, color: '#F47C20', fontSize: '18px' }}>{coutTotal} MAD</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Description</label>
                      <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={mission.description} placeholder="Décrivez la mission, les attentes..." onChange={(e) => setMission({ ...mission, description: e.target.value })} />
                    </div>
                  </div>

                  <button type="submit" style={{ width: '100%', background: '#F47C20', color: 'white', padding: '16px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginTop: '16px' }}>
                    Publier la mission
                  </button>
                </form>
              </div>
            )}

            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>Mes missions</h2>
              {missions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
                  <p>Aucune mission postée pour l'instant</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {missions.map((m) => {
                    const nbCands = candidatures.filter(c => c.mission_id === m.id).length;
                    const nbPending = candidatures.filter(c => c.mission_id === m.id && c.statut === 'en_attente').length;
                    return (
                      <div key={m.id} style={{ border: '1.5px solid #f0f0f0', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '16px' }}>{m.titre}</div>
                          <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>
                            📅 {m.date_mission} · ⏰ {m.heure_debut} - {m.heure_fin} · 💰 {m.taux_horaire} MAD/h · 👥 {m.nombre_extras} extra(s)
                          </div>
                          {nbCands > 0 && (
                            <div style={{ marginTop: '6px', fontSize: '13px', color: '#F47C20', fontWeight: 600 }}>
                              {nbCands} candidature(s) {nbPending > 0 ? `· ${nbPending} en attente` : ''}
                            </div>
                          )}
                        </div>
                        <span style={{ background: m.statut === 'ouverte' ? '#dcfce7' : '#f0f0f0', color: m.statut === 'ouverte' ? '#22c55e' : '#888', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
                          {m.statut}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── CANDIDATURES ── */}
        {onglet === 'candidatures' && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Candidatures reçues</h2>
            {candidatures.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '16px', padding: '60px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>👥</div>
                <p style={{ color: '#888' }}>Aucune candidature reçue pour le moment</p>
              </div>
            ) : (
              candidatures.map(c => {
                const extra = c.extras;
                const mission = c.missions;
                return (
                  <div key={c.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#888' }}>
                      📋 Mission : <strong style={{ color: '#1a1a1a' }}>{mission?.titre}</strong> · 📅 {mission?.date_mission} · ⏰ {mission?.heure_debut} - {mission?.heure_fin}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        {extra?.photo_url ? (
                          <img src={extra.photo_url} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#F47C20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '20px' }}>
                            {extra?.prenom?.[0]}{extra?.nom?.[0]}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '16px' }}>{extra?.prenom} {extra?.nom}</div>
                          <div style={{ color: '#888', fontSize: '13px' }}>{extra?.metier} · {extra?.ville}</div>
                          {extra?.bio && <div style={{ color: '#666', fontSize: '13px', marginTop: '4px', maxWidth: '400px' }}>{extra.bio}</div>}
                        </div>
                      </div>
                      {statutBadge(c.statut)}
                    </div>
                    {extra?.competences && extra.competences.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                        {extra.competences.map((comp: string) => (
                          <span key={comp} style={{ background: '#FDF0E8', color: '#F47C20', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{comp}</span>
                        ))}
                      </div>
                    )}
                    {c.statut === 'en_attente' && (
                      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                        <button onClick={() => accepterCandidature(c.id)}
                          style={{ flex: 1, background: '#22c55e', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>
                          ✅ Accepter
                        </button>
                        <button onClick={() => refuserCandidature(c.id)}
                          style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>
                          ❌ Refuser
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── DOCUMENTS ── */}
        {onglet === 'documents' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Documents requis</h2>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>Formats acceptés : JPEG, PNG, PDF (max 2 Mo)</p>
            {docs.map(({ label, champ, urlKey, statutKey }) => {
              const url = etablissement?.[urlKey];
              const statut = etablissement?.[statutKey] || 'en_attente';
              return (
                <div key={champ} style={{ border: '1.5px solid #f0f0f0', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>{label}</div>
                    {statutBadge(statut)}
                  </div>
                  {url ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', color: '#22c55e', fontWeight: 600 }}>✅ Document uploadé</span>
                      <a href={url} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#F47C20', fontWeight: 600, textDecoration: 'none' }}>Voir le document</a>
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>Aucun document uploadé</div>
                  )}
                  {statut !== 'validé' && (
                    <label style={{ display: 'inline-block', cursor: 'pointer' }}>
                      <input type="file" accept=".jpg,.jpeg,.png,.pdf" style={{ display: 'none' }}
                        onChange={(e) => { const file = e.target.files?.[0]; if (file) handleUpload(file, champ, urlKey); }} />
                      <span style={{ background: uploadLoading === champ ? '#ccc' : '#1a1a1a', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>
                        {uploadLoading === champ ? 'Upload en cours...' : url ? '🔄 Remplacer' : '⬆️ Uploader'}
                      </span>
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}