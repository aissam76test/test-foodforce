'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const postesParCategorie: any = {
  'Poste en Salle': ['Directeur Food & Beverage', 'Directeur', 'Manager', 'Responsable de salle', 'Maitre d\'hôtel', 'Assistant maitre d\'hôtel', 'Chef de Rang', 'Serveur', 'Runner', 'Officier', 'Limonadier', 'Garçon de café', 'Chef barman', 'Barman', 'Commis de salle', 'Barista', 'Cafetier', 'Sommelier', 'Hôte / Hôtesse de caisse', 'Hôte / Hôtesse d\'accueil', 'Vestiaire', 'Employé polyvalent restauration', 'Vendeur boulangerie', 'Ménage'],
  'Poste en Cuisine': ['Chef de cuisine', 'Second de cuisine', 'Chef de partie', 'Demi-chef de partie', 'Commis de cuisine', 'Chocolatier', 'Chef pâtissier', 'Pâtissier', 'Pâtissier (nuit)', 'Pâtissier en laboratoire', 'Commis de pâtisserie', 'Boulanger', 'Commis boulanger', 'Crêpier', 'Pizzaiolo', 'Cuisinier Collective', 'Ecailler', 'Econome', 'Plongeur', 'Préparateur de commandes', 'Employé polyvalent cuisine'],
  'Poste en Hôtel': ['Bagagiste', 'Cafetier', 'Concierge', 'Employé polyvalent d\'hôtel', 'Esthéticienne', 'Femme / Valet de chambre', 'Gouvernante', 'Linger', 'Manutentionnaire', 'Night Auditor', 'Premier de réception', 'Réceptionniste', 'Room service', 'Voiturier']
};

const competencesList = ['Service en salle', 'Barista', 'Mixologie', 'Cuisine française', 'Pâtisserie', 'HACCP', 'Caisse', 'Accueil client', 'Gestion de stock', 'Management'];
const languesList = ['Arabe', 'Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien', 'Darija'];
const niveauxLangue = ['A1 - Débutant', 'A2 - Élémentaire', 'B1 - Intermédiaire', 'B2 - Avancé', 'C1 - Courant', 'C2 - Bilingue'];

export default function Profil() {
  const [user, setUser] = useState<any>(null);
  const [extra, setExtra] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
      <nav style={{ background: 'white', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#1a1a1a' }}>Food</span>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#F47C20' }}>Force</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {saved && <span style={{ color: '#22c55e', fontWeight: 600, fontSize: '14px' }}>✅ Sauvegardé !</span>}
          <button onClick={handleLogout} style={{ background: '#f5f5f5', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
            Se déconnecter
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>

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
            <p style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>JPG, PNG ou GIF. Max 5 MB</p>
          </div>
        </div>

        {/* INFOS PERSONNELLES */}
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Informations personnelles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Nom *</label>
              <input style={inputStyle} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Prénom *</label>
              <input style={inputStyle} value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Téléphone *</label>
              <input style={inputStyle} value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email (non modifiable)</label>
              <input style={{ ...inputStyle, background: '#f5f5f5', color: '#888' }} value={extra?.email || ''} disabled />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Ville *</label>
              <select style={inputStyle} value={form.ville || 'Casablanca'} onChange={(e) => setForm({ ...form, ville: e.target.value })}>
                <option>Casablanca</option>
                <option>Rabat</option>
                <option>Marrakech</option>
                <option>Tanger</option>
                <option>Agadir</option>
                <option>Fès</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Genre</label>
              <select style={inputStyle} value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
                <option value="">Non spécifié</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Date de naissance</label>
              <input type="date" style={inputStyle} value={form.date_naissance} onChange={(e) => setForm({ ...form, date_naissance: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Code postal</label>
              <input style={inputStyle} value={form.code_postal} onChange={(e) => setForm({ ...form, code_postal: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Adresse</label>
              <input style={inputStyle} value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Bio / Présentation</label>
              <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Parlez de vous, de votre parcours, de vos motivations..." />
            </div>
          </div>
        </div>

        {/* POSTES */}
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Postes recherchés</h2>
          <div style={{ border: '1.5px solid #e0e0e0', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto', padding: '12px' }}>
            {Object.entries(postesParCategorie).map(([categorie, postes]: any) => (
              <div key={categorie} style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a1a', marginBottom: '8px' }}>📋 {categorie} ({(form.postes || []).filter((p: string) => postes.includes(p)).length}/{postes.length})</div>
                {postes.map((poste: string) => (
                  <label key={poste} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer', fontSize: '14px' }}>
                    <input type="checkbox" checked={(form.postes || []).includes(poste)} onChange={() => togglePoste(poste)}
                      style={{ accentColor: '#F47C20', width: '16px', height: '16px' }} />
                    {poste}
                  </label>
                ))}
              </div>
            ))}
          </div>
          <p style={{ fontSize: '13px', color: '#F47C20', marginTop: '8px' }}>{(form.postes || []).length} postes sélectionnés</p>
        </div>

        {/* STATUT PRO */}
        <div style={cardStyle}>
          <h2 style={sectionTitle}>💼 Statut professionnel</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Statut actuel *</label>
              <input style={{ ...inputStyle, background: '#f5f5f5', color: '#888' }} value="Extra - Auto-entrepreneur" disabled />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Numéro de patente / Numéro social</label>
              <input style={inputStyle} value={form.numero_patente} placeholder="Ex: 12345678" onChange={(e) => setForm({ ...form, numero_patente: e.target.value })} />
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input type="checkbox" checked={form.disponible} onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
                style={{ accentColor: '#F47C20', width: '16px', height: '16px' }} />
              Disponible immédiatement
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input type="checkbox" checked={form.accepte_alcool} onChange={(e) => setForm({ ...form, accepte_alcool: e.target.checked })}
                style={{ accentColor: '#F47C20', width: '16px', height: '16px' }} />
              Accepte les établissements servant de l'alcool
            </label>
          </div>
        </div>

        {/* MOBILITE */}
        <div style={cardStyle}>
          <h2 style={sectionTitle}>📍 Mobilité</h2>
          <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Rayon de mobilité (km) *</label>
          <input type="number" style={{ ...inputStyle, width: '200px' }} value={form.rayon_mobilite} onChange={(e) => setForm({ ...form, rayon_mobilite: parseInt(e.target.value) })} />
        </div>

        {/* COMPETENCES */}
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Compétences</h2>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>Ajoutez vos compétences professionnelles</p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <select style={{ ...inputStyle, flex: 1 }} value={newComp} onChange={(e) => setNewComp(e.target.value)}>
              <option value="">Sélectionnez une compétence</option>
              {competencesList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={addComp} style={{ background: '#F47C20', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>+ Ajouter</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(form.competences || []).map((c: string) => (
              <span key={c} style={{ background: '#FDF0E8', color: '#F47C20', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                {c}
                <button onClick={() => setForm({ ...form, competences: form.competences.filter((x: string) => x !== c) })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F47C20', fontWeight: 700 }}>×</button>
              </span>
            ))}
          </div>
        </div>

        {/* LANGUES */}
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Langues</h2>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>Indiquez les langues que vous parlez</p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <select style={{ ...inputStyle, flex: 1 }} value={newLangue.langue} onChange={(e) => setNewLangue({ ...newLangue, langue: e.target.value })}>
              <option value="">Langue</option>
              {languesList.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select style={{ ...inputStyle, flex: 2 }} value={newLangue.niveau} onChange={(e) => setNewLangue({ ...newLangue, niveau: e.target.value })}>
              {niveauxLangue.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <button onClick={addLangue} style={{ background: '#F47C20', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>+ Ajouter</button>
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
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>Ajoutez vos expériences passées (obligatoire)</p>
          
          {(form.experiences || []).map((exp: any, i: number) => (
            <div key={i} style={{ background: '#f9f9f9', borderRadius: '12px', padding: '16px', marginBottom: '12px', position: 'relative' }}>
              <button onClick={() => setForm({ ...form, experiences: form.experiences.filter((_: any, j: number) => j !== i) })}
                style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#999' }}>×</button>
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
            <textarea style={{ ...inputStyle, height: '80px', marginBottom: '12px' }} placeholder="Description des missions" value={newExp.description} onChange={(e) => setNewExp({ ...newExp, description: e.target.value })} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <input style={inputStyle} placeholder="Nom du référent" value={newExp.referent_nom} onChange={(e) => setNewExp({ ...newExp, referent_nom: e.target.value })} />
              <input style={inputStyle} placeholder="Numéro du référent" value={newExp.referent_tel} onChange={(e) => setNewExp({ ...newExp, referent_tel: e.target.value })} />
            </div>
            <button onClick={addExperience} style={{ width: '100%', background: '#F47C20', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
              + Ajouter l'expérience
            </button>
          </div>

          {(form.experiences || []).length === 0 && (
            <div style={{ background: '#FDF0E8', border: '1px solid #F47C20', borderRadius: '8px', padding: '12px', marginTop: '12px', fontSize: '13px', color: '#F47C20' }}>
              ⚠️ Au moins une expérience professionnelle est requise pour compléter votre profil
            </div>
          )}
        </div>

        {/* DOCUMENTS */}
        <div style={cardStyle}>
          <h2 style={sectionTitle}>📄 Documents requis</h2>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
            Ces documents sont nécessaires pour valider votre profil. Formats acceptés : JPG, PNG, PDF. Max 2 Mo.
          </p>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: extra?.[`${doc.key}_statut`] === 'validé' ? '#dcfce7' : '#FDF0E8',
                      color: extra?.[`${doc.key}_statut`] === 'validé' ? '#22c55e' : '#F47C20',
                      padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600
                    }}>
                      {extra?.[`${doc.key}_statut`] || 'en_attente'}
                    </span>
                    <label style={{ color: '#F47C20', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
                      Remplacer
                      <input type="file" accept=".jpg,.jpeg,.png,.pdf" style={{ display: 'none' }}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDocument(f, doc.key); }} />
                    </label>
                  </div>
                ) : (
                  <label style={{ background: '#F47C20', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'inline-block' }}>
                    📤 Uploader
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" style={{ display: 'none' }}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDocument(f, doc.key); }} />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* BOUTONS */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
          <button onClick={() => window.location.href = '/'} style={{ flex: 1, background: 'white', color: '#F47C20', border: '2px solid #F47C20', padding: '16px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
            Annuler
          </button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 2, background: '#F47C20', color: 'white', padding: '16px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
            {saving ? 'Sauvegarde...' : '💾 Enregistrer'}
          </button>
        </div>

      </div>
    </main>
  );
}