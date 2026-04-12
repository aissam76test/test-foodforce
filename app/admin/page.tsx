'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [extras, setExtras] = useState<any[]>([]);
  const [etablissements, setEtablissements] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);
  const [onglet, setOnglet] = useState('extras');
  const [selected, setSelected] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/extras').then(r => r.json()).then(setExtras);
    fetch('/api/admin/etablissements').then(r => r.json()).then(setEtablissements);
    fetch('/api/admin/missions').then(r => r.json()).then(setMissions);
  }, []);

  const validerExtra = async (id: string) => {
    await supabase.from('extras').update({ statut: 'validé' }).eq('id', id);
    setExtras(extras.map(e => e.id === id ? { ...e, statut: 'validé' } : e));
    if (selected?.id === id) setSelected({ ...selected, statut: 'validé' });
  };
  const rejeterExtra = async (id: string) => {
    await supabase.from('extras').update({ statut: 'rejeté' }).eq('id', id);
    setExtras(extras.map(e => e.id === id ? { ...e, statut: 'rejeté' } : e));
    if (selected?.id === id) setSelected({ ...selected, statut: 'rejeté' });
  };
  const validerEtab = async (id: string) => {
    await supabase.from('etablissements').update({ statut: 'validé' }).eq('id', id);
    setEtablissements(etablissements.map(e => e.id === id ? { ...e, statut: 'validé' } : e));
    if (selected?.id === id) setSelected({ ...selected, statut: 'validé' });
  };
  const rejeterEtab = async (id: string) => {
    await supabase.from('etablissements').update({ statut: 'rejeté' }).eq('id', id);
    setEtablissements(etablissements.map(e => e.id === id ? { ...e, statut: 'rejeté' } : e));
    if (selected?.id === id) setSelected({ ...selected, statut: 'rejeté' });
  };

  const updateDocStatutExtra = async (id: string, champ: string, statut: string) => {
    await supabase.from('extras').update({ [champ]: statut }).eq('id', id);
    setExtras(extras.map(e => e.id === id ? { ...e, [champ]: statut } : e));
    if (selected?.id === id) setSelected({ ...selected, [champ]: statut });
  };

  const updateDocStatutEtab = async (id: string, champ: string, statut: string) => {
    await supabase.from('etablissements').update({ [champ]: statut }).eq('id', id);
    setEtablissements(etablissements.map(e => e.id === id ? { ...e, [champ]: statut } : e));
    if (selected?.id === id) setSelected({ ...selected, [champ]: statut });
  };

  const statutBadge = (statut: string) => {
    const colors: any = {
      'validé':     { bg: '#dcfce7', color: '#22c55e' },
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

  const docsBadgeExtra = (extra: any) => {
    const champs = ['cin_recto_statut', 'cin_verso_statut', 'ice_statut', 'rib_statut'];
    const pending = champs.filter(c => !extra[c] || extra[c] === 'en_attente').length;
    return pending === 0 ? statutBadge('validé') : statutBadge('en_attente');
  };

  const docsBadgeEtab = (etab: any) => {
    const champs = ['kbis_statut', 'patente_statut', 'cin_gerant_statut', 'rib_statut'];
    const pending = champs.filter(c => !etab[c] || etab[c] === 'en_attente').length;
    return pending === 0 ? statutBadge('validé') : statutBadge('en_attente');
  };

  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: '#1a1a1a', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ color: '#F47C20', fontWeight: 800, fontSize: '20px' }}>FoodForce</span>
          <span style={{ color: 'white', fontSize: '14px', marginLeft: '12px' }}>Panel Admin</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {[
            { label: 'Extras', count: extras.length, accent: true },
            { label: 'Établissements', count: etablissements.length },
            { label: 'Missions', count: missions.length },
          ].map((b, i) => (
            <div key={i} style={{ background: i === 0 ? '#F47C20' : '#333', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700 }}>
              {b.count} {b.label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>

        {/* SIDEBAR */}
        <div style={{ width: '260px', background: 'white', borderRight: '1px solid #f0f0f0', padding: '20px 0' }}>
          {[
            { id: 'extras', label: '👤 Extras', pending: extras.filter(e => !e.statut || e.statut === 'en_attente').length },
            { id: 'etablissements', label: '🏨 Établissements', pending: etablissements.filter(e => !e.statut || e.statut === 'en_attente').length },
            { id: 'missions', label: '📋 Missions', pending: 0 },
            { id: 'documents', label: '📄 Documents Extras', pending: extras.filter(e =>
              ['cin_recto_statut','cin_verso_statut','ice_statut','rib_statut']
              .some(c => !e[c] || e[c] === 'en_attente')).length },
            { id: 'documents_etab', label: '📄 Documents Étab.', pending: etablissements.filter(e =>
              ['kbis_statut','patente_statut','cin_gerant_statut','rib_statut']
              .some(c => !e[c] || e[c] === 'en_attente')).length },
          ].map(item => (
            <button key={item.id} onClick={() => { setOnglet(item.id); setSelected(null); }}
              style={{ width: '100%', padding: '14px 20px', textAlign: 'left', border: 'none', background: onglet === item.id ? '#FDF0E8' : 'transparent', borderLeft: onglet === item.id ? '3px solid #F47C20' : '3px solid transparent', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 600, color: onglet === item.id ? '#F47C20' : '#1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{item.label}</span>
              {item.pending > 0 && (
                <span style={{ background: '#F47C20', color: 'white', borderRadius: '10px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>{item.pending}</span>
              )}
            </button>
          ))}
        </div>

        {/* CONTENU */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div style={{ width: selected ? '40%' : '100%', overflowY: 'auto', padding: '20px' }}>

            {/* EXTRAS */}
            {onglet === 'extras' && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Gestion des extras</h2>
                {extras.map(extra => (
                  <div key={extra.id} onClick={() => setSelected({ ...extra, type: 'extra' })}
                    style={{ background: 'white', borderRadius: '12px', padding: '16px', marginBottom: '10px', cursor: 'pointer', border: selected?.id === extra.id ? '2px solid #F47C20' : '2px solid transparent', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {extra.photo_url ? (
                        <img src={extra.photo_url} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#F47C20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                          {extra.prenom?.[0]}{extra.nom?.[0]}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{extra.prenom} {extra.nom}</div>
                        <div style={{ color: '#888', fontSize: '12px' }}>{extra.metier} · {extra.telephone}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {docsBadgeExtra(extra)}
                      {statutBadge(extra.statut)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ETABLISSEMENTS */}
            {onglet === 'etablissements' && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Gestion des établissements</h2>
                {etablissements.map(etab => (
                  <div key={etab.id} onClick={() => setSelected({ ...etab, type: 'etablissement' })}
                    style={{ background: 'white', borderRadius: '12px', padding: '16px', marginBottom: '10px', cursor: 'pointer', border: selected?.id === etab.id ? '2px solid #F47C20' : '2px solid transparent', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>{etab.nom}</div>
                      <div style={{ color: '#888', fontSize: '12px' }}>{etab.type} · {etab.ville} · {etab.telephone}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {docsBadgeEtab(etab)}
                      {statutBadge(etab.statut)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* MISSIONS */}
            {onglet === 'missions' && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Toutes les missions</h2>
                {missions.map(m => (
                  <div key={m.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', marginBottom: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ fontWeight: 700 }}>{m.titre}</div>
                    <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>
                      📅 {m.date_mission} · ⏰ {m.heure_debut}-{m.heure_fin} · 💰 {m.taux_horaire} MAD/h · 👥 {m.nombre_extras} extra(s)
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* DOCUMENTS EXTRAS */}
            {onglet === 'documents' && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Documents extras</h2>
                {extras.map(extra => (
                  <div key={extra.id} onClick={() => setSelected({ ...extra, type: 'document_extra' })}
                    style={{ background: 'white', borderRadius: '12px', padding: '16px', marginBottom: '10px', cursor: 'pointer', border: selected?.id === extra.id ? '2px solid #F47C20' : '2px solid transparent', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FDF0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>📄</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{extra.prenom} {extra.nom}</div>
                        <div style={{ color: '#888', fontSize: '12px' }}>{extra.email} · {new Date(extra.created_at).toLocaleDateString('fr-FR')}</div>
                      </div>
                    </div>
                    {docsBadgeExtra(extra)}
                  </div>
                ))}
              </div>
            )}

            {/* DOCUMENTS ETABLISSEMENTS */}
            {onglet === 'documents_etab' && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Documents établissements</h2>
                {etablissements.map(etab => (
                  <div key={etab.id} onClick={() => setSelected({ ...etab, type: 'document_etab' })}
                    style={{ background: 'white', borderRadius: '12px', padding: '16px', marginBottom: '10px', cursor: 'pointer', border: selected?.id === etab.id ? '2px solid #F47C20' : '2px solid transparent', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FDF0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🏨</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{etab.nom}</div>
                        <div style={{ color: '#888', fontSize: '12px' }}>{etab.email} · {new Date(etab.created_at).toLocaleDateString('fr-FR')}</div>
                      </div>
                    </div>
                    {docsBadgeEtab(etab)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FICHE DETAIL */}
          {selected && (
            <div style={{ width: '60%', background: 'white', borderLeft: '1px solid #f0f0f0', overflowY: 'auto', padding: '28px' }}>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', marginBottom: '20px' }}>✕</button>

              {/* EXTRA */}
              {selected.type === 'extra' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    {selected.photo_url ? (
                      <img src={selected.photo_url} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F47C20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: 'white', fontWeight: 800 }}>
                        {selected.prenom?.[0]}{selected.nom?.[0]}
                      </div>
                    )}
                    <div>
                      <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>{selected.prenom} {selected.nom}</h2>
                      <p style={{ color: '#F47C20', margin: '4px 0', fontWeight: 600 }}>{selected.metier}</p>
                      {statutBadge(selected.statut)}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                    {[
                      { label: 'Email', value: selected.email },
                      { label: 'Téléphone', value: selected.telephone },
                      { label: 'Secteur', value: selected.secteur },
                      { label: 'Expérience', value: selected.experience },
                      { label: 'Ville', value: selected.ville },
                      { label: 'Disponible', value: selected.disponible ? '✅ Oui' : '❌ Non' },
                    ].map(item => (
                      <div key={item.label} style={{ background: '#f9f9f9', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{item.label}</div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.value || '—'}</div>
                      </div>
                    ))}
                  </div>
                  {selected.bio && (
                    <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Bio</div>
                      <div style={{ fontSize: '14px' }}>{selected.bio}</div>
                    </div>
                  )}
                  <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px' }}>📄 Documents</div>
                    {[
                      { label: 'CIN Recto', statutKey: 'cin_recto_statut' },
                      { label: 'CIN Verso', statutKey: 'cin_verso_statut' },
                      { label: 'ICE', statutKey: 'ice_statut' },
                      { label: 'RIB', statutKey: 'rib_statut' },
                    ].map(({ label, statutKey }) => (
                      <div key={statutKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#555' }}>{label}</span>
                        {statutBadge(selected[statutKey] || 'en_attente')}
                      </div>
                    ))}
                  </div>
                  {selected.statut !== 'validé' && selected.statut !== 'rejeté' && (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                      <button onClick={() => validerExtra(selected.id)} style={{ flex: 1, background: '#22c55e', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>✅ Valider le profil</button>
                      <button onClick={() => rejeterExtra(selected.id)} style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>❌ Rejeter</button>
                    </div>
                  )}
                </div>
              )}

              {/* ÉTABLISSEMENT */}
              {selected.type === 'etablissement' && (
                <div>
                  <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 800 }}>{selected.nom}</h2>
                    <p style={{ color: '#888', margin: '0 0 8px', fontSize: '14px' }}>{selected.type} · {selected.ville}</p>
                    {statutBadge(selected.statut)}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                    {[
                      { label: 'Email', value: selected.email },
                      { label: 'Téléphone', value: selected.telephone },
                      { label: 'Type', value: selected.type },
                      { label: 'Ville', value: selected.ville },
                      { label: 'Adresse', value: selected.adresse },
                    ].map(item => (
                      <div key={item.label} style={{ background: '#f9f9f9', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{item.label}</div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.value || '—'}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px' }}>📄 Documents</div>
                    {[
                      { label: 'KBIS', statutKey: 'kbis_statut' },
                      { label: 'Patente', statutKey: 'patente_statut' },
                      { label: 'CIN Gérant', statutKey: 'cin_gerant_statut' },
                      { label: 'RIB', statutKey: 'rib_statut' },
                    ].map(({ label, statutKey }) => (
                      <div key={statutKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#555' }}>{label}</span>
                        {statutBadge(selected[statutKey] || 'en_attente')}
                      </div>
                    ))}
                  </div>
                  {selected.statut !== 'validé' && selected.statut !== 'rejeté' && (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                      <button onClick={() => validerEtab(selected.id)} style={{ flex: 1, background: '#22c55e', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>✅ Valider l'établissement</button>
                      <button onClick={() => rejeterEtab(selected.id)} style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>❌ Rejeter</button>
                    </div>
                  )}
                </div>
              )}

              {/* DOCUMENTS EXTRA */}
              {selected.type === 'document_extra' && (
                <div>
                  <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 800 }}>{selected.prenom} {selected.nom}</h2>
                    <p style={{ color: '#888', margin: '0 0 8px', fontSize: '14px' }}>{selected.email} · {selected.telephone}</p>
                  </div>
                  {[
                    { label: 'CIN Recto', urlKey: 'cin_recto_url', statutKey: 'cin_recto_statut' },
                    { label: 'CIN Verso', urlKey: 'cin_verso_url', statutKey: 'cin_verso_statut' },
                    { label: 'ICE', urlKey: 'ice_url', statutKey: 'ice_statut' },
                    { label: 'RIB', urlKey: 'rib_url', statutKey: 'rib_statut' },
                  ].map(({ label, urlKey, statutKey }) => {
                    const url = selected[urlKey];
                    const statut = selected[statutKey] || 'en_attente';
                    return (
                      <div key={urlKey} style={{ background: '#f9f9f9', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <div style={{ fontWeight: 700, fontSize: '14px' }}>{label}</div>
                          {statutBadge(statut)}
                        </div>
                        {url ? (
                          <div>
                            {isImage(url) ? (
                              <img src={url} alt={label} onClick={() => setPreview(url)}
                                style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '8px', cursor: 'zoom-in', marginBottom: '8px' }} />
                            ) : (
                              <div style={{ background: '#e8e8e8', borderRadius: '8px', padding: '20px', textAlign: 'center', fontSize: '13px', color: '#555', marginBottom: '8px' }}>📎 Fichier PDF</div>
                            )}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                              <a href={url} target="_blank" rel="noreferrer"
                                style={{ flex: 1, background: '#1a1a1a', color: 'white', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                                ⬇️ Télécharger
                              </a>
                              {isImage(url) && (
                                <button onClick={() => setPreview(url)}
                                  style={{ flex: 1, background: '#F47C20', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                                  🔍 Prévisualiser
                                </button>
                              )}
                            </div>
                            {statut !== 'validé' && statut !== 'rejeté' && (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => updateDocStatutExtra(selected.id, statutKey, 'validé')}
                                  style={{ flex: 1, background: '#22c55e', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>✅ Valider</button>
                                <button onClick={() => updateDocStatutExtra(selected.id, statutKey, 'rejeté')}
                                  style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>❌ Rejeter</button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ color: '#bbb', fontSize: '13px' }}>Aucun fichier soumis</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* DOCUMENTS ETABLISSEMENT */}
              {selected.type === 'document_etab' && (
                <div>
                  <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 800 }}>{selected.nom}</h2>
                    <p style={{ color: '#888', margin: '0 0 8px', fontSize: '14px' }}>{selected.email} · {selected.telephone}</p>
                  </div>
                  {[
                    { label: 'KBIS', urlKey: 'kbis_url', statutKey: 'kbis_statut' },
                    { label: 'Patente', urlKey: 'patente_url', statutKey: 'patente_statut' },
                    { label: 'CIN Gérant', urlKey: 'cin_gerant_url', statutKey: 'cin_gerant_statut' },
                    { label: 'RIB professionnel', urlKey: 'rib_url', statutKey: 'rib_statut' },
                  ].map(({ label, urlKey, statutKey }) => {
                    const url = selected[urlKey];
                    const statut = selected[statutKey] || 'en_attente';
                    return (
                      <div key={urlKey} style={{ background: '#f9f9f9', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <div style={{ fontWeight: 700, fontSize: '14px' }}>{label}</div>
                          {statutBadge(statut)}
                        </div>
                        {url ? (
                          <div>
                            {isImage(url) ? (
                              <img src={url} alt={label} onClick={() => setPreview(url)}
                                style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '8px', cursor: 'zoom-in', marginBottom: '8px' }} />
                            ) : (
                              <div style={{ background: '#e8e8e8', borderRadius: '8px', padding: '20px', textAlign: 'center', fontSize: '13px', color: '#555', marginBottom: '8px' }}>📎 Fichier PDF</div>
                            )}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                              <a href={url} target="_blank" rel="noreferrer"
                                style={{ flex: 1, background: '#1a1a1a', color: 'white', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                                ⬇️ Télécharger
                              </a>
                              {isImage(url) && (
                                <button onClick={() => setPreview(url)}
                                  style={{ flex: 1, background: '#F47C20', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                                  🔍 Prévisualiser
                                </button>
                              )}
                            </div>
                            {statut !== 'validé' && statut !== 'rejeté' && (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => updateDocStatutEtab(selected.id, statutKey, 'validé')}
                                  style={{ flex: 1, background: '#22c55e', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>✅ Valider</button>
                                <button onClick={() => updateDocStatutEtab(selected.id, statutKey, 'rejeté')}
                                  style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>❌ Rejeter</button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ color: '#bbb', fontSize: '13px' }}>Aucun fichier soumis</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL PRÉVISUALISATION */}
      {preview && (
        <div onClick={() => setPreview(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, cursor: 'zoom-out' }}>
          <img src={preview} style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '12px' }} />
        </div>
      )}
    </main>
  );
}