'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('etablissements');
  const [etablissements, setEtablissements] = useState<any[]>([]);
  const [extras, setExtras] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const ADMIN_PASSWORD = 'Mohamed1983';

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [authenticated, activeTab]);

  const loadData = async () => {
    setLoading(true);
    if (activeTab === 'etablissements') {
      const { data } = await supabase.from('etablissements').select('*').order('created_at', { ascending: false });
      setEtablissements(data || []);
    } else if (activeTab === 'extras') {
      const { data } = await supabase.from('extras').select('*').order('created_at', { ascending: false });
      setExtras(data || []);
    } else if (activeTab === 'missions') {
      const { data } = await supabase.from('missions').select('*, etablissements(nom_etablissement)').order('created_at', { ascending: false });
      setMissions(data || []);
    }
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert('❌ Mot de passe incorrect');
    }
  };

  const validateDocument = async (etablissementId: string, docType: string, statut: string) => {
    const field = `${docType}_statut`;
    await supabase.from('etablissements').update({ [field]: statut }).eq('id', etablissementId);
    loadData();
    alert(`✅ Document ${statut}`);
  };

  const bg = darkMode ? '#0a0a0a' : 'linear-gradient(135deg, #FDF0E8 0%, #fff 100%)';
  const cardBg = darkMode ? 'rgba(255, 255, 255, 0.05)' : '#fff';
  const textPrimary = darkMode ? '#fff' : '#1a1a1a';
  const textSecondary = darkMode ? '#999' : '#666';
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.08)';

  if (!authenticated) {
    return (
      <main style={{ fontFamily: 'Poppins, sans-serif', background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ 
          background: cardBg,
          backdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '32px', 
          padding: '48px', 
          width: '100%', 
          maxWidth: '480px',
          boxShadow: darkMode ? '0 20px 80px rgba(0,0,0,0.6)' : '0 20px 80px rgba(0,0,0,0.12)',
          border: `1px solid ${borderColor}`
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0', color: textPrimary }}>Panneau Admin</h1>
            <p style={{ color: textSecondary, fontSize: '15px', margin: 0 }}>Accès réservé aux administrateurs</p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: textPrimary }}>Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe"
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  border: `2px solid ${borderColor}`,
                  fontSize: '15px',
                  outline: 'none',
                  background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa',
                  color: textPrimary,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              style={{ 
                width: '100%', 
                background: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)', 
                color: '#fff', 
                padding: '16px', 
                borderRadius: '12px', 
                border: 'none', 
                fontSize: '16px', 
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(244, 124, 32, 0.3)'
              }}
            >
              Se connecter
            </button>
          </form>
        </div>
      </main>
    );
  }

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
          <span style={{ fontSize: '13px', color: textSecondary, fontWeight: 600 }}>Admin Panel</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => setDarkMode(!darkMode)} style={{ background: darkMode ? 'rgba(255,255,255,0.1)' : '#f5f5f5', border: 'none', width: '40px', height: '40px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setAuthenticated(false)} style={{ background: darkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Déconnexion
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '40px 20px' }}>
        {/* HEADER */}
        <div style={{ marginBottom: '32px', animation: 'slideIn 0.6s ease' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px 0', color: textPrimary }}>Panneau d'administration</h1>
          <p style={{ color: textSecondary, fontSize: '15px', margin: 0 }}>Gérez les établissements, extras et missions</p>
        </div>

        {/* TABS */}
        <div style={{ 
          background: cardBg,
          backdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '20px', 
          padding: '8px', 
          boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
          border: `1px solid ${borderColor}`,
          marginBottom: '32px',
          display: 'flex',
          gap: '8px',
          animation: 'slideIn 0.7s ease'
        }}>
          {[
            { id: 'etablissements', label: '🏢 Établissements', count: etablissements.length },
            { id: 'extras', label: '👥 Extras', count: extras.length },
            { id: 'missions', label: '📋 Missions', count: missions.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                background: activeTab === tab.id ? 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : textPrimary,
                border: 'none',
                padding: '16px 24px',
                borderRadius: '14px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {tab.label}
              <span style={{ 
                background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : darkMode ? 'rgba(255,255,255,0.1)' : '#f0f0f0',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px' }}>
            <div style={{ width: '48px', height: '48px', border: '4px solid #e3e8ee', borderTop: '4px solid #F47C20', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            {/* ÉTABLISSEMENTS */}
            {activeTab === 'etablissements' && (
              <div style={{ display: 'grid', gap: '20px' }}>
                {etablissements.map((etab: any, idx: number) => (
                  <div key={etab.id} style={{ 
                    background: cardBg,
                    backdropFilter: 'blur(20px) saturate(180%)',
                    borderRadius: '20px', 
                    padding: '28px',
                    boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
                    border: `1px solid ${borderColor}`,
                    animation: `slideIn ${0.5 + idx * 0.1}s ease`
                  }}>
                    <div style={{ marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 700, color: textPrimary, margin: '0 0 8px 0' }}>{etab.nom_etablissement}</h3>
                      <div style={{ fontSize: '14px', color: textSecondary }}>
                        {etab.type_etablissement} • {etab.ville} • {etab.email}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                      {[
                        { key: 'kbis', label: 'KBIS' },
                        { key: 'patente', label: 'Patente' },
                        { key: 'cin_gerant', label: 'CIN Gérant' },
                        { key: 'rib', label: 'RIB' }
                      ].map(doc => {
                        const statut = etab[`${doc.key}_statut`];
                        const url = etab[`${doc.key}_url`];
                        const statutColors: any = {
                          'validé': { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '#22c55e' },
                          'en_attente': { bg: 'rgba(249, 115, 22, 0.1)', color: '#f97316', border: '#f97316' },
                          'refusé': { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '#ef4444' }
                        };
                        const style = statutColors[statut] || statutColors['en_attente'];

                        return (
                          <div key={doc.key} style={{ 
                            background: darkMode ? 'rgba(255,255,255,0.03)' : '#fafafa',
                            borderRadius: '12px',
                            padding: '16px',
                            border: `1px solid ${borderColor}`
                          }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, marginBottom: '8px' }}>{doc.label}</div>
                            <div style={{ 
                              background: style.bg,
                              color: style.color,
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: 700,
                              textAlign: 'center',
                              marginBottom: '12px',
                              border: `1px solid ${style.border}`,
                              textTransform: 'uppercase'
                            }}>
                              {statut || 'Non uploadé'}
                            </div>
                            {url && (
                              <>
                                <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '12px', color: '#3b82f6', textDecoration: 'none', marginBottom: '8px' }}>
                                  Voir le document →
                                </a>
                                {statut !== 'validé' && (
                                  <div style={{ display: 'flex', gap: '4px' }}>
                                    <button onClick={() => validateDocument(etab.id, doc.key, 'validé')} style={{ flex: 1, background: '#22c55e', color: '#fff', border: 'none', padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                                      ✓
                                    </button>
                                    <button onClick={() => validateDocument(etab.id, doc.key, 'refusé')} style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                                      ✕
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EXTRAS */}
            {activeTab === 'extras' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {extras.map((extra: any, idx: number) => (
                  <div key={extra.id} style={{ 
                    background: cardBg,
                    backdropFilter: 'blur(20px) saturate(180%)',
                    borderRadius: '20px', 
                    padding: '24px',
                    boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
                    border: `1px solid ${borderColor}`,
                    animation: `slideIn ${0.5 + idx * 0.1}s ease`
                  }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: textPrimary, margin: '0 0 12px 0' }}>
                      {extra.prenom} {extra.nom}
                    </h3>
                    <div style={{ fontSize: '14px', color: textSecondary, lineHeight: '1.8' }}>
                      <div>📧 {extra.email}</div>
                      <div>📱 {extra.telephone}</div>
                      <div>📍 {extra.ville}</div>
                      <div>💼 {extra.experience}</div>
                    </div>
                    {extra.competences && extra.competences.length > 0 && (
                      <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {extra.competences.map((comp: string, i: number) => (
                          <span key={i} style={{ background: darkMode ? 'rgba(244, 124, 32, 0.2)' : 'rgba(244, 124, 32, 0.1)', color: '#F47C20', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
                            {comp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* MISSIONS */}
            {activeTab === 'missions' && (
              <div style={{ display: 'grid', gap: '16px' }}>
                {missions.map((mission: any, idx: number) => (
                  <div key={mission.id} style={{ 
                    background: cardBg,
                    backdropFilter: 'blur(20px) saturate(180%)',
                    borderRadius: '16px', 
                    padding: '20px',
                    boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
                    border: `1px solid ${borderColor}`,
                    animation: `slideIn ${0.5 + idx * 0.1}s ease`,
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '20px',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: textPrimary, margin: '0 0 8px 0' }}>{mission.titre}</h3>
                      <div style={{ fontSize: '13px', color: textSecondary }}>
                        {mission.etablissements?.nom_etablissement} • {mission.poste_requis} • {mission.lieu} • {new Date(mission.date_mission).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#F47C20' }}>
                      {mission.taux_horaire} MAD/h
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}