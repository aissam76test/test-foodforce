'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Missions() {
  const [extra, setExtra] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [candidatures, setCandidatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [onglet, setOnglet] = useState('disponibles');
  const [postulant, setPostulant] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }

      const { data: extraData } = await supabase
        .from('extras').select('*').eq('email', user.email).single();
      setExtra(extraData);

      const { data: missionsData } = await supabase
        .from('missions')
        .select('*, etablissements(type, ville, adresse)')
        .eq('statut', 'ouverte')
        .order('created_at', { ascending: false });
      setMissions(missionsData || []);

      const { data: candData } = await supabase
        .from('candidatures')
        .select('*, missions(titre, date_mission, heure_debut, heure_fin, taux_horaire, etablissements(type, ville))')
        .eq('extra_id', extraData?.id)
        .order('created_at', { ascending: false });
      setCandidatures(candData || []);
      setLoading(false);
    };
    init();
  }, []);

  const postuler = async (missionId: string) => {
    if (!extra) return;
    setPostulant(missionId);
    const dejaPostule = candidatures.find(c => c.mission_id === missionId);
    if (dejaPostule) { setPostulant(null); return; }
    const { error } = await supabase.from('candidatures').insert([{
      mission_id: missionId, extra_id: extra.id, statut: 'en_attente'
    }]);
    if (!error) {
      const { data: candData } = await supabase
        .from('candidatures')
        .select('*, missions(titre, date_mission, heure_debut, heure_fin, taux_horaire, etablissements(type, ville))')
        .eq('extra_id', extra.id)
        .order('created_at', { ascending: false });
      setCandidatures(candData || []);
    }
    setPostulant(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'Poppins, sans-serif' }}>Chargement...</div>;

  const statutBadge = (statut: string) => {
    const colors: any = {
      'accepté':    { bg: '#dcfce7', color: '#22c55e' },
      'rejeté':     { bg: '#fee2e2', color: '#ef4444' },
      'en_attente': { bg: '#FDF0E8', color: '#F47C20' },
    };
    const c = colors[statut] || colors['en_attente'];
    return (
      <span style={{ background: c.bg, color: c.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
        {statut}
      </span>
    );
  };

  const tauxNet = (taux: number) => Math.round(taux * 0.75);

  const getQuartier = (adresse: string) => {
    if (!adresse) return 'Casablanca';
    const parts = adresse.split(',');
    return parts[parts.length > 1 ? 1 : 0]?.trim() || 'Casablanca';
  };

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>

      {/* NAVBAR */}
      <nav style={{ background: 'white', padding: isMobile ? '14px 16px' : '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div>
          <span style={{ fontWeight: 800, fontSize: '18px', color: '#1a1a1a' }}>Food</span>
          <span style={{ fontWeight: 800, fontSize: '18px', color: '#F47C20' }}>Force</span>
          {!isMobile && <span style={{ fontSize: '13px', color: '#888', marginLeft: '12px' }}>Espace Extra</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px' }}>
          <a href="/profil" style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', textDecoration: 'none' }}>
            {isMobile ? '👤' : '👤 Mon profil'}
          </a>
          <button onClick={handleLogout} style={{ background: '#f5f5f5', border: 'none', padding: isMobile ? '8px 12px' : '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>
            {isMobile ? '↩️' : 'Se déconnecter'}
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '16px 12px' : '40px 20px' }}>

        {/* ALERTE PROFIL NON VALIDÉ */}
        {extra?.statut !== 'validé' && (
          <div style={{ background: '#FDF0E8', border: '2px solid #F47C20', borderRadius: '16px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>⏳</div>
            <h3 style={{ fontWeight: 700, margin: '0 0 6px', fontSize: '16px' }}>Profil en cours de validation</h3>
            <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>Votre dossier est en cours de vérification. Vous pourrez postuler aux missions une fois validé.</p>
          </div>
        )}

        {/* ONGLETS */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {[
            { id: 'disponibles', label: isMobile ? `📋 Missions (${missions.length})` : `📋 Missions disponibles (${missions.length})` },
            { id: 'candidatures', label: isMobile ? `📨 Mes cand. (${candidatures.length})` : `📨 Mes candidatures (${candidatures.length})` },
          ].map(o => (
            <button key={o.id} onClick={() => setOnglet(o.id)}
              style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: isMobile ? '12px' : '14px', background: onglet === o.id ? '#F47C20' : 'white', color: onglet === o.id ? 'white' : '#1a1a1a', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              {o.label}
            </button>
          ))}
        </div>

        {/* MISSIONS DISPONIBLES */}
        {onglet === 'disponibles' && (
          <div>
            {missions.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '16px', padding: '60px 20px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
                <p style={{ color: '#888' }}>Aucune mission disponible pour le moment</p>
              </div>
            ) : (
              missions.map(m => {
                const dejaPostule = candidatures.find(c => c.mission_id === m.id);
                const etab = m.etablissements;
                return (
                  <div key={m.id} style={{ background: 'white', borderRadius: '16px', padding: isMobile ? '16px' : '24px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ flex: 1, marginRight: '12px' }}>
                        <h3 style={{ margin: '0 0 6px', fontSize: isMobile ? '16px' : '18px', fontWeight: 800 }}>{m.titre}</h3>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ background: '#f0f0f0', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                            {etab?.type || 'Établissement'}
                          </span>
                          <span style={{ background: '#f0f0f0', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                            📍 {getQuartier(etab?.adresse)}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 800, color: '#F47C20' }}>{tauxNet(m.taux_horaire)} MAD/h</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>gain net</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                      {[
                        { icon: '📅', label: 'Date', value: new Date(m.date_mission).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) },
                        { icon: '⏰', label: 'Horaires', value: `${m.heure_debut}-${m.heure_fin}` },
                        { icon: '👥', label: 'Postes', value: `${m.nombre_extras}` },
                      ].map(item => (
                        <div key={item.label} style={{ background: '#f9f9f9', borderRadius: '10px', padding: '10px' }}>
                          <div style={{ fontSize: '10px', color: '#888', marginBottom: '3px' }}>{item.icon} {item.label}</div>
                          <div style={{ fontWeight: 600, fontSize: '12px' }}>{item.value}</div>
                        </div>
                      ))}
                    </div>

                    {m.description && !isMobile && (
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px', lineHeight: '1.6' }}>{m.description}</p>
                    )}

                    {extra?.statut === 'validé' ? (
                      <button onClick={() => !dejaPostule && postuler(m.id)}
                        disabled={!!dejaPostule || postulant === m.id}
                        style={{ width: '100%', background: dejaPostule ? '#f0f0f0' : '#F47C20', color: dejaPostule ? '#888' : 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: dejaPostule ? 'default' : 'pointer', fontWeight: 700, fontSize: '14px', fontFamily: 'Poppins, sans-serif' }}>
                        {postulant === m.id ? 'Envoi...' : dejaPostule ? '✅ Déjà postulé' : '🚀 Postuler'}
                      </button>
                    ) : (
                      <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '12px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
                        Profil non encore validé
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* MES CANDIDATURES */}
        {onglet === 'candidatures' && (
          <div>
            {candidatures.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '16px', padding: '60px 20px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📨</div>
                <p style={{ color: '#888' }}>Vous n'avez pas encore postulé à une mission</p>
              </div>
            ) : (
              candidatures.map(c => {
                const m = c.missions;
                return (
                  <div key={c.id} style={{ background: 'white', borderRadius: '16px', padding: isMobile ? '16px' : '24px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: isMobile ? '14px' : '16px', marginBottom: '6px' }}>{m?.titre}</div>
                        <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>
                          📅 {m?.date_mission} · ⏰ {m?.heure_debut}-{m?.heure_fin}
                        </div>
                        <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>
                          💰 {tauxNet(m?.taux_horaire)} MAD/h · {m?.etablissements?.type}
                        </div>
                        <div style={{ fontSize: '11px', color: '#aaa' }}>
                          Postulé le {new Date(c.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      {statutBadge(c.statut)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </main>
  );
}