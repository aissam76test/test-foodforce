'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const postesParCategorie: any = {
  'Poste en Salle': ['Directeur Food & Beverage', 'Directeur', 'Manager', 'Responsable de salle', 'Maitre d\'hôtel', 'Assistant maitre d\'hôtel', 'Chef de Rang', 'Serveur', 'Runner', 'Officier', 'Limonadier', 'Garçon de café', 'Chef barman', 'Barman', 'Commis de salle', 'Barista', 'Cafetier', 'Sommelier', 'Hôte / Hôtesse de caisse', 'Hôte / Hôtesse d\'accueil', 'Vestiaire', 'Employé polyvalent restauration', 'Vendeur boulangerie', 'Ménage'],
  'Poste en Cuisine': ['Chef de cuisine', 'Second de cuisine', 'Chef de partie', 'Demi-chef de partie', 'Commis de cuisine', 'Chocolatier', 'Chef pâtissier', 'Pâtissier', 'Pâtissier (nuit)', 'Pâtissier en laboratoire', 'Commis de pâtisserie', 'Boulanger', 'Commis boulanger', 'Crêpier', 'Pizzaiolo', 'Cuisinier Collective', 'Ecailler', 'Econome', 'Plongeur', 'Préparateur de commandes', 'Employé polyvalent cuisine'],
  'Poste en Hôtel': ['Bagagiste', 'Cafetier', 'Concierge', 'Employé polyvalent d\'hôtel', 'Esthéticienne', 'Femme / Valet de chambre', 'Gouvernante', 'Linger', 'Manutentionnaire', 'Night Auditor', 'Premier de réception', 'Réceptionniste', 'Room service', 'Voiturier']
};

const competencesList = ['Service en salle', 'Barista', 'Mixologie', 'Cuisine française', 'Pâtisserie', 'HACCP', 'Caisse', 'Accueil client', 'Gestion de stock', 'Management'];
const languesList = ['Arabe', 'Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien', 'Darija'];
const niveauxLangue = ['A1 - Débutant', 'A2 - Élémentaire', 'B1 - Intermédiaire', 'B2 - Avancé', 'C1 - Courant', 'C2 - Bilingue'];

export default function Profil() {
  const [onglet, setOnglet] = useState<'profil' | 'missions' | 'mci'>('profil');
  const [user, setUser] = useState<any>(null);
  const [extra, setExtra] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [missions, setMissions] = useState<any[]>([]);
  const [missionsAcceptees, setMissionsAcceptees] = useState<any[]>([]);
  const [candidatures, setCandidatures] = useState<string[]>([]);
  const [selectedMCI, setSelectedMCI] = useState<string[]>([]);

  const [form, setForm] = useState<any>({
    nom: '', prenom: '', telephone: '', adresse: '', code_postal: '',
    date_naissance: '', genre: '', bio: '', statut_pro: 'Extra - Auto-entrepreneur',
    numero_patente: '', disponible: true, accepte_alcool: false,
    rayon_mobilite: 10, postes: [], competences: [], langues: [], experiences: []
  });

  const [newExp, setNewExp] = useState({ titre: '', entreprise: '', date_debut: '', date_fin: '', description: '', referent_nom: '', referent_tel: '' });
  const [newLangue, setNewLangue] = useState({ langue: '', niveau: 'A1 - Débutant' });
  const [newComp, setNewComp] = useState('');

  useEffect(() => {
    // Lire le paramètre URL pour ouvrir le bon onglet
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'missions' || tab === 'mci' || tab === 'profil') {
      setOnglet(tab as any);
    }
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);

      const { data } = await supabase.from('extras').select('*').eq('email', user.email).single();
      if (data) {
        setExtra(data);
        setForm({
          nom: data.nom || '', prenom: data.prenom || '', telephone: data.telephone || '',
          adresse: data.adresse || '', code_postal: data.code_postal || '',
          date_naissance: data.date_naissance || '', genre: data.genre || '',
          bio: data.bio || '', statut_pro: 'Extra - Auto-entrepreneur',
          numero_patente: data.numero_patente || '', disponible: data.disponible ?? true,
          accepte_alcool: data.accepte_alcool ?? false, rayon_mobilite: data.rayon_mobilite || 10,
          postes: data.postes || [], competences: data.competences || [],
          langues: data.langues || [], experiences: data.experiences || []
        });
        if (data.photo_url) setPhotoUrl(data.photo_url);

        // Charger missions disponibles
        const { data: missionsData } = await supabase
          .from('missions')
          .select('*')
          .eq('statut', 'ouverte')
          .order('date_mission', { ascending: true });
        setMissions(missionsData || []);

        // Charger candidatures de cet extra
        const { data: cands } = await supabase
          .from('candidatures')
          .select('mission_id')
          .eq('extra_id', data.id);
        setCandidatures((cands || []).map((c: any) => c.mission_id));

        // Charger missions acceptées pour MCI
        const { data: acceptees } = await supabase
          .from('candidatures')
          .select('mission_id, missions(*)')
          .eq('extra_id', data.id)
          .eq('statut', 'accepté');
        setMissionsAcceptees((acceptees || []).map((c: any) => c.missions));
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const postuler = async (missionId: string) => {
    if (!extra) return;
    await supabase.from('candidatures').insert([{ mission_id: missionId, extra_id: extra.id, statut: 'en_attente' }]);
    setCandidatures([...candidatures, missionId]);
  };

  const calculerDuree = (debut: string, fin: string) => {
    const [h1, m1] = debut.split(':').map(Number);
    const [h2, m2] = fin.split(':').map(Number);
    return ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60;
  };

  const genererMCI = () => {
    const missionsFact = missionsAcceptees.filter(m => selectedMCI.includes(m.id));
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(244, 124, 32);
    doc.text('FoodForce', 14, 20);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('Moroccan Contractor Invoice (MCI)', 14, 28);
    doc.setFontSize(12);
    doc.text('Prestataire :', 14, 45);
    doc.setFontSize(10);
    doc.text(`${extra?.prenom} ${extra?.nom}`, 14, 52);
    doc.text(`Email : ${extra?.email}`, 14, 58);
    doc.text(`Téléphone : ${extra?.telephone || '-'}`, 14, 64);
    doc.text(`N° Patente : ${extra?.numero_patente || '-'}`, 14, 70);
    doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 150, 45);
    doc.setDrawColor(244, 124, 32);
    doc.line(14, 78, 196, 78);
    const rows = missionsFact.map(m => {
      const duree = calculerDuree(m.heure_debut, m.heure_fin);
      const total = (duree * m.taux_horaire).toFixed(2);
      return [m.titre, new Date(m.date_mission).toLocaleDateString('fr-FR'), `${m.heure_debut} - ${m.heure_fin}`, `${duree}h`, `${m.taux_horaire} MAD/h`, `${total} MAD`];
    });
    autoTable(doc, {
      startY: 85,
      head: [['Mission', 'Date', 'Horaires', 'Durée', 'Taux', 'Total']],
      body: rows,
      headStyles: { fillColor: [244, 124, 32] },
      styles: { fontSize: 9 }
    });
    const totalGeneral = missionsFact.reduce((acc, m) => acc + calculerDuree(m.heure_debut, m.heure_fin) * m.taux_horaire, 0);
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(244, 124, 32);
    doc.text(`Total général : ${totalGeneral.toFixed(2)} MAD`, 140, finalY);
    doc.save(`MCI_${extra?.nom}_${new Date().toLocaleDateString('fr-FR')}.pdf`);
  };

  const handlePhoto = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    await supabase.storage.from('photos').upload(fileName, file, { upsert: true });
    const { data } = supabase.storage.from('photos').getPublicUrl(fileName);
    await supabase.from('extras').update({ photo_url: data.publicUrl }).eq('email', user.email);
    setPhotoUrl(data.publicUrl);
    setUploading(false);
  };

  const handleDocument = async (file: File, docType: string) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('userId', user.id);
    fd.append('docType', docType);
    fd.append('userType', 'extras');
    await fetch('/api/upload-document', { method: 'POST', body: fd });
    window.location.reload();
  };

  const togglePoste = (poste: string) => {
    const postes = form.postes || [];
    if (postes.includes(poste)) {
      setForm({ ...form, postes: postes.filter((p: string) => p !== poste) });
    } else {
      setForm({ ...form, postes: [...postes, poste] });
    }
  };

  const addExperience = () => {
    if (!newExp.titre || !newExp.entreprise) return;
    setForm({ ...form, experiences: [...(form.experiences || []), newExp] });
    setNewExp({ titre: '', entreprise: '', date_debut: '', date_fin: '', description: '', referent_nom: '', referent_tel: '' });
  };

  const addLangue = () => {
    if (!newLangue.langue) return;
    setForm({ ...form, langues: [...(form.langues || []), newLangue] });
    setNewLangue({ langue: '', niveau: 'A1 - Débutant' });
  };

  const addComp = () => {
    if (!newComp || (form.competences || []).includes(newComp)) return;
    setForm({ ...form, competences: [...(form.competences || []), newComp] });
    setNewComp('');
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('extras').update(form).eq('email', user.email);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'Poppins, sans-serif' }}>Chargement...</div>;

  const inputStyle: any = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' };
  const cardStyle: any = { background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '20px' };
  const sectionTitle: any = { fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: '#1a1a1a' };

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* NAV */}
      <nav style={{ background: 'white', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div>
          <a href="/dashboard-extra" style={{ textDecoration: 'none' }}>
            <span style={{ fontWeight: 800, fontSize: '20px', color: '#1a1a1a' }}>Food</span>
            <span style={{ fontWeight: 800, fontSize: '20px', color: '#F47C20' }}>Force</span>
          </a>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {saved && <span style={{ color: '#22c55e', fontWeight: 600, fontSize: '14px' }}>✅ Sauvegardé !</span>}
          <button onClick={handleLogout} style={{ background: '#f5f5f5', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
            Se déconnecter
          </button>
        </div>
      </nav>

      {/* ONGLETS */}
      <div style={{ background: 'white', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'center', gap: '0' }}>
        {[
          { key: 'profil', label: '👤 Mon profil' },
          { key: 'missions', label: '🎯 Missions disponibles' },
          { key: 'mci', label: '📄 Mes factures (MCI)' },
        ].map((o) => (
          <button key={o.key} onClick={() => setOnglet(o.key as any)}
            style={{ padding: '16px 32px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: onglet === o.key ? 700 : 400, fontSize: '14px', color: onglet === o.key ? '#F47C20' : '#666', borderBottom: onglet === o.key ? '3px solid #F47C20' : '3px solid transparent', fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s' }}>
            {o.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>

        {/* ===== ONGLET MISSIONS ===== */}
        {onglet === 'missions' && (
          <div>
            {missions.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', color: '#666' }}>Aucune mission disponible pour le moment.</div>
            ) : (
              missions.map(m => {
                const duree = calculerDuree(m.heure_debut, m.heure_fin);
                const dejaPostule = candidatures.includes(m.id);
                return (
                  <div key={m.id} style={{ ...cardStyle }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{m.titre}</h3>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                          <span style={{ background: '#f0f0f0', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>{m.secteur}</span>
                          <span style={{ background: '#f0f0f0', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>📍 {m.lieu || 'Casablanca'}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: '#F47C20' }}>{m.taux_horaire} MAD/h</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>gain net</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>📅 Date</div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{new Date(m.date_mission).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</div>
                      </div>
                      <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>⏰ Horaires</div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{m.heure_debut}-{m.heure_fin}</div>
                      </div>
                      <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>👥 Postes</div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{m.nombre_extras}</div>
                      </div>
                    </div>
                    <button onClick={() => !dejaPostule && postuler(m.id)} disabled={dejaPostule}
                      style={{ width: '100%', background: dejaPostule ? '#f0f0f0' : '#F47C20', color: dejaPostule ? '#888' : 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '15px', cursor: dejaPostule ? 'default' : 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                      {dejaPostule ? '✅ Déjà postulé' : '🚀 Postuler'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ===== ONGLET MCI ===== */}
        {onglet === 'mci' && (
          <div>
            <div style={{ ...cardStyle }}>
              <h2 style={sectionTitle}>📄 Moroccan Contractor Invoice</h2>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>Sélectionnez les missions à inclure dans votre facture</p>
              {missionsAcceptees.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>Aucune mission acceptée pour le moment.</div>
              ) : (
                <>
                  {missionsAcceptees.map(m => {
                    const duree = calculerDuree(m.heure_debut, m.heure_fin);
                    const total = (duree * m.taux_horaire).toFixed(2);
                    const isSelected = selectedMCI.includes(m.id);
                    return (
                      <div key={m.id} onClick={() => setSelectedMCI(prev => prev.includes(m.id) ? prev.filter(x => x !== m.id) : [...prev, m.id])}
                        style={{ border: `2px solid ${isSelected ? '#F47C20' : '#f0f0f0'}`, borderRadius: '12px', padding: '16px', marginBottom: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontWeight: 700 }}>{m.titre}</div>
                            <div style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>{new Date(m.date_mission).toLocaleDateString('fr-FR')} • {m.heure_debut} - {m.heure_fin} • {duree}h</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 800, color: '#F47C20', fontSize: '18px' }}>{total} MAD</div>
                            <div style={{ fontSize: '12px', color: '#999' }}>{m.taux_horaire} MAD/h</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {selectedMCI.length > 0 && (
                    <button onClick={genererMCI}
                      style={{ width: '100%', background: '#F47C20', color: 'white', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '16px', cursor: 'pointer', marginTop: '8px', fontFamily: 'Poppins, sans-serif' }}>
                      📥 Générer la facture PDF ({selectedMCI.length} mission{selectedMCI.length > 1 ? 's' : ''})
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ===== ONGLET PROFIL ===== */}
        {onglet === 'profil' && (
          <>
            {/* PHOTO */}
            <div style={{ ...cardStyle, textAlign: 'center' }}>
              <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>Votre profil reste anonyme. Seul votre nom et prénom sont visibles.</p>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
                {photoUrl ? (
                  <img src={photoUrl} alt="photo" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: '#999' }}>👤</div>
                )}
              </div>
              <div>
                <label style={{ background: '#F47C20', color: 'white', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                  {uploading ? '⏳ Upload...' : '📷 Changer la photo'}
                  <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            {/* INFOS PERSONNELLES */}
            <div style={cardStyle}>
              <h2 style={sectionTitle}>Informations personnelles</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Nom *</label><input style={inputStyle} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
                <div><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Prénom *</label><input style={inputStyle} value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} /></div>
                <div><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Téléphone *</label><input style={inputStyle} value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /></div>
                <div><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email</label><input style={{ ...inputStyle, background: '#f5f5f5', color: '#888' }} value={extra?.email || ''} disabled /></div>
                <div><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Ville *</label>
                  <select style={inputStyle} value={form.ville || 'Casablanca'} onChange={(e) => setForm({ ...form, ville: e.target.value })}>
                    {['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Genre</label>
                  <select style={inputStyle} value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
                    <option value="">Non spécifié</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                  </select>
                </div>
                <div><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Date de naissance</label><input type="date" style={inputStyle} value={form.date_naissance} onChange={(e) => setForm({ ...form, date_naissance: e.target.value })} /></div>
                <div><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Code postal</label><input style={inputStyle} value={form.code_postal} onChange={(e) => setForm({ ...form, code_postal: e.target.value })} /></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Adresse</label><input style={inputStyle} value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} /></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Bio</label><textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Parlez de vous..." /></div>
              </div>
            </div>

            {/* POSTES */}
            <div style={cardStyle}>
              <h2 style={sectionTitle}>Postes recherchés</h2>
              <div style={{ border: '1.5px solid #e0e0e0', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto', padding: '12px' }}>
                {Object.entries(postesParCategorie).map(([categorie, postes]: any) => (
                  <div key={categorie} style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>📋 {categorie}</div>
                    {postes.map((poste: string) => (
                      <label key={poste} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer', fontSize: '14px' }}>
                        <input type="checkbox" checked={(form.postes || []).includes(poste)} onChange={() => togglePoste(poste)} style={{ accentColor: '#F47C20', width: '16px', height: '16px' }} />
                        {poste}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* STATUT PRO */}
            <div style={cardStyle}>
              <h2 style={sectionTitle}>💼 Statut professionnel</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ gridColumn: '1 / -1' }}><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Statut</label><input style={{ ...inputStyle, background: '#f5f5f5', color: '#888' }} value="Extra - Auto-entrepreneur" disabled /></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Numéro de patente</label><input style={inputStyle} value={form.numero_patente} placeholder="Ex: 12345678" onChange={(e) => setForm({ ...form, numero_patente: e.target.value })} /></div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input type="checkbox" checked={form.disponible} onChange={(e) => setForm({ ...form, disponible: e.target.checked })} style={{ accentColor: '#F47C20', width: '16px', height: '16px' }} />
                  Disponible immédiatement
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input type="checkbox" checked={form.accepte_alcool} onChange={(e) => setForm({ ...form, accepte_alcool: e.target.checked })} style={{ accentColor: '#F47C20', width: '16px', height: '16px' }} />
                  Accepte les établissements servant de l'alcool
                </label>
              </div>
            </div>

            {/* MOBILITE */}
            <div style={cardStyle}>
              <h2 style={sectionTitle}>📍 Mobilité</h2>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Rayon de mobilité (km)</label>
              <input type="number" style={{ ...inputStyle, width: '200px' }} value={form.rayon_mobilite} onChange={(e) => setForm({ ...form, rayon_mobilite: parseInt(e.target.value) })} />
            </div>

            {/* COMPETENCES */}
            <div style={cardStyle}>
              <h2 style={sectionTitle}>Compétences</h2>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <select style={{ ...inputStyle, flex: 1 }} value={newComp} onChange={(e) => setNewComp(e.target.value)}>
                  <option value="">Sélectionnez une compétence</option>
                  {competencesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={addComp} style={{ background: '#F47C20', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>+ Ajouter</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(form.competences || []).map((c: string) => (
                  <span key={c} style={{ background: '#FDF0E8', color: '#F47C20', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {c}<button onClick={() => setForm({ ...form, competences: form.competences.filter((x: string) => x !== c) })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F47C20', fontWeight: 700 }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* LANGUES */}
            <div style={cardStyle}>
              <h2 style={sectionTitle}>Langues</h2>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <select style={{ ...inputStyle, flex: 1 }} value={newLangue.langue} onChange={(e) => setNewLangue({ ...newLangue, langue: e.target.value })}>
                  <option value="">Langue</option>
                  {languesList.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <select style={{ ...inputStyle, flex: 2 }} value={newLangue.niveau} onChange={(e) => setNewLangue({ ...newLangue, niveau: e.target.value })}>
                  {niveauxLangue.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <button onClick={addLangue} style={{ background: '#F47C20', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>+ Ajouter</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(form.langues || []).map((l: any, i: number) => (
                  <span key={i} style={{ background: '#f0f0f0', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {l.langue} — {l.niveau}
                    <button onClick={() => setForm({ ...form, langues: form.langues.filter((_: any, j: number) => j !== i) })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* EXPERIENCES */}
            <div style={cardStyle}>
              <h2 style={sectionTitle}>Expériences professionnelles</h2>
              {(form.experiences || []).map((exp: any, i: number) => (
                <div key={i} style={{ background: '#f9f9f9', borderRadius: '12px', padding: '16px', marginBottom: '12px', position: 'relative' }}>
                  <button onClick={() => setForm({ ...form, experiences: form.experiences.filter((_: any, j: number) => j !== i) })} style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#999' }}>×</button>
                  <div style={{ fontWeight: 700 }}>{exp.titre}</div>
                  <div style={{ color: '#F47C20', fontSize: '13px' }}>{exp.entreprise}</div>
                  <div style={{ color: '#888', fontSize: '12px' }}>{exp.date_debut} → {exp.date_fin || 'Présent'}</div>
                </div>
              ))}
              <div style={{ border: '1.5px solid #e0e0e0', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <input style={inputStyle} placeholder="Titre du poste" value={newExp.titre} onChange={(e) => setNewExp({ ...newExp, titre: e.target.value })} />
                  <input style={inputStyle} placeholder="Entreprise" value={newExp.entreprise} onChange={(e) => setNewExp({ ...newExp, entreprise: e.target.value })} />
                  <input type="date" style={inputStyle} value={newExp.date_debut} onChange={(e) => setNewExp({ ...newExp, date_debut: e.target.value })} />
                  <input type="date" style={inputStyle} value={newExp.date_fin} onChange={(e) => setNewExp({ ...newExp, date_fin: e.target.value })} />
                </div>
                <textarea style={{ ...inputStyle, height: '80px', marginBottom: '12px' }} placeholder="Description" value={newExp.description} onChange={(e) => setNewExp({ ...newExp, description: e.target.value })} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <input style={inputStyle} placeholder="Nom du référent" value={newExp.referent_nom} onChange={(e) => setNewExp({ ...newExp, referent_nom: e.target.value })} />
                  <input style={inputStyle} placeholder="Numéro du référent" value={newExp.referent_tel} onChange={(e) => setNewExp({ ...newExp, referent_tel: e.target.value })} />
                </div>
                <button onClick={addExperience} style={{ width: '100%', background: '#F47C20', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>+ Ajouter l'expérience</button>
              </div>
            </div>

            {/* DOCUMENTS */}
            <div style={cardStyle}>
              <h2 style={sectionTitle}>📄 Documents requis</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { key: 'cin_recto', label: 'CIN Recto', icon: '🪪' },
                  { key: 'cin_verso', label: 'CIN Verso', icon: '🪪' },
                  { key: 'ice', label: 'Carte Auto-Entrepreneur (ICE)', icon: '📋' },
                  { key: 'rib', label: 'RIB', icon: '🏦' },
                ].map((doc) => (
                  <div key={doc.key} style={{ background: '#f9f9f9', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>{doc.icon} {doc.label}</div>
                    {extra?.[`${doc.key}_url`] ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ background: extra?.[`${doc.key}_statut`] === 'validé' ? '#dcfce7' : '#FDF0E8', color: extra?.[`${doc.key}_statut`] === 'validé' ? '#22c55e' : '#F47C20', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{extra?.[`${doc.key}_statut`] || 'en_attente'}</span>
                        <label style={{ color: '#F47C20', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Remplacer<input type="file" accept=".jpg,.jpeg,.png,.pdf" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDocument(f, doc.key); }} /></label>
                      </div>
                    ) : (
                      <label style={{ background: '#F47C20', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'inline-block' }}>
                        📤 Uploader<input type="file" accept=".jpg,.jpeg,.png,.pdf" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDocument(f, doc.key); }} />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* BOUTONS */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
              <a href="/dashboard-extra" style={{ flex: 1, background: 'white', color: '#F47C20', border: '2px solid #F47C20', padding: '16px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'block' }}>Annuler</a>
              <button onClick={handleSave} disabled={saving} style={{ flex: 2, background: '#F47C20', color: 'white', padding: '16px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
                {saving ? 'Sauvegarde...' : '💾 Enregistrer'}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}