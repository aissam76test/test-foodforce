'use client';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

export default function Home() {
  const [missions, setMissions] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from('missions')
      .select('*, etablissements(type, ville, adresse)')
      .eq('statut', 'ouverte')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setMissions(data || []));
  }, []);

  const tauxNet = (taux: number) => Math.round(taux * 0.75);

  const getQuartier = (adresse: string) => {
    if (!adresse) return '';
    const parts = adresse.split(',');
    return parts.length > 1 ? parts[1].trim() : '';
  };

  return (
    <main style={{ fontFamily: "'Poppins', sans-serif", overflowX: 'hidden' }}>

      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 60px', background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="36" height="36" viewBox="0 0 170 190">
            <path d="M85,5 C52,5 20,32 20,70 C20,108 85,185 85,185 C85,185 150,108 150,70 C150,32 118,5 85,5 Z" fill="#F47C20"/>
            <path d="M85,18 C58,18 33,40 33,70 C33,102 85,168 85,168 C85,168 137,102 137,70 C137,40 112,18 85,18 Z" fill="white"/>
            <path d="M85,30 C63,30 45,48 45,70 C45,94 85,150 85,150 C85,150 125,94 125,70 C125,48 107,30 85,30 Z" fill="#C0170F"/>
            <path d="M85,44 C70,44 57,57 57,70 C57,86 85,128 85,128 C85,128 113,86 113,70 C113,57 100,44 85,44 Z" fill="white"/>
            <ellipse cx="85" cy="68" rx="22" ry="22" fill="#F5C400"/>
            <ellipse cx="85" cy="68" rx="11" ry="11" fill="white"/>
          </svg>
          <div>
            <span style={{ fontWeight: 800, fontSize: '20px', color: '#1a1a1a' }}>Food</span>
            <span style={{ fontWeight: 800, fontSize: '20px', color: '#F47C20' }}>Force</span>
            <div style={{ fontSize: '9px', color: '#888', letterSpacing: '2px', textTransform: 'uppercase' }}>Maroc</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="/inscription-etablissement" style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>Recruter</a>
          <a href="/comment-ca-marche" style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>Comment ça marche</a>
          <a href="/login" style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>Connexion</a>
          <a href="/inscription-extra" style={{ background: '#F47C20', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Commencer</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #FDF0E8 0%, #fff8f3 50%, #fff 100%)', minHeight: '92vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,124,32,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', width: '100%' }}>

          {/* GAUCHE */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FDF0E8', border: '1px solid rgba(244,124,32,0.3)', color: '#F47C20', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, marginBottom: '32px', letterSpacing: '1px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F47C20', display: 'inline-block' }} />
              PLATEFORME N°1 AU MAROC
            </div>
            <h1 style={{ fontSize: '52px', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.15, marginBottom: '24px' }}>
              Les meilleurs extras<br />
              <span style={{ color: '#F47C20' }}>CHR</span> à portée<br />
              de main
            </h1>
            <p style={{ fontSize: '17px', color: '#666', lineHeight: 1.7, marginBottom: '40px', maxWidth: '440px' }}>
              FoodForce connecte les professionnels de l'hôtellerie-restauration avec les établissements qui ont besoin d'eux — rapidement, simplement, au Maroc.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <a href="/inscription-extra" style={{ background: '#F47C20', color: 'white', padding: '16px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
                Je cherche des missions →
              </a>
              <a href="/inscription-etablissement" style={{ background: 'white', color: '#1a1a1a', padding: '16px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '15px', border: '2px solid #e0e0e0' }}>
                Je recrute
              </a>
            </div>
          </div>

          {/* DROITE — MISSIONS */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ color: '#1a1a1a', fontWeight: 700, fontSize: '16px' }}>
                🟢 Missions disponibles
                <span style={{ background: '#F47C20', color: 'white', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: 700, marginLeft: '8px' }}>{missions.length}</span>
              </div>
              <a href="/inscription-extra" style={{ color: '#F47C20', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Voir tout →</a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {missions.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#888', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  Aucune mission disponible pour le moment
                </div>
              ) : (
                missions.map(m => (
                  <div key={m.id} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1.5px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ color: '#1a1a1a', fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>{m.titre}</div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span style={{ background: '#f5f5f5', color: '#666', padding: '3px 8px', borderRadius: '20px', fontSize: '11px' }}>
                            {m.etablissements?.type || 'Établissement'}
                          </span>
                          <span style={{ background: '#f5f5f5', color: '#666', padding: '3px 8px', borderRadius: '20px', fontSize: '11px' }}>
                            📍 {getQuartier(m.etablissements?.adresse) || m.etablissements?.ville || 'Casablanca'}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#F47C20', fontWeight: 800, fontSize: '18px' }}>{tauxNet(m.taux_horaire)} MAD/h</div>
                        <div style={{ color: '#888', fontSize: '11px' }}>gain net</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', fontSize: '12px', color: '#888' }}>
                      <span>📅 {new Date(m.date_mission).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                      <span>⏰ {m.heure_debut} - {m.heure_fin}</span>
                      <span>👥 {m.nombre_extras} poste(s)</span>
                    </div>
                    <a href="/inscription-extra" style={{ display: 'block', background: '#F47C20', color: 'white', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '13px', textAlign: 'center' }}>
                      🚀 Postuler
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section style={{ background: '#f9f9f9', padding: '100px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#FDF0E8', color: '#F47C20', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, marginBottom: '16px', letterSpacing: '1px' }}>
          SIMPLE & RAPIDE
        </div>
        <h2 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '8px', color: '#1a1a1a' }}>Comment ça marche ?</h2>
        <p style={{ color: '#888', marginBottom: '60px', fontSize: '16px' }}>3 étapes pour trouver votre mission</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', maxWidth: '1000px', margin: '0 auto' }}>
          {[
            { step: '01', title: 'Créez votre profil', desc: 'Inscrivez-vous gratuitement, uploadez vos documents et complétez votre profil en quelques minutes.', icon: '👤' },
            { step: '02', title: 'Trouvez une mission', desc: 'Parcourez les missions disponibles et postulez en un clic. Soyez notifié en temps réel.', icon: '🔍' },
            { step: '03', title: 'Travaillez & soyez payé', desc: 'Réalisez votre mission et recevez votre paiement directement. Simple et transparent.', icon: '💰' },
          ].map((item) => (
            <div key={item.step} style={{ background: 'white', borderRadius: '20px', padding: '40px 32px', width: '280px', boxShadow: '0 4px 30px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: '#FDF0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 20px' }}>{item.icon}</div>
              <div style={{ color: '#F47C20', fontWeight: 800, fontSize: '13px', letterSpacing: '2px', marginBottom: '12px' }}>{item.step}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#1a1a1a' }}>{item.title}</h3>
              <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTEURS */}
      <section style={{ padding: '100px 60px', background: 'white', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#FDF0E8', color: '#F47C20', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, marginBottom: '16px', letterSpacing: '1px' }}>
          NOS MÉTIERS
        </div>
        <h2 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '8px', color: '#1a1a1a' }}>Tous les métiers du CHR</h2>
        <p style={{ color: '#888', marginBottom: '60px', fontSize: '16px' }}>Des extras qualifiés dans tous les secteurs</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { icon: '🍽️', label: 'Salle & Service', count: '24 postes' },
            { icon: '👨‍🍳', label: 'Cuisine', count: '21 postes' },
            { icon: '🏨', label: 'Hôtellerie', count: '13 postes' },
            { icon: '🎉', label: 'Événementiel', count: 'Toutes catégories' },
            { icon: '🍹', label: 'Bar & Boissons', count: 'Barman, Barista...' },
            { icon: '🧹', label: 'Entretien', count: 'Ménage, Plongeur...' },
          ].map((sector) => (
            <div key={sector.label} style={{ background: 'white', border: '2px solid #f0f0f0', borderRadius: '16px', padding: '28px 24px', width: '220px', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#F47C20'; (e.currentTarget as HTMLDivElement).style.background = '#FDF0E8'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#f0f0f0'; (e.currentTarget as HTMLDivElement).style.background = 'white'; }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{sector.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a1a', marginBottom: '6px' }}>{sector.label}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{sector.count}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA DOUBLE */}
      <section style={{ background: '#f9f9f9', padding: '100px 60px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: '#F47C20', borderRadius: '24px', padding: '48px', color: 'white' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>👤</div>
            <h3 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '12px' }}>Vous êtes un extra ?</h3>
            <p style={{ fontSize: '15px', opacity: 0.85, lineHeight: 1.6, marginBottom: '32px' }}>
              Inscrivez-vous gratuitement, complétez votre dossier et accédez aux meilleures missions de restauration au Maroc.
            </p>
            <a href="/inscription-extra" style={{ background: 'white', color: '#F47C20', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', display: 'inline-block' }}>
              S'inscrire gratuitement →
            </a>
          </div>
          <div style={{ background: '#1a1a1a', borderRadius: '24px', padding: '48px', color: 'white' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏨</div>
            <h3 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '12px' }}>Vous recrutez ?</h3>
            <p style={{ fontSize: '15px', color: '#999', lineHeight: 1.6, marginBottom: '32px' }}>
              Trouvez les extras dont vous avez besoin en quelques minutes. Profils vérifiés, disponibilité en temps réel.
            </p>
            <a href="/inscription-etablissement" style={{ background: '#F47C20', color: 'white', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', display: 'inline-block' }}>
              Recruter maintenant →
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#1a1a1a', color: 'white', padding: '60px', borderTop: '1px solid #2a2a2a' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontWeight: 800, fontSize: '18px' }}>Food</span>
              <span style={{ fontWeight: 800, fontSize: '18px', color: '#F47C20' }}>Force</span>
            </div>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.7, maxWidth: '280px' }}>
              La plateforme qui connecte les extras avec les meilleurs établissements du Maroc.
            </p>
            <p style={{ color: '#444', fontSize: '13px', marginTop: '24px' }}>contact@foodforce.ma</p>
            <p style={{ color: '#444', fontSize: '13px' }}>+212 669 507 753</p>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '16px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>Extras</div>
            {[
              { label: "S'inscrire", href: '/inscription-extra' },
              { label: 'Voir les missions', href: '/missions' },
              { label: 'Comment ça marche', href: '/comment-ca-marche' },
              { label: 'Mon profil', href: '/profil' },
            ].map(l => (
              <div key={l.label} style={{ marginBottom: '10px' }}>
                <a href={l.href} style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>{l.label}</a>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '16px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>Établissements</div>
            {[
              { label: 'Recruter', href: '/inscription-etablissement' },
              { label: 'Poster une mission', href: '/espace-etablissement' },
              { label: 'Comment ça marche', href: '/comment-ca-marche' },
              { label: 'Contact', href: 'mailto:contact@foodforce.ma' },
            ].map(l => (
              <div key={l.label} style={{ marginBottom: '10px' }}>
                <a href={l.href} style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>{l.label}</a>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '16px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>Légal</div>
            {[
              { label: 'CGU', href: '/cgu' },
              { label: 'Mentions légales', href: '/mentions-legales' },
              { label: 'Confidentialité', href: '/politique-confidentialite' },
              { label: 'Cookies', href: '/politique-cookies' },
            ].map(l => (
              <div key={l.label} style={{ marginBottom: '10px' }}>
                <a href={l.href} style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>{l.label}</a>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid #2a2a2a', marginTop: '48px', paddingTop: '24px', textAlign: 'center', color: '#444', fontSize: '13px' }}>
          © 2026 FoodForce.ma — Casablanca, Maroc · Tous droits réservés
        </div>
      </footer>

    </main>
  );
}