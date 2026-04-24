'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function DashboardEtablissement() {
  const [user, setUser] = useState<any>(null);
  const [etablissement, setEtablissement] = useState<any>(null);
  const [stats, setStats] = useState({ missions_actives: 0, missions_completees: 0, candidatures_recues: 0, extras_embauches: 0 });
  const [missionsRecentes, setMissionsRecentes] = useState<any[]>([]);
  const [candidaturesRecentes, setCandidaturesRecentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);

      const { data: etabData } = await supabase.from('etablissements').select('*').eq('email', user.email).single();
      if (etabData) {
        setEtablissement(etabData);

        const { data: missions } = await supabase
          .from('missions')
          .select('*, candidatures(*)')
          .eq('etablissement_id', etabData.id);

        const actives = missions?.filter((m: any) => m.statut === 'ouverte').length || 0;
        const completees = missions?.filter((m: any) => m.statut === 'complétée').length || 0;
        const candidatures = missions?.reduce((acc, m) => acc + (m.candidatures?.length || 0), 0) || 0;
        const embauches = missions?.reduce((acc, m) => acc + (m.candidatures?.filter((c: any) => c.statut === 'accepté').length || 0), 0) || 0;

        setStats({ missions_actives: actives, missions_completees: completees, candidatures_recues: candidatures, extras_embauches: embauches });

        const recentes = missions
          ?.sort((a: any, b: any) => new Date(b.date_mission).getTime() - new Date(a.date_mission).getTime())
          .slice(0, 5);
        setMissionsRecentes(recentes || []);

        const { data: candsRecentes } = await supabase
          .from('candidatures')
          .select('*, missions!inner(*), extras(*)')
          .eq('missions.etablissement_id', etabData.id)
          .eq('statut', 'en_attente')
          .order('created_at', { ascending: false })
          .limit(5);
        setCandidaturesRecentes(candsRecentes || []);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const bg = darkMode ? '#0a0a0a' : 'linear-gradient(135deg, #FDF0E8 0%, #fff 100%)';
  const cardBg = darkMode ? 'rgba(255, 255, 255, 0.05)' : '#fff';
  const textPrimary = darkMode ? '#fff' : '#1a1a1a';
  const textSecondary = darkMode ? '#999' : '#666';
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.05)';

  if (loading) return (
    <div style={{ fontFamily: 'Poppins, sans-serif', background: bg, minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Skeleton Nav */}
        <div style={{ background: cardBg, borderRadius: '20px', padding: '20px', marginBottom: '40px', border: `1px solid ${borderColor}` }}>
          <div style={{ height: '32px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '8px', width: '200px' }} />
        </div>
        {/* Skeleton Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
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
      {/* NAVBAR GLASSMORPHISM */}
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
            {/* Logo SVG */}
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
          <span style={{ fontSize: '13px', color: textSecondary, fontWeight: 500 }}>Espace Recruteur</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="/missions" style={{ 
            textDecoration: 'none', 
            color: textSecondary, 
            fontWeight: 600, 
            fontSize: '14px',
            padding: '10px 16px',
            borderRadius: '10px',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }} onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.1)' : '#FDF0E8'}
             onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            Mes missions
          </a>
          <a href="/candidatures" style={{ 
            textDecoration: 'none', 
            color: textSecondary, 
            fontWeight: 600, 
            fontSize: '14px',
            padding: '10px 16px',
            borderRadius: '10px',
            transition: 'all 0.2s ease'
          }} onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.1)' : '#FDF0E8'}
             onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            Candidatures
          </a>
          {/* Dark Mode Toggle */}
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
        {/* HEADER ANIMÉ */}
        <div style={{ marginBottom: '40px', animation: 'slideDown 0.6s ease' }}>
          <style>{`
            @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
          `}</style>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 800, margin: 0, background: darkMode ? 'linear-gradient(135deg, #fff 0%, #999 100%)' : 'linear-gradient(135deg, #1a1a1a 0%, #F47C20 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px' }}>
              Bonjour {etablissement?.nom_etablissement}
            </h1>
            <span style={{ fontSize: '36px', animation: 'wave 1s ease infinite' }}>👋</span>
            <style>{`@keyframes wave { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(20deg); } }`}</style>
          </div>
          <p style={{ color: textSecondary, fontSize: '16px', margin: 0 }}>Voici un aperçu de votre activité de recrutement aujourd'hui</p>
        </div>

        {/* STATS CARDS AVEC MINI CHARTS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {[
            { 
              icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="url(#g1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="g1"><stop stopColor="#F47C20"/><stop offset="1" stopColor="#FF9A56"/></linearGradient></defs></svg>,
              label: 'Missions actives', 
              value: stats.missions_actives, 
              gradient: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)', 
              bg: darkMode ? 'rgba(244, 124, 32, 0.1)' : 'rgba(244, 124, 32, 0.08)',
              change: '+12%'
            },
            { 
              icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="url(#g2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 4L12 14.01l-3-3" stroke="url(#g2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="g2"><stop stopColor="#22c55e"/><stop offset="1" stopColor="#4ade80"/></linearGradient></defs></svg>,
              label: 'Missions complétées', 
              value: stats.missions_completees, 
              gradient: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)', 
              bg: darkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.08)',
              change: '+8%'
            },
            { 
              icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="url(#g3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 6l-10 7L2 6" stroke="url(#g3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="g3"><stop stopColor="#3b82f6"/><stop offset="1" stopColor="#60a5fa"/></linearGradient></defs></svg>,
              label: 'Candidatures reçues', 
              value: stats.candidatures_recues, 
              gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', 
              bg: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.08)',
              change: '+24%'
            },
            { 
              icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="url(#g4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="url(#g4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="url(#g4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="g4"><stop stopColor="#8b5cf6"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs></svg>,
              label: 'Extras embauchés', 
              value: stats.extras_embauches, 
              gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', 
              bg: darkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)',
              change: '+16%'
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
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '48px', fontWeight: 800, background: stat.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-2px' }}>
                    {stat.value}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: 700, 
                    color: '#22c55e', 
                    background: 'rgba(34, 197, 94, 0.1)', 
                    padding: '4px 10px', 
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 9V3M6 3L3 6M6 3l3 3" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {stat.change}
                  </div>
                </div>
                {/* Mini Chart SVG */}
                <svg width="100%" height="40" viewBox="0 0 200 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`chart${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={stat.gradient.match(/#[0-9A-F]{6}/gi)?.[0] || '#F47C20'} stopOpacity="0.3"/>
                      <stop offset="100%" stopColor={stat.gradient.match(/#[0-9A-F]{6}/gi)?.[0] || '#F47C20'} stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M0,30 Q20,25 40,28 T80,20 T120,15 T160,18 T200,12" fill={`url(#chart${i})`} stroke="none"/>
                  <path d="M0,30 Q20,25 40,28 T80,20 T120,15 T160,18 T200,12" fill="none" stroke={stat.gradient.match(/#[0-9A-F]{6}/gi)?.[0] || '#F47C20'} strokeWidth="2"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* ACTIONS RAPIDES GLASSMORPHISM */}
        <div style={{ 
          background: darkMode 
            ? 'linear-gradient(135deg, rgba(244, 124, 32, 0.15) 0%, rgba(255, 154, 86, 0.15) 100%)'
            : 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)', 
          borderRadius: '28px', 
          padding: '40px', 
          boxShadow: darkMode ? '0 12px 48px rgba(244, 124, 32, 0.2)' : '0 12px 48px rgba(244, 124, 32, 0.3)',
          marginBottom: '40px',
          position: 'relative',
          overflow: 'hidden',
          border: darkMode ? '1px solid rgba(244, 124, 32, 0.3)' : 'none',
          backdropFilter: darkMode ? 'blur(20px)' : 'none',
          animation: 'slideUp 0.6s ease'
        }}>
          <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '600px', height: '600px', background: darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.15)', borderRadius: '50%', filter: 'blur(100px)' }} />
          <div style={{ position: 'absolute', bottom: '-40%', left: '-15%', width: '500px', height: '500px', background: darkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', filter: 'blur(80px)' }} />
          
          <h2 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '28px', color: darkMode ? '#fff' : '#fff', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" fill={darkMode ? '#fff' : '#fff'} fillOpacity="0.9"/>
            </svg>
            Actions rapides
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', position: 'relative', zIndex: 1 }}>
            <a href="/creer-mission" style={{ 
              background: darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: darkMode ? '#fff' : '#fff', 
              padding: '24px', 
              borderRadius: '18px', 
              textDecoration: 'none', 
              fontWeight: 700,
              fontSize: '16px',
              textAlign: 'left',
              boxShadow: darkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.15)',
              border: darkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
              e.currentTarget.style.boxShadow = darkMode ? '0 16px 48px rgba(0, 0, 0, 0.5)' : '0 16px 48px rgba(0, 0, 0, 0.25)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = darkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.15)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Créer une mission</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, fontWeight: 400 }}>Publier une nouvelle offre pour recruter</p>
            </a>
            <a href="/candidatures" style={{ 
              background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: darkMode ? '#fff' : '#fff',
              padding: '24px', 
              borderRadius: '18px', 
              textDecoration: 'none', 
              fontWeight: 700,
              fontSize: '16px',
              textAlign: 'left',
              border: darkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
              e.currentTarget.style.background = darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.background = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11l3 3L22 4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Voir les candidatures</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, fontWeight: 400 }}>Consulter et gérer les candidats</p>
            </a>
            <a href="/missions" style={{ 
              background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: darkMode ? '#fff' : '#fff',
              padding: '24px', 
              borderRadius: '18px', 
              textDecoration: 'none', 
              fontWeight: 700,
              fontSize: '16px',
              textAlign: 'left',
              border: darkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
              e.currentTarget.style.background = darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.background = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Gérer mes missions</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, fontWeight: 400 }}>Modifier et suivre vos missions</p>
            </a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
          {/* MISSIONS RECENTES */}
          <div style={{ 
            background: cardBg, 
            borderRadius: '24px', 
            padding: '32px', 
            boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
            border: `1px solid ${borderColor}`,
            animation: 'slideUp 0.6s ease'
          }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', color: textPrimary, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke={darkMode ? '#fff' : '#1a1a1a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke={darkMode ? '#fff' : '#1a1a1a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Missions récentes
            </h2>
            {missionsRecentes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: textSecondary }}>
                <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📭</div>
                <p style={{ margin: 0, fontSize: '15px' }}>Aucune mission pour le moment</p>
                <a href="/creer-mission" style={{ 
                  display: 'inline-block',
                  marginTop: '20px',
                  color: '#F47C20',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '14px'
                }}>Créer ma première mission →</a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {missionsRecentes.map((m: any, idx: number) => {
                  const statutStyles: any = {
                    'ouverte': { bg: darkMode ? 'rgba(244, 124, 32, 0.2)' : 'rgba(244, 124, 32, 0.1)', color: '#F47C20', border: '#F47C20' },
                    'en_cours': { bg: darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '#3b82f6' },
                    'complétée': { bg: darkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '#22c55e' },
                    'annulée': { bg: darkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '#ef4444' }
                  };
                  const style = statutStyles[m.statut] || statutStyles['ouverte'];
                  return (
                    <div key={m.id} style={{ 
                      background: darkMode ? 'rgba(255, 255, 255, 0.03)' : '#fafafa',
                      border: `1px solid ${borderColor}`, 
                      borderRadius: '16px', 
                      padding: '20px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      animation: `slideUp ${0.4 + idx * 0.1}s ease backwards`
                    }} onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(8px)';
                      e.currentTarget.style.boxShadow = darkMode ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.08)';
                      e.currentTarget.style.borderColor = style.border;
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = borderColor;
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div style={{ fontWeight: 700, fontSize: '16px', color: textPrimary }}>{m.titre}</div>
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
                          {m.statut}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: textSecondary, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={textSecondary} strokeWidth="2"/>
                            <path d="M16 2v4M8 2v4M3 10h18" stroke={textSecondary} strokeWidth="2"/>
                          </svg>
                          {new Date(m.date_mission).toLocaleDateString('fr-FR')}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke={textSecondary} strokeWidth="2"/>
                            <path d="M12 6v6l4 2" stroke={textSecondary} strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          {m.heure_debut} - {m.heure_fin}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: style.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke={style.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="9" cy="7" r="4" stroke={style.color} strokeWidth="2"/>
                        </svg>
                        {m.candidatures?.length || 0} candidature{(m.candidatures?.length || 0) > 1 ? 's' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CANDIDATURES EN ATTENTE */}
          <div style={{ 
            background: cardBg, 
            borderRadius: '24px', 
            padding: '32px', 
            boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
            border: `1px solid ${borderColor}`,
            animation: 'slideUp 0.7s ease'
          }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', color: textPrimary, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke={darkMode ? '#fff' : '#1a1a1a'} strokeWidth="2"/>
                <path d="M12 6v6l4 2" stroke={darkMode ? '#fff' : '#1a1a1a'} strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Candidatures en attente
            </h2>
            {candidaturesRecentes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: textSecondary }}>
                <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>✅</div>
                <p style={{ margin: 0, fontSize: '15px' }}>Aucune candidature en attente</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {candidaturesRecentes.map((c: any, idx: number) => (
                  <div key={c.id} style={{ 
                    background: darkMode ? 'rgba(255, 255, 255, 0.03)' : '#fafafa',
                    border: `1px solid ${borderColor}`, 
                    borderRadius: '16px', 
                    padding: '20px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    animation: `slideUp ${0.4 + idx * 0.1}s ease backwards`
                  }} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(8px)';
                    e.currentTarget.style.boxShadow = darkMode ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.08)';
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '18px'
                      }}>
                        {c.extras?.prenom?.[0]}{c.extras?.nom?.[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '16px', color: textPrimary }}>
                          {c.extras?.prenom} {c.extras?.nom}
                        </div>
                        <div style={{ fontSize: '13px', color: textSecondary }}>
                          {c.missions?.titre}
                        </div>
                      </div>
                    </div>
                    <a href={`/candidatures?mission=${c.mission_id}`} style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)', 
                      color: '#fff', 
                      padding: '12px', 
                      borderRadius: '12px', 
                      fontSize: '14px', 
                      fontWeight: 700, 
                      textDecoration: 'none',
                      boxShadow: '0 4px 16px rgba(34, 197, 94, 0.25)',
                      transition: 'all 0.2s ease'
                    }} onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.35)';
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(34, 197, 94, 0.25)';
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Voir le profil
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}