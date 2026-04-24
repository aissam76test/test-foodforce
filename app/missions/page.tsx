'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Missions() {
  const [user, setUser] = useState<any>(null);
  const [etablissement, setEtablissement] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState<string>('toutes');

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
          .select('*, candidatures(id, statut, extras(prenom, nom))')
          .eq('etablissement_id', etabData.id)
          .order('date_mission', { ascending: false });

        setMissions(missionsData || []);
      } else {
        window.location.href = '/dashboard-extra';
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const supprimerMission = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette mission ?')) return;
    await supabase.from('missions').delete().eq('id', id);
    setMissions(missions.filter(m => m.id !== id));
  };

  const changerStatut = async (id: string, nouveauStatut: string) => {
    await supabase.from('missions').update({ statut: nouveauStatut }).eq('id', id);
    setMissions(missions.map(m => m.id === id ? { ...m, statut: nouveauStatut } : m));
  };

  const missionsFiltrees = filtreStatut === 'toutes' 
    ? missions 
    : missions.filter(m => m.statut === filtreStatut);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'Poppins, sans-serif' }}>Chargement...</div>;

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* NAV */}
      <nav style={{ background: 'white', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <div>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#1a1a1a' }}>Food</span>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#F47C20' }}>Force</span>
        </div>
        <a href="/dashboard-etablissement" style={{ textDecoration: 'none', color: '#666', fontWeight: 600, fontSize: '14px' }}>← Retour au dashboard</a>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Mes missions</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>Gérez toutes vos missions</p>
          </div>
          <a href="/creer-mission" style={{ background: '#F47C20', color: 'white', padding: '14px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
            ➕ Créer une mission
          </a>
        </div>

        {/* FILTRES */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px', display: 'flex', gap: '12px' }}>
          {[
            { key: 'toutes', label: 'Toutes', count: missions.length },
            { key: 'ouverte', label: 'Ouvertes', count: missions.filter(m => m.statut === 'ouverte').length },
            { key: 'en_cours', label: 'En cours', count: missions.filter(m => m.statut === 'en_cours').length },
            { key: 'complétée', label: 'Complétées', count: missions.filter(m => m.statut === 'complétée').length },
          ].map(f => (
            <button key={f.key} onClick={() => setFiltreStatut(f.key)}
              style={{ flex: 1, background: filtreStatut === f.key ? '#F47C20' : '#f9f9f9', color: filtreStatut === f.key ? 'white' : '#666', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* LISTE DES MISSIONS */}
        {missionsFiltrees.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '60px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center', color: '#888' }}>
            Aucune mission {filtreStatut !== 'toutes' && filtreStatut}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {missionsFiltrees.map(m => {
              const statutColors: any = {
                'ouverte': { bg: '#FDF0E8', color: '#F47C20' },
                'en_cours': { bg: '#dbeafe', color: '#3b82f6' },
                'complétée': { bg: '#dcfce7', color: '#22c55e' },
                'annulée': { bg: '#fee', color: '#ef4444' }
              };
              const style = statutColors[m.statut] || statutColors['ouverte'];
              
              return (
                <div key={m.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{m.titre}</h3>
                        <span style={{ background: style.bg, color: style.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                          {m.statut}
                        </span>
                      </div>
                      <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>{m.description || 'Pas de description'}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#F47C20' }}>{m.taux_horaire} MAD/h</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{m.nombre_extras} poste{m.nombre_extras > 1 ? 's' : ''}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>📅 Date</div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{new Date(m.date_mission).toLocaleDateString('fr-FR')}</div>
                    </div>
                    <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>⏰ Horaires</div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{m.heure_debut} - {m.heure_fin}</div>
                    </div>
                    <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>📍 Lieu</div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{m.lieu || '-'}</div>
                    </div>
                    <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>👥 Candidatures</div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{m.candidatures?.length || 0}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {m.statut === 'ouverte' && (
                      <button onClick={() => changerStatut(m.id, 'en_cours')} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                        ▶️ Démarrer
                      </button>
                    )}
                    {m.statut === 'en_cours' && (
                      <button onClick={() => changerStatut(m.id, 'complétée')} style={{ background: '#22c55e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                        ✅ Terminer
                      </button>
                    )}
                    <a href={`/candidatures?mission=${m.id}`} style={{ background: '#f5f5f5', color: '#1a1a1a', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
                      📋 Voir candidatures ({m.candidatures?.length || 0})
                    </a>
                    <button onClick={() => supprimerMission(m.id)} style={{ background: '#fee', color: '#ef4444', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                      🗑️ Supprimer
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