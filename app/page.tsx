'use client';

export default function Home() {
  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#FDF0E8', minHeight: '100vh' }}>
      {/* NAVBAR */}
      <nav style={{ background: '#fff', padding: '20px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="32" fill="#F47C20"/>
            <path d="M24 20h16v4h-12v8h10v4h-10v12h-4V20z" fill="white"/>
          </svg>
          <div>
            <span style={{ fontWeight: 800, fontSize: '24px', color: '#1a1a1a' }}>Food</span>
            <span style={{ fontWeight: 800, fontSize: '24px', color: '#F47C20' }}>Force</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="/inscription-etablissement" style={{ textDecoration: 'none', color: '#666', fontWeight: 600, fontSize: '15px' }}>Recruter</a>
          <a href="#comment" style={{ textDecoration: 'none', color: '#666', fontWeight: 600, fontSize: '15px' }}>Comment ça marche</a>
          <a href="/login" style={{ textDecoration: 'none', color: '#666', fontWeight: 600, fontSize: '15px' }}>Connexion</a>
          <a href="/inscription-extra" style={{ background: '#F47C20', color: '#fff', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
            Commencer
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
        <div>
          <div style={{ background: 'rgba(244, 124, 32, 0.1)', border: '1px solid rgba(244, 124, 32, 0.3)', padding: '8px 16px', borderRadius: '20px', display: 'inline-block', marginBottom: '24px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#F47C20', letterSpacing: '1px' }}>🏆 PLATEFORME N°1 AU MAROC</span>
          </div>
          <h1 style={{ fontSize: '56px', fontWeight: 900, margin: '0 0 24px 0', color: '#1a1a1a', lineHeight: '1.1' }}>
            Les meilleurs extras <span style={{ color: '#F47C20' }}>CHR</span> à portée de main
          </h1>
          <p style={{ fontSize: '18px', color: '#666', margin: '0 0 40px 0', lineHeight: '1.6' }}>
            FoodForce connecte les professionnels de l&apos;hôtellerie-restauration avec les établissements qui ont besoin d&apos;eux — rapidement, simplement, au Maroc.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="/inscription-extra" style={{ background: '#F47C20', color: '#fff', padding: '16px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '16px' }}>
              Je cherche des missions →
            </a>
            <a href="/inscription-etablissement" style={{ background: '#fff', color: '#1a1a1a', border: '2px solid #1a1a1a', padding: '16px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '16px' }}>
              Je recrute
            </a>
          </div>
        </div>

        <div>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontWeight: 700, fontSize: '16px' }}>Missions disponibles</span>
              <span style={{ background: '#F47C20', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>3</span>
            </div>
            
            {[
              { title: 'Chef de Rang', type: 'restaurant', location: 'Casablanca', date: '20 avr', hours: '05:10 - 15:07', people: '1 poste(s)', price: '26 MAD/h' },
              { title: 'Barman', type: 'restaurant', location: 'Casablanca', date: '14 avr', hours: '10:00 - 18:00', people: '1 poste(s)', price: '21 MAD/h' },
              { title: 'Chef de Rang', type: 'restaurant', location: 'Casablanca', date: '22 avr', hours: '22:27 - 10:27', people: '1 poste(s)', price: '26 MAD/h' }
            ].map((mission, i) => (
              <div key={i} style={{ background: '#fafafa', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{mission.title}</div>
                    <div style={{ fontSize: '13px', color: '#666' }}>{mission.type} • {mission.location}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#F47C20' }}>{mission.price}</div>
                    <div style={{ fontSize: '11px', color: '#999' }}>gain net</div>
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>
                  📅 {mission.date} • ⏰ {mission.hours} • 👥 {mission.people}
                </div>
                <button style={{ width: '100%', background: '#F47C20', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                  ⚡ Postuler
                </button>
              </div>
            ))}
            
            <a href="/inscription-extra" style={{ display: 'block', textAlign: 'center', color: '#F47C20', fontWeight: 600, fontSize: '14px', marginTop: '16px', textDecoration: 'none' }}>
              Voir tout →
            </a>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section id="comment" style={{ background: '#fff', padding: '80px 60px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#F47C20', letterSpacing: '2px', marginBottom: '16px' }}>SIMPLE & RAPIDE</div>
            <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Comment ça marche ?</h2>
            <p style={{ fontSize: '16px', color: '#666', marginTop: '8px' }}>3 étapes pour trouver votre mission</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { num: '01', icon: '👤', title: 'Créez votre profil', desc: 'Inscrivez-vous gratuitement, uploadez vos documents et complétez votre profil.' },
              { num: '02', icon: '🔍', title: 'Trouvez une mission', desc: 'Parcourez les missions disponibles et postulez en un clic.' },
              { num: '03', icon: '💰', title: 'Travaillez & soyez payé', desc: 'Réalisez votre mission et recevez votre paiement directement.' }
            ].map((step, i) => (
              <div key={i} style={{ background: '#fafafa', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{step.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#F47C20', marginBottom: '12px' }}>{step.num}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#1a1a1a' }}>{step.title}</h3>
                <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MÉTIERS */}
      <section style={{ padding: '80px 60px', background: '#FDF0E8' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#F47C20', letterSpacing: '2px', marginBottom: '16px' }}>NOS MÉTIERS</div>
            <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Tous les métiers du CHR</h2>
            <p style={{ fontSize: '16px', color: '#666', marginTop: '8px' }}>Des extras qualifiés dans tous les secteurs</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { icon: '🍽️', title: 'Salle & Service', subtitle: '24 postes' },
              { icon: '👨‍🍳', title: 'Cuisine', subtitle: '21 postes' },
              { icon: '🏨', title: 'Hôtellerie', subtitle: '15 postes' },
              { icon: '🎉', title: 'Événementiel', subtitle: 'Toutes catégories' },
              { icon: '🍹', title: 'Bar & Boissons', subtitle: 'Barman, Barista...' },
              { icon: '🧹', title: 'Entretien', subtitle: 'Ménage, Plongeur...' }
            ].map((metier, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '24px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{metier.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{metier.title}</div>
                <div style={{ fontSize: '14px', color: '#999' }}>{metier.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA DUAL */}
      <section style={{ padding: '80px 60px', background: '#fff' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div style={{ background: '#F47C20', borderRadius: '20px', padding: '48px', color: '#fff' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👤</div>
            <h3 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Vous êtes un extra ?</h3>
            <p style={{ fontSize: '16px', marginBottom: '32px', opacity: 0.95 }}>
              Inscrivez-vous gratuitement et accédez aux meilleures missions de restauration au Maroc.
            </p>
            <a href="/inscription-extra" style={{ display: 'inline-block', background: '#fff', color: '#F47C20', padding: '16px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '16px' }}>
              S&apos;inscrire gratuitement →
            </a>
          </div>

          <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '48px', color: '#fff' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏢</div>
            <h3 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Vous recrutez ?</h3>
            <p style={{ fontSize: '16px', marginBottom: '32px', opacity: 0.95 }}>
              Trouvez les extras dont vous avez besoin en quelques minutes. Profils vérifiés.
            </p>
            <a href="/inscription-etablissement" style={{ display: 'inline-block', background: '#F47C20', color: '#fff', padding: '16px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '16px' }}>
              Recruter maintenant →
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#1a1a1a', color: '#fff', padding: '60px 60px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
            <div>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontWeight: 800, fontSize: '20px' }}>Food</span>
                <span style={{ fontWeight: 800, fontSize: '20px', color: '#F47C20' }}> Force</span>
              </div>
              <p style={{ fontSize: '14px', color: '#999', marginBottom: '16px', lineHeight: '1.6' }}>
                La plateforme qui connecte les extras avec les meilleurs établissements du Maroc.
              </p>
              <div style={{ fontSize: '14px', color: '#999' }}>
                <div>contact@foodforce.ma</div>
                <div>+212 689 507 753</div>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: '16px' }}>EXTRAS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="/inscription-extra" style={{ color: '#999', textDecoration: 'none', fontSize: '14px' }}>S&apos;inscrire</a>
                <a href="#" style={{ color: '#999', textDecoration: 'none', fontSize: '14px' }}>Voir les missions</a>
                <a href="#comment" style={{ color: '#999', textDecoration: 'none', fontSize: '14px' }}>Comment ça marche</a>
                <a href="/login" style={{ color: '#999', textDecoration: 'none', fontSize: '14px' }}>Mon profil</a>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: '16px' }}>ÉTABLISSEMENTS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="/inscription-etablissement" style={{ color: '#999', textDecoration: 'none', fontSize: '14px' }}>Recruter</a>
                <a href="/inscription-etablissement" style={{ color: '#999', textDecoration: 'none', fontSize: '14px' }}>Poster une mission</a>
                <a href="/login" style={{ color: '#999', textDecoration: 'none', fontSize: '14px' }}>Contact</a>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: '16px' }}>LÉGAL</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="#" style={{ color: '#999', textDecoration: 'none', fontSize: '14px' }}>CGU</a>
                <a href="#" style={{ color: '#999', textDecoration: 'none', fontSize: '14px' }}>Mentions légales</a>
                <a href="#" style={{ color: '#999', textDecoration: 'none', fontSize: '14px' }}>Confidentialité</a>
                <a href="#" style={{ color: '#999', textDecoration: 'none', fontSize: '14px' }}>Cookies</a>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #333', paddingTop: '32px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
            © 2026 FoodForce - Tous droits réservés
          </div>
        </div>
      </footer>
    </main>
  );
}