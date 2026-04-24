'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Candidatures() {
  const [user, setUser] = useState<any>(null);
  const [etablissement, setEtablissement] = useState<any>(null);
  const [candidatures, setCandidatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState<string>('toutes');
  const [missionFilter, setMissionFilter] = useState<string>('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);

      const { data: etabData } = await supabase.from('etablissements').select('*').eq('email', user.email).single();
      if (etabData) {
        setEtablissement(etabData);

        // Récupérer le paramètre mission depuis l'URL
        const params = new URLSearchParams(window.location.search);
        const missionId = params.get('mission');
        if (missionId) setMissionFilter(missionId);

        const { data: candsData } = await supabase
          .from('candidatures')
          .select('*, missions!inner(*), extras(*)')
          .eq('missions.etablissement_id', etabData.id)
          .order('created_at', { ascending: false });

        setCandidatures(candsData || []);
      } else {
        window.location.href = '/dashboard-extra';
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const changerStatut = async (id: string, nouveauStatut: string) => {
    await supabase.from('candidatures').update({ statut: nouveauStatut }).eq('id', id);
    setCandidatures(candidatures.map(c => c.id === id ? { ...c, statut: nouveauStatut } : c));
  };

  const candidaturesFiltrees = candidatures
    .filter(c => filtreStatut === 'toutes' || c.statut === filtreStatut)
    .filter(c => !missionFilter || c.mission_id === missionFilter);

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
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Candidatures</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>Gérez les candidatures reçues pour vos missions</p>
        </div>

        {/* FILTRES */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px', display: 'flex', gap: '12px' }}>
          {[
            { key: 'toutes', label: 'Toutes', count: candidatures.length },
            { key: 'en_attente', label: 'En attente', count: candidatures.filter(c => c.statut === 'en_attente').length },
            { key: 'accepté', label: 'Acceptées', count: candidatures.filter(c => c.statut === 'accepté').length },
            { key: 'refusé', label: 'Refusées', count: candidatures.filter(c => c.statut === 'refusé').length },
          ].map(f => (
            <button key={f.key} onClick={() => setFiltreStatut(f.key)}
              style={{ flex: 1, background: filtreStatut === f.key ? '#F47C20' : '#f9f9f9', color: filtreStatut === f.key ? 'white' : '#666', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* LISTE DES CANDIDATURES */}
        {candidaturesFiltrees.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '60px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center', color: '#888' }}>
            Aucune candidature {filtreStatut !== 'toutes' && filtreStatut}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {candidaturesFiltrees.map(c => {
              const statutColors: any = {
                'en_attente': { bg: '#FDF0E8', color: '#F47C20' },
                'accepté': { bg: '#dcfce7', color: '#22c55e' },
                'refusé': { bg: '#fee', color: '#ef4444' },
                'complétée': { bg: '#dbeafe', color: '#3b82f6' }
              };
              const style = statutColors[c.statut] || statutColors['en_attente'];

              return (
                <div key={c.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
                          {c.extras?.prenom} {c.extras?.nom}
                        </h3>
                        <span style={{ background: style.bg, color: style.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                          {c.statut}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                        📧 {c.extras?.email}
                      </div>
                      {c.extras?.telephone && (
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          📞 {c.extras.telephone}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ fontWeight: 700, marginBottom: '8px' }}>Mission : {c.missions?.titre}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '13px', color: '#666' }}>
                      <div>📅 {new Date(c.missions?.date_mission).toLocaleDateString('fr-FR')}</div>
                      <div>⏰ {c.missions?.heure_debut} - {c.missions?.heure_fin}</div>
                      <div>💰 {c.missions?.taux_horaire} MAD/h</div>
                    </div>
                  </div>

                  {c.extras && (
                    <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                      <div style={{ fontWeight: 700, marginBottom: '8px' }}>Profil du candidat</div>
                      <div style={{ fontSize: '13px', color: '#666' }}>
                        {c.extras.bio && <div style={{ marginBottom: '8px' }}>{c.extras.bio}</div>}
                        {c.extras.postes && c.extras.postes.length > 0 && (
                          <div style={{ marginBottom: '8px' }}>
                            <strong>Postes :</strong> {c.extras.postes.slice(0, 3).join(', ')}
                            {c.extras.postes.length > 3 && ` +${c.extras.postes.length - 3}`}
                          </div>
                        )}
                        {c.extras.competences && c.extras.competences.length > 0 && (
                          <div>
                            <strong>Compétences :</strong> {c.extras.competences.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {c.statut === 'en_attente' && (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => changerStatut(c.id, 'accepté')}
                        style={{ flex: 1, background: '#22c55e', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
                        ✅ Accepter
                      </button>
                      <button onClick={() => changerStatut(c.id, 'refusé')}
                        style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
                        ❌ Refuser
                      </button>
                    </div>
                  )}

                  {c.statut === 'accepté' && (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => changerStatut(c.id, 'complétée')}
                        style={{ flex: 1, background: '#3b82f6', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
                        ✔️ Marquer comme complétée
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}