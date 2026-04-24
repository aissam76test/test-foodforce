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

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);

      const { data: etabData } = await supabase.from('etablissements').select('*').eq('email', user.email).single();
      if (etabData) {
        setEtablissement(etabData);

        // Stats
        const { data: missions } = await supabase
          .from('missions')
          .select('*, candidatures(*)')
          .eq('etablissement_id', etabData.id);

        const actives = missions?.filter((m: any) => m.statut === 'ouverte').length || 0;
        const completees = missions?.filter((m: any) => m.statut === 'complétée').length || 0;
        const candidatures = missions?.reduce((acc, m) => acc + (m.candidatures?.length || 0), 0) || 0;
        const embauches = missions?.reduce((acc, m) => acc + (m.candidatures?.filter((c: any) => c.statut === 'accepté').length || 0), 0) || 0;

        setStats({ missions_actives: actives, missions_completees: completees, candidatures_recues: candidatures, extras_embauches: embauches });

        // Missions récentes
        const recentes = missions
          ?.sort((a: any, b: any) => new Date(b.date_mission).getTime() - new Date(a.date_mission).getTime())
          .slice(0, 5);
        setMissionsRecentes(recentes || []);

        // Candidatures récentes
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
          <a href="/missions" style={{ textDecoration: 'none', color: '#666', fontWeight: 600, fontSize: '14px' }}>Mes missions</a>
          <a href="/profil-etablissement" style={{ textDecoration: 'none', color: '#666', fontWeight: 600, fontSize: '14px' }}>Mon établissement</a>
          <button onClick={handleLogout} style={{ background: '#f5f5f5', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
            Se déconnecter
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        {/* HEADER */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Bonjour {etablissement?.nom_etablissement} 🏢</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>Voici un aperçu de votre activité de recrutement</p>
        </div>

        {/* STATS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>🎯 Missions actives</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#F47C20' }}>{stats.missions_actives}</div>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>✅ Missions complétées</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#22c55e' }}>{stats.missions_completees}</div>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>📩 Candidatures reçues</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#3b82f6' }}>{stats.candidatures_recues}</div>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>👥 Extras embauchés</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a1a' }}>{stats.extras_embauches}</div>
          </div>
        </div>

        {/* ACTIONS RAPIDES */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Actions rapides</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <a href="/creer-mission" style={{ background: '#F47C20', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, textAlign: 'center' }}>
              ➕ Créer une mission
            </a>
            <a href="/candidatures" style={{ background: '#1a1a1a', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, textAlign: 'center' }}>
              📋 Voir les candidatures
            </a>
            <a href="/missions" style={{ background: '#f5f5f5', color: '#1a1a1a', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, textAlign: 'center' }}>
              🎯 Gérer mes missions
            </a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* MISSIONS RECENTES */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Mes missions récentes</h2>
            {missionsRecentes.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', padding: '40px 0' }}>Aucune mission pour le moment</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {missionsRecentes.map((m: any) => {
                  const statutColors: any = {
                    'ouverte': { bg: '#FDF0E8', color: '#F47C20' },
                    'en_cours': { bg: '#dbeafe', color: '#3b82f6' },
                    'complétée': { bg: '#dcfce7', color: '#22c55e' },
                    'annulée': { bg: '#fee', color: '#ef4444' }
                  };
                  const style = statutColors[m.statut] || statutColors['ouverte'];
                  return (
                    <div key={m.id} style={{ border: '1px solid #f0f0f0', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <div style={{ fontWeight: 700 }}>{m.titre}</div>
                        <span style={{ background: style.bg, color: style.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                          {m.statut}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#666' }}>
                        {new Date(m.date_mission).toLocaleDateString('fr-FR')} • {m.heure_debut} - {m.heure_fin}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                        {m.candidatures?.length || 0} candidature{(m.candidatures?.length || 0) > 1 ? 's' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CANDIDATURES EN ATTENTE */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Candidatures en attente</h2>
            {candidaturesRecentes.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', padding: '40px 0' }}>Aucune candidature en attente</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {candidaturesRecentes.map((c: any) => (
                  <div key={c.id} style={{ border: '1px solid #f0f0f0', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontWeight: 700, marginBottom: '4px' }}>
                      {c.extras?.prenom} {c.extras?.nom}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                      Pour : {c.missions?.titre}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a href={`/candidatures?mission=${c.mission_id}`} style={{ flex: 1, background: '#22c55e', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                        Voir le profil
                      </a>
                    </div>
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