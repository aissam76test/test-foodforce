'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function DashboardExtra() {
  const [user, setUser] = useState<any>(null);
  const [extra, setExtra] = useState<any>(null);
  const [stats, setStats] = useState({ missions_disponibles: 0, candidatures_envoyees: 0, missions_acceptees: 0, gains_total: 0 });
  const [missionsDisponibles, setMissionsDisponibles] = useState<any[]>([]);
  const [mesCandidatures, setMesCandidatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);

      const { data: extraData } = await supabase.from('extras').select('*').eq('email', user.email).single();
      if (extraData) {
        setExtra(extraData);

        const { data: missions } = await supabase
          .from('missions')
          .select('*, etablissements(*)')
          .eq('statut', 'ouverte')
          .order('date_mission', { ascending: true })
          .limit(6);

        setMissionsDisponibles(missions || []);

        const { data: candidatures } = await supabase
          .from('candidatures')
          .select('*, missions(*, etablissements(*))')
          .eq('extra_id', extraData.id)
          .order('created_at', { ascending: false });

        setMesCandidatures(candidatures || []);

        const total = missions?.length || 0;
        const envoyees = candidatures?.length || 0;
        const acceptees = candidatures?.filter((c: any) => c.statut === 'accepté').length || 0;
        const gains = acceptees * 800; // Estimation

        setStats({ missions_disponibles: total, candidatures_envoyees: envoyees, missions_acceptees: acceptees, gains_total: gains });
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const postuler = async (missionId: string) => {
    const { error } = await supabase.from('candidatures').insert([{
      mission_id: missionId,
      extra_id: extra.id,
      statut: 'en_attente'
    }]);

    if (error) {
      alert('❌ Erreur lors de la candidature');
    } else {
      alert('✅ Candidature envoyée !');
      window.location.reload();
    }
  };

  const bg = darkMode ? '#0a0a0a' : 'linear-gradient(135deg, #FDF0E8 0%, #fff 100%)';
  const cardBg = darkMode ? 'rgba(255, 255, 255, 0.05)' : '#fff';
  const textPrimary = darkMode ? '#fff' : '#1a1a1a';
  const textSecondary = darkMode ? '#999' : '#666';
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.05)';

  if (loading) return (
    <div style={{ fontFamily: 'Poppins, sans-serif', background: bg, minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ background: cardBg, borderRadius: '20px', padding: '20px', marginBottom: '40px', border: `1px solid ${borderColor}` }}>
          <div style={{ height: '32px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '8px', width: '200px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ background: cardBg, borderRadius: '20px', padding: '28px', border: `1px solid ${borderColor}` }}>
              <div style={{ height: '60px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '12px' }} />
            </div>
          ))}
        </div>
        <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
      </div>
    </div>
  );

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: bg, minHeight: '100vh', transition: 'background 0.3s ease' }}>
      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes wave { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(20deg); } }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ 
        background: darkMode ? 'rgba(10, 10, 10, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        padding: '16px 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        boxShadow: darkMode ? '0 4px 30px rgba(0,0,0,0.3)' : '0 4px 30px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: `1px solid ${borderColor}`,
        transition: 'all 0.3s ease'
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
              <span style={{ fontWeight: 800, fontSize: '24px', color: textPrimary, letterSpacing: '-0.5px' }}>Food</span>
              <span style={{ fontWeight: 800, fontSize: '24px', background: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>Force</span>
            </div>
          </div>
          <div style={{ height: '24px', width: '1px', background: borderColor }} />
          <span style={{ fontSize: '13px', color: textSecondary, fontWeight: 500 }}>Espace Extra</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="/mon-etablissement" style={{ 
            textDecoration: 'none', 
            color: textSecondary, 
            fontWeight: 600, 
            fontSize: '14px',
            padding: '10px 16px',
            borderRadius: '10px',
            transition: 'all 0.2s ease'
          }}>Mon profil</a>
          <button onClick={() => setDarkMode(!darkMode)} style={{
            background: darkMode ? 'rgba(255,255,255,0.1)' : '#f5f5f5',
            border: 'none',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            transition: 'all 0.2s ease'
          }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={handleLogout} style={{ 
            background: darkMode ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '10px', 
            cursor: 'pointer', 
            fontWeight: 600, 
            fontSize: '14px',
            color: textPrimary,
            transition: 'all 0.3s ease',
            boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            Déconnexion
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        {/* HEADER */}
        <div style={{ marginBottom: '40px', animation: 'slideDown 0.6s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 800, margin: 0, background: darkMode ? 'linear-gradient(135deg, #fff 0%, #999 100%)' : 'linear-gradient(135deg, #1a1a1a 0%, #F47C20 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px' }}>
              Bonjour {extra?.prenom}
            </h1>
            <span style={{ fontSize: '36px', animation: 'wave 1s ease infinite' }}>👋</span>
          </div>
          <p style={{ color: textSecondary, fontSize: '16px', margin: 0 }}>Trouvez votre prochaine mission</p>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {[
            { 
              icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="url(#g1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="g1"><stop stopColor="#F47C20"/><stop offset="1" stopColor="#FF9A56"/></linearGradient></defs></svg>,
              label: 'Missions disponibles', 
              value: stats.missions_disponibles, 
              gradient: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)', 
              bg: darkMode ? 'rgba(244, 124, 32, 0.1)' : 'rgba(244, 124, 32, 0.08)',
              change: '+5 nouvelles'
            },
            { 
              icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="url(#g3)" strokeWidth="2"/><path d="M22 6l-10 7L2 6" stroke="url(#g3)" strokeWidth="2"/><defs><linearGradient id="g3"><stop stopColor="#3b82f6"/><stop offset="1" stopColor="#60a5fa"/></linearGradient></defs></svg>,
              label: 'Candidatures envoyées', 
              value: stats.candidatures_envoyees, 
              gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', 
              bg: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.08)',
              change: 'Cette semaine'
            },
            { 
              icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="url(#g2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 4L12 14.01l-3-3" stroke="url(#g2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="g2"><stop stopColor="#22c55e"/><stop offset="1" stopColor="#4ade80"/></linearGradient></defs></svg>,
              label: 'Missions acceptées', 
              value: stats.missions_acceptees, 
              gradient: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)', 
              bg: darkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.08)',
              change: 'Ce mois-ci'
            },
            { 
              icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="url(#g4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="g4"><stop stopColor="#8b5cf6"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs></svg>,
              label: 'Gains estimés', 
              value: `${stats.gains_total} MAD`, 
              gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', 
              bg: darkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)',
              change: 'Total'
            }
          ].map((stat, i) => (
            <div key={i} style={{ 
              background: cardBg, 
              borderRadius: '24px', 
              padding: '32px', 
              boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
              border: `1px solid ${borderColor}`,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              animation: `scaleIn ${0.3 + i * 0.1}s ease backwards`
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = darkMode ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.12)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)';
            }}>
              <div style={{ position: 'absolute', top: -50, right: -50, width: '200px', height: '200px', background: stat.bg, borderRadius: '50%', filter: 'blur(60px)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ marginBottom: '16px' }}>{stat.icon}</div>
                <div style={{ fontSize: '13px', color: textSecondary, marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                <div style={{ fontSize: typeof stat.value === 'string' ? '32px' : '48px', fontWeight: 800, background: stat.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-2px', marginBottom: '8px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '12px', color: textSecondary, fontWeight: 500 }}>{stat.change}</div>
              </div>
            </div>
          ))}
        </div>

        {/* MISSIONS DISPONIBLES */}
        <div style={{ 
          background: cardBg, 
          borderRadius: '24px', 
          padding: '32px', 
          boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
          border: `1px solid ${borderColor}`,
          marginBottom: '32px',
          animation: 'slideUp 0.6s ease'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: textPrimary, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke={darkMode ? '#fff' : '#1a1a1a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke={darkMode ? '#fff' : '#1a1a1a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Missions disponibles
          </h2>
          {missionsDisponibles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: textSecondary }}>
              <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>🔍</div>
              <p style={{ margin: 0, fontSize: '15px' }}>Aucune mission disponible pour le moment</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {missionsDisponibles.map((m: any, idx: number) => (
                <div key={m.id} style={{ 
                  background: darkMode ? 'rgba(255, 255, 255, 0.03)' : '#fafafa',
                  border: `1px solid ${borderColor}`, 
                  borderRadius: '20px', 
                  padding: '24px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  animation: `slideUp ${0.4 + idx * 0.1}s ease backwards`
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = darkMode ? '0 12px 32px rgba(0,0,0,0.5)' : '0 12px 32px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#F47C20';
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = borderColor;
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '18px', color: textPrimary, marginBottom: '4px' }}>{m.titre}</div>
                      <div style={{ fontSize: '14px', color: textSecondary }}>{m.etablissements?.nom_etablissement}</div>
                    </div>
                    <div style={{ 
                      background: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)',
                      color: '#fff',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 700
                    }}>
                      {m.taux_horaire} MAD/h
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: textSecondary, marginBottom: '16px', lineHeight: '1.6' }}>
                    {m.description?.substring(0, 100)}{m.description?.length > 100 ? '...' : ''}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: textSecondary }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={textSecondary} strokeWidth="2"/>
                        <path d="M16 2v4M8 2v4M3 10h18" stroke={textSecondary} strokeWidth="2"/>
                      </svg>
                      {new Date(m.date_mission).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: textSecondary }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke={textSecondary} strokeWidth="2"/>
                        <path d="M12 6v6l4 2" stroke={textSecondary} strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      {m.heure_debut} - {m.heure_fin}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: textSecondary }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke={textSecondary} strokeWidth="2"/>
                        <circle cx="12" cy="10" r="3" stroke={textSecondary} strokeWidth="2"/>
                      </svg>
                      {m.lieu}
                    </div>
                  </div>
                  <button onClick={() => postuler(m.id)} style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(244, 124, 32, 0.3)',
                    transition: 'all 0.2s ease'
                  }} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(244, 124, 32, 0.4)';
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(244, 124, 32, 0.3)';
                  }}>
                    Postuler maintenant
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MES CANDIDATURES */}
        <div style={{ 
          background: cardBg, 
          borderRadius: '24px', 
          padding: '32px', 
          boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
          border: `1px solid ${borderColor}`,
          animation: 'slideUp 0.7s ease'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: textPrimary, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke={darkMode ? '#fff' : '#1a1a1a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke={darkMode ? '#fff' : '#1a1a1a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Mes candidatures
          </h2>
          {mesCandidatures.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: textSecondary }}>
              <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📭</div>
              <p style={{ margin: 0, fontSize: '15px' }}>Aucune candidature envoyée</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mesCandidatures.map((c: any, idx: number) => {
                const statutStyles: any = {
                  'en_attente': { bg: darkMode ? 'rgba(249, 115, 22, 0.2)' : 'rgba(249, 115, 22, 0.1)', color: '#f97316', border: '#f97316', label: 'En attente' },
                  'accepté': { bg: darkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '#22c55e', label: 'Acceptée' },
                  'refusé': { bg: darkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '#ef4444', label: 'Refusée' }
                };
                const style = statutStyles[c.statut] || statutStyles['en_attente'];
                return (
                  <div key={c.id} style={{ 
                    background: darkMode ? 'rgba(255, 255, 255, 0.03)' : '#fafafa',
                    border: `1px solid ${borderColor}`, 
                    borderRadius: '16px', 
                    padding: '20px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `slideUp ${0.4 + idx * 0.1}s ease backwards`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '16px', color: textPrimary }}>{c.missions?.titre}</div>
                        <div style={{ fontSize: '14px', color: textSecondary, marginTop: '4px' }}>{c.missions?.etablissements?.nom_etablissement}</div>
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
                        {style.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: textSecondary }}>
                      Candidature envoyée le {new Date(c.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}