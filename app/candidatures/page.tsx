'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Candidatures() {
  const [user, setUser] = useState<any>(null);
  const [etablissement, setEtablissement] = useState<any>(null);
  const [candidatures, setCandidatures] = useState<any[]>([]);
  const [filteredCandidatures, setFilteredCandidatures] = useState<any[]>([]);
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
        
        const { data: candsData } = await supabase
          .from('candidatures')
          .select('*, missions!inner(*), extras(*)')
          .eq('missions.etablissement_id', etabData.id)
          .order('created_at', { ascending: false });

        setCandidatures(candsData || []);
        setFilteredCandidatures(candsData || []);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (filter === 'toutes') {
      setFilteredCandidatures(candidatures);
    } else {
      setFilteredCandidatures(candidatures.filter((c: any) => c.statut === filter));
    }
  }, [filter, candidatures]);

  const handleCandidature = async (id: string, newStatut: string) => {
    await supabase.from('candidatures').update({ statut: newStatut }).eq('id', id);
    setCandidatures(candidatures.map(c => c.id === id ? { ...c, statut: newStatut } : c));
    alert(`✅ Candidature ${newStatut === 'accepté' ? 'acceptée' : 'refusée'}`);
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
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px 0', color: textPrimary }}>Candidatures</h1>
          <p style={{ color: textSecondary, fontSize: '15px', margin: 0 }}>Gérez les candidatures reçues pour vos missions</p>
        </div>

        {/* FILTERS */}
        <div style={{ 
          background: cardBg,
          backdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '20px', 
          padding: '24px', 
          boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
          border: `1px solid ${borderColor}`,
          marginBottom: '32px',
          animation: 'slideIn 0.7s ease'
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { value: 'toutes', label: 'Toutes' },
              { value: 'en_attente', label: 'En attente' },
              { value: 'accepté', label: 'Acceptées' },
              { value: 'refusé', label: 'Refusées' }
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
        </div>

        {/* CANDIDATURES LIST */}
        {filteredCandidatures.length === 0 ? (
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
            <p style={{ color: textSecondary, fontSize: '16px', margin: 0 }}>Aucune candidature trouvée</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {filteredCandidatures.map((cand: any, idx: number) => {
              const statutStyles: any = {
                'en_attente': { bg: darkMode ? 'rgba(249, 115, 22, 0.2)' : 'rgba(249, 115, 22, 0.1)', color: '#f97316', border: '#f97316', label: 'En attente' },
                'accepté': { bg: darkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '#22c55e', label: 'Acceptée' },
                'refusé': { bg: darkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '#ef4444', label: 'Refusée' }
              };
              const style = statutStyles[cand.statut] || statutStyles['en_attente'];

              return (
                <div key={cand.id} style={{ 
                  background: cardBg,
                  backdropFilter: 'blur(20px) saturate(180%)',
                  borderRadius: '20px', 
                  padding: '28px',
                  boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
                  border: `1px solid ${borderColor}`,
                  transition: 'all 0.3s ease',
                  animation: `slideIn ${0.5 + idx * 0.1}s ease`
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '24px', alignItems: 'start' }}>
                    {/* PHOTO */}
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '28px',
                      flexShrink: 0
                    }}>
                      {cand.extras?.prenom?.[0]}{cand.extras?.nom?.[0]}
                    </div>

                    {/* INFO */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: textPrimary, margin: 0 }}>
                          {cand.extras?.prenom} {cand.extras?.nom}
                        </h3>
                        <span style={{ 
                          background: style.bg, 
                          color: style.color, 
                          padding: '4px 12px', 
                          borderRadius: '20px', 
                          fontSize: '11px', 
                          fontWeight: 700,
                          border: `1px solid ${style.border}`,
                          textTransform: 'uppercase'
                        }}>
                          {style.label}
                        </span>
                      </div>

                      <div style={{ fontSize: '15px', color: textSecondary, marginBottom: '16px' }}>
                        Pour la mission : <strong style={{ color: textPrimary }}>{cand.missions?.titre}</strong>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: textSecondary }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={textSecondary} strokeWidth="2"/>
                            <path d="M22 6l-10 7L2 6" stroke={textSecondary} strokeWidth="2"/>
                          </svg>
                          {cand.extras?.email}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: textSecondary }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke={textSecondary} strokeWidth="2"/>
                          </svg>
                          {cand.extras?.telephone}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: textSecondary }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke={textSecondary} strokeWidth="2"/>
                            <circle cx="12" cy="10" r="3" stroke={textSecondary} strokeWidth="2"/>
                          </svg>
                          {cand.extras?.ville}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: textSecondary }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={textSecondary} strokeWidth="2"/>
                            <circle cx="12" cy="7" r="4" stroke={textSecondary} strokeWidth="2"/>
                          </svg>
                          {cand.extras?.experience}
                        </div>
                      </div>

                      {cand.extras?.competences && cand.extras.competences.length > 0 && (
                        <div>
                          <div style={{ fontSize: '13px', color: textSecondary, marginBottom: '8px', fontWeight: 600 }}>Compétences :</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {cand.extras.competences.map((comp: string, i: number) => (
                              <span key={i} style={{
                                background: darkMode ? 'rgba(244, 124, 32, 0.2)' : 'rgba(244, 124, 32, 0.1)',
                                color: '#F47C20',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 600,
                                border: '1px solid rgba(244, 124, 32, 0.3)'
                              }}>
                                {comp}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ACTIONS */}
                    {cand.statut === 'en_attente' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px' }}>
                        <button
                          onClick={() => handleCandidature(cand.id, 'accepté')}
                          style={{
                            background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
                            color: '#fff',
                            border: 'none',
                            padding: '12px 20px',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M22 4L12 14.01l-3-3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Accepter
                        </button>
                        <button
                          onClick={() => handleCandidature(cand.id, 'refusé')}
                          style={{
                            background: darkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            border: '1px solid #ef4444',
                            padding: '12px 20px',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Refuser
                        </button>
                      </div>
                    )}
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