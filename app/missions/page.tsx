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

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }

      const { data: extraData } = await supabase
        .from('extras')
        .select('*')
        .eq('email', user.email)
        .single();

      setExtra(extraData);

      // Missions ouvertes
      const { data: missionsData } = await supabase
        .from('missions')
        .select('*, etablissements(type, ville, adresse)')
        .eq('statut', 'ouverte')
        .order('created_at', { ascending: false });

      setMissions(missionsData || []);

      // Candidatures de cet extra
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

    // Vérifier si déjà postulé
    const dejaPostule = candidatures.find(c => c.mission_id === missionId);
    if (dejaPostule) { setPostulant(null); return; }

    const { error } = await supabase.from('candidatures').insert([{
      mission_id: missionId,
      extra_id: extra.id,
      statut: 'en_attente'
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
      <span style={{ background: c.bg, color: c.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
        {statut}
      </span>
    );
  };

  // Taux sans commission (on enlève 25%)
  const tauxNet = (taux: number) => Math.round(taux * 0.75);

  // Extraire le quartier depuis l'adresse
  const getQuartier = (adresse: string) => {
    if (!adresse) return 'Casablanca';
    const parts = adresse.split(',');
    return parts[parts.length > 1 ? 1 : 0]?.trim() || 'Casablanca';
  };

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>

      {/* NAVBAR */}
      <nav style={{ background: 'white', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#1a1a1a' }}>Food</span>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#F47C20' }}>Force</span>
          <span style={{ fontSize: '13px', color: '#888', marginLeft: '12px' }}>Espace Extra</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/profil" style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a', textDecoration: 'none' }}>👤 Mon profil</a>
          <button onClick={handleLogout} style={{ background: '#f5f5f5', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
            Se déconnecter
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>

        {/* ALERTE PROFIL NON VALIDÉ */}
        {extra?.statut !== 'validé' && (
          <div style={{ background: '#FDF0E8', border: '2px solid #F47C20', borderRadius: '16px', padding: '24px', marginBottom: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
            <h3 style={{ fontWeight: 700, margin: '0 0 8px' }}>Profil en cours de validation</h3>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Votre dossier est en cours de vérification. Vous pourrez postuler aux missions une fois validé.</p>
          </div>
        )}

        {/* ONGLETS */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[
            { id: 'disponibles', label: `📋 Missions disponibles (${missions.length})` },
            { id: 'candidatures', label: `📨 Mes candidatures (${candidatures.length})` },
          ].map(o => (
            <button key={o.id} onClick={() => setOnglet(o.id)}
              style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', background: onglet === o.id ? '#F47C20' : 'white', color: onglet === o.id ? 'white' : '#1a1a1a', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              {o.label}
            </button>
          ))}
        </div>

        {/* MISSIONS DISPONIBLES */}
        {onglet === 'disponibles' && (
          <div>
            {missions.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '16px', padding: '60px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
                <p style={{ color: '#888' }}>Aucune mission disponible pour le moment</p>
              </div>
            ) : (
              missions.map(m => {
                const dejaPostule = candidatures.find(c => c.mission_id === m.id);
                const etab = m.etablissements;
                return (
                  <div key={m.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 800 }}>{m.titre}</h3>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ background: '#f0f0f0', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                            {etab?.type || 'Établissement'}
                          </span>
                          <span style={{ background: '#f0f0f0', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                            📍 {getQuartier(etab?.adresse)} — {etab?.ville || 'Casablanca'}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: '#F47C20' }}>{tauxNet(m.taux_horaire)} MAD/h</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>Votre gain net</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                      {[
                        { icon: '📅', label: 'Date', value: new Date(m.date_mission).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) },
                        { icon: '⏰', label: 'Horaires', value: `${m.heure_debut} - ${m.heure_fin}` },
                        { icon: '👥', label: 'Extras', value: `${m.nombre_extras} poste(s)` },
                      ].map(item => (
                        <div key={item.label} style={{ background: '#f9f9f9', borderRadius: '10px', padding: '12px' }}>
                          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{item.icon} {item.label}</div>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{item.value}</div>
                        </div>
                      ))}
                    </div>

                    {m.description && (
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px', lineHeight: '1.6' }}>{m.description}</p>
                    )}

                    {extra?.statut === 'validé' ? (
                      <button
                        onClick={() => !dejaPostule && postuler(m.id)}
                        disabled={!!dejaPostule || postulant === m.id}
                        style={{ width: '100%', background: dejaPostule ? '#f0f0f0' : '#F47C20', color: dejaPostule ? '#888' : 'white', border: 'none', padding: '14px', borderRadius: '10px', cursor: dejaPostule ? 'default' : 'pointer', fontWeight: 700, fontSize: '15px' }}>
                        {postulant === m.id ? 'Envoi...' : dejaPostule ? '✅ Déjà postulé' : '🚀 Postuler'}
                      </button>
                    ) : (
                      <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '14px', textAlign: 'center', color: '#888', fontSize: '14px' }}>
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
              <div style={{ background: 'white', borderRadius: '16px', padding: '60px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📨</div>
                <p style={{ color: '#888' }}>Vous n'avez pas encore postulé à une mission</p>
              </div>
            ) : (
              candidatures.map(c => {
                const m = c.missions;
                return (
                  <div key={c.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>{m?.titre}</div>
                      <div style={{ color: '#888', fontSize: '13px' }}>
                        📅 {m?.date_mission} · ⏰ {m?.heure_debut} - {m?.heure_fin} · 💰 {tauxNet(m?.taux_horaire)} MAD/h
                      </div>
                      <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>
                        {m?.etablissements?.type} — {m?.etablissements?.ville}
                      </div>
                      <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                        Postulé le {new Date(c.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    {statutBadge(c.statut)}
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