'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Missions() {
  const [user, setUser] = useState<any>(null);
  const [etablissement, setEtablissement] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [filteredMissions, setFilteredMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState('toutes');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);

      const { data: etabData } = await supabase.from('etablissements').select('*').eq('email', user.email).single();
      if (etabData) {
        setEtablissement(etabData);
        
        const { data: missionsData } = await supabase
          .from('missions')
          .select('*, candidatures(*)')
          .eq('etablissement_id', etabData.id)
          .order('created_at', { ascending: false });

        setMissions(missionsData || []);
        setFilteredMissions(missionsData || []);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (filter === 'toutes') {
      setFilteredMissions(missions);
    } else {
      setFilteredMissions(missions.filter((m: any) => m.statut === filter));
    }
  }, [filter, missions]);

  const deleteMission = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) return;
    
    await supabase.from('missions').delete().eq('id', id);
    setMissions(missions.filter(m => m.id !== id));
    alert('✅ Mission supprimée');
  };

  const changeStatut = async (id: string, newStatut: string) => {
    await supabase.from('missions').update({ statut: newStatut }).eq('id', id);
    setMissions(missions.map(m => m.id === id ? { ...m, statut: newStatut } : m));
    alert('✅ Statut mis à jour');
  };

  const bg = darkMode ? '#0a0a0a' : 'linear-gradient(135deg, #FDF0E8 0%, #fff 100%)';
  const cardBg = darkMode ? 'rgba(255, 255, 255, 0.05)' : '#fff';
  const textPrimary = darkMode ? '#fff' : '#1a1a1a';
  const textSecondary = darkMode ? '#999' : '#666';
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.05)';

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
          <a href="/dashboard-etablissement" style={{ textDecoration: 'none', color: textSecondary, fontWeight: 600, fontSize: '14px', padding: '10px 16px', borderRadius: '10px' }}>
            ← Retour
          </a>
          <button onClick={() => setDarkMode(!darkMode)} style={{ background: darkMode ? 'rgba(255,255,255,0.1)' : '#f5f5f5', border: 'none', width: '40px', height: '40px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        {/* HEADER */}
        <div style={{ marginBottom: '32px', animation: 'slideIn 0.6s ease' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px 0', color: textPrimary }}>Mes missions</h1>
          <p style={{ color: textSecondary, fontSize: '15px', margin: 0 }}>Gérez toutes vos missions de recrutement</p>
        </div>

        {/* FILTERS & CREATE BUTTON */}
        <div style={{ 
          background: cardBg,
          backdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '20px', 
          padding: '24px', 
          boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
          border: `1px solid ${borderColor}`,
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          animation: 'slideIn 0.7s ease'
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { value: 'toutes', label: 'Toutes' },
              { value: 'ouverte', label: 'Ouvertes' },
              { value: 'en_cours', label: 'En cours' },
              { value: 'complétée', label: 'Complétées' }
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                style={{
                  background: filter === f.value ? 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)' : darkMode ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
                  color: filter === f.value ? '#fff' : textPrimary,
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <a href="/creer-mission" style={{
            background: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(244, 124, 32, 0.3)'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Nouvelle mission
          </a>
        </div>

        {/* MISSIONS LIST */}
        {filteredMissions.length === 0 ? (
          <div style={{ 
            background: cardBg,
            backdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '24px', 
            padding: '80px 40px',
            boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
            border: `1px solid ${borderColor}`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📭</div>
            <p style={{ color: textSecondary, fontSize: '16px', margin: 0 }}>Aucune mission trouvée</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
            {filteredMissions.map((mission: any, idx: number) => {
              const statutStyles: any = {
                'ouverte': { bg: darkMode ? 'rgba(244, 124, 32, 0.2)' : 'rgba(244, 124, 32, 0.1)', color: '#F47C20', border: '#F47C20' },
                'en_cours': { bg: darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '#3b82f6' },
                'complétée': { bg: darkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '#22c55e' }
              };
              const style = statutStyles[mission.statut] || statutStyles['ouverte'];

              return (
                <div key={mission.id} style={{ 
                  background: cardBg,
                  backdropFilter: 'blur(20px) saturate(180%)',
                  borderRadius: '20px', 
                  padding: '24px',
                  boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
                  border: `1px solid ${borderColor}`,
                  transition: 'all 0.3s ease',
                  animation: `slideIn ${0.5 + idx * 0.1}s ease`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: textPrimary, margin: '0 0 8px 0' }}>{mission.titre}</h3>
                      <div style={{ fontSize: '14px', color: textSecondary, display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={textSecondary} strokeWidth="2"/>
                            <path d="M16 2v4M8 2v4M3 10h18" stroke={textSecondary} strokeWidth="2"/>
                          </svg>
                          {new Date(mission.date_mission).toLocaleDateString('fr-FR')}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke={textSecondary} strokeWidth="2"/>
                            <path d="M12 6v6l4 2" stroke={textSecondary} strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          {mission.heure_debut} - {mission.heure_fin}
                        </span>
                      </div>
                    </div>
                    <span style={{ 
                      background: style.bg, 
                      color: style.color, 
                      padding: '6px 14px', 
                      borderRadius: '20px', 
                      fontSize: '11px', 
                      fontWeight: 700,
                      border: `1px solid ${style.border}`,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {mission.statut}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', padding: '16px', background: darkMode ? 'rgba(255,255,255,0.03)' : '#fafafa', borderRadius: '12px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: textSecondary, marginBottom: '4px' }}>Candidatures</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#3b82f6' }}>{mission.candidatures?.length || 0}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: textSecondary, marginBottom: '4px' }}>Taux horaire</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e' }}>{mission.taux_horaire} MAD</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      value={mission.statut}
                      onChange={(e) => changeStatut(mission.id, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '10px',
                        border: `2px solid ${borderColor}`,
                        background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                        color: textPrimary,
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <option value="ouverte">Ouverte</option>
                      <option value="en_cours">En cours</option>
                      <option value="complétée">Complétée</option>
                    </select>
                    <button
                      onClick={() => deleteMission(mission.id)}
                      style={{
                        background: darkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid #ef4444',
                        color: '#ef4444',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}