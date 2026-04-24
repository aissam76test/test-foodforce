'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function DashboardExtra() {
  const [user, setUser] = useState<any>(null);
  const [extra, setExtra] = useState<any>(null);
  const [stats, setStats] = useState({ missions_total: 0, missions_acceptees: 0, missions_completees: 0, revenu_total: 0 });
  const [missionsRecentes, setMissionsRecentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);

      const { data: extraData } = await supabase.from('extras').select('*').eq('email', user.email).single();
      if (extraData) {
        setExtra(extraData);

        // Stats
        const { data: cands } = await supabase
          .from('candidatures')
          .select('*, missions(*)')
          .eq('extra_id', extraData.id);

        const total = cands?.length || 0;
        const acceptees = cands?.filter((c: any) => c.statut === 'accepté').length || 0;
        const completees = cands?.filter((c: any) => c.statut === 'complétée').length || 0;
        
        const revenuTotal = cands
          ?.filter((c: any) => c.statut === 'complétée')
          .reduce((acc, c) => {
            const m = c.missions;
            if (!m) return acc;
            const [h1, m1] = m.heure_debut.split(':').map(Number);
            const [h2, m2] = m.heure_fin.split(':').map(Number);
            const duree = ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60;
            return acc + duree * m.taux_horaire;
          }, 0) || 0;

        setStats({ missions_total: total, missions_acceptees: acceptees, missions_completees: completees, revenu_total: revenuTotal });

        // Missions récentes
        const recentes = cands
          ?.filter((c: any) => c.missions)
          .sort((a: any, b: any) => new Date(b.missions.date_mission).getTime() - new Date(a.missions.date_mission).getTime())
          .slice(0, 5);
        setMissionsRecentes(recentes || []);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'Poppins, sans-serif' }}>Chargement...</div>;

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* NAV */}
      <nav style={{ background: 'white', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <div>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#1a1a1a' }}>Food</span>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#F47C20' }}>Force</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href="/profil" style={{ textDecoration: 'none', color: '#666', fontWeight: 600, fontSize: '14px' }}>Mon profil</a>
          <button onClick={handleLogout} style={{ background: '#f5f5f5', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
            Se déconnecter
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        {/* HEADER */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Bonjour {extra?.prenom} 👋</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>Voici un aperçu de votre activité</p>
        </div>

        {/* STATS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>📊 Candidatures envoyées</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a1a' }}>{stats.missions_total}</div>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>✅ Missions acceptées</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#22c55e' }}>{stats.missions_acceptees}</div>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>🏆 Missions complétées</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#3b82f6' }}>{stats.missions_completees}</div>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>💰 Revenu total</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#F47C20' }}>{stats.revenu_total.toFixed(0)} MAD</div>
          </div>
        </div>

        {/* ACTIONS RAPIDES */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Actions rapides</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <a href="/profil?tab=missions" style={{ background: '#F47C20', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, textAlign: 'center' }}>
              🎯 Voir les missions
            </a>
            <a href="/profil?tab=mci" style={{ background: '#1a1a1a', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, textAlign: 'center' }}>
              📄 Générer une facture
            </a>
            <a href="/profil?tab=profil" style={{ background: '#f5f5f5', color: '#1a1a1a', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, textAlign: 'center' }}>
              👤 Modifier mon profil
            </a>
          </div>
        </div>

        {/* MISSIONS RECENTES */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Mes candidatures récentes</h2>
          {missionsRecentes.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '40px 0' }}>Aucune candidature pour le moment</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {missionsRecentes.map((c: any) => {
                const m = c.missions;
                const statutColors: any = {
                  'en_attente': { bg: '#FDF0E8', color: '#F47C20' },
                  'accepté': { bg: '#dcfce7', color: '#22c55e' },
                  'complétée': { bg: '#dbeafe', color: '#3b82f6' },
                  'refusé': { bg: '#fee', color: '#ef4444' }
                };
                const style = statutColors[c.statut] || statutColors['en_attente'];
                return (
                  <div key={c.id} style={{ border: '1px solid #f0f0f0', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '4px' }}>{m.titre}</div>
                      <div style={{ fontSize: '13px', color: '#666' }}>{new Date(m.date_mission).toLocaleDateString('fr-FR')} • {m.heure_debut} - {m.heure_fin}</div>
                    </div>
                    <span style={{ background: style.bg, color: style.color, padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
                      {c.statut}
                    </span>
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