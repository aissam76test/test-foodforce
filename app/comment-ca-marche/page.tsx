'use client';
import { useState } from 'react';

export default function CommentCaMarche() {
  const [onglet, setOnglet] = useState<'extra' | 'etablissement'>('extra');

  return (
    <main style={{ fontFamily: "'Poppins', sans-serif", background: '#f9f9f9', minHeight: '100vh' }}>

      {/* NAVBAR */}
      <nav style={{ background: 'white', padding: '16px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#1a1a1a' }}>Food</span>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#F47C20' }}>Force</span>
        </a>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="/login" style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>Connexion</a>
          <a href="/inscription-extra" style={{ background: '#F47C20', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Commencer</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #FDF0E8 0%, #fff 100%)', padding: '80px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#FDF0E8', color: '#F47C20', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, marginBottom: '20px', letterSpacing: '1px', border: '1px solid rgba(244,124,32,0.3)' }}>
          SIMPLE & RAPIDE
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: 800, color: '#1a1a1a', marginBottom: '16px' }}>
          Comment ça marche ?
        </h1>
        <p style={{ fontSize: '18px', color: '#666', maxWidth: '500px', margin: '0 auto 40px', lineHeight: 1.6 }}>
          FoodForce met en relation les extras et les établissements en quelques clics.
        </p>

        {/* SWITCH ONGLETS */}
        <div style={{ display: 'inline-flex', background: 'white', borderRadius: '12px', padding: '6px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <button onClick={() => setOnglet('extra')}
            style={{ padding: '12px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px', background: onglet === 'extra' ? '#F47C20' : 'transparent', color: onglet === 'extra' ? 'white' : '#888', transition: 'all 0.2s' }}>
            👤 Je suis un Extra
          </button>
          <button onClick={() => setOnglet('etablissement')}
            style={{ padding: '12px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px', background: onglet === 'etablissement' ? '#F47C20' : 'transparent', color: onglet === 'etablissement' ? 'white' : '#888', transition: 'all 0.2s' }}>
            🏨 Je suis un Établissement
          </button>
        </div>
      </section>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px 100px' }}>

        {/* ── EXTRA ── */}
        {onglet === 'extra' && (
          <div>
            {/* ÉTAPES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                {
                  num: '01',
                  icon: '📝',
                  title: "Créez votre compte gratuitement",
                  desc: "Inscrivez-vous sur FoodForce en quelques minutes. L'inscription est 100% gratuite pour les extras.",
                  details: ["Renseignez vos informations personnelles", "Choisissez vos postes et compétences", "Indiquez vos disponibilités"]
                },
                {
                  num: '02',
                  icon: '📄',
                  title: "Complétez votre dossier",
                  desc: "Pour accéder aux missions, vous devez fournir les documents requis. Votre dossier est vérifié sous 48h.",
                  details: ["CIN recto/verso", "Carte Auto-Entrepreneur (ICE)", "RIB bancaire", "Photo de profil"]
                },
                {
                  num: '03',
                  icon: '✅',
                  title: "Validation de votre profil",
                  desc: "Notre équipe vérifie votre dossier. Une fois validé, vous recevez un email de confirmation et accédez à toutes les missions.",
                  details: ["Vérification sous 48h ouvrées", "Email de confirmation envoyé", "Accès immédiat aux missions"]
                },
                {
                  num: '04',
                  icon: '🔍',
                  title: "Parcourez les missions",
                  desc: "Consultez toutes les missions disponibles à Casablanca et dans les villes marocaines. Filtrez par secteur, date et taux horaire.",
                  details: ["Missions en temps réel", "Taux horaire affiché (votre gain net)", "Localisation anonymisée"]
                },
                {
                  num: '05',
                  icon: '🚀',
                  title: "Postulez en un clic",
                  desc: "Candidatez aux missions qui vous correspondent. L'établissement reçoit votre profil et vous répond rapidement.",
                  details: ["Candidature instantanée", "Notification de réponse", "Suivi de vos candidatures"]
                },
                {
                  num: '06',
                  icon: '💰',
                  title: "Réalisez la mission & soyez payé",
                  desc: "Une fois la mission terminée, remplissez votre relevé d'heures. FoodForce collecte le paiement et vous le reverse.",
                  details: ["Relevé d'heures validé par l'établissement", "Paiement sécurisé via FoodForce", "Délai de paiement rapide"]
                },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '24px', marginBottom: '0' }}>
                  {/* LIGNE VERTICALE */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#F47C20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '14px', flexShrink: 0 }}>
                      {step.num}
                    </div>
                    {i < 5 && <div style={{ width: '2px', flex: 1, background: '#FDF0E8', minHeight: '40px' }} />}
                  </div>

                  {/* CONTENU */}
                  <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', flex: 1, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '28px' }}>{step.icon}</span>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>{step.title}</h3>
                    </div>
                    <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.7, marginBottom: '14px' }}>{step.desc}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {step.details.map((d, j) => (
                        <span key={j} style={{ background: '#FDF0E8', color: '#F47C20', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>✓ {d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CONDITIONS */}
            <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '32px', marginTop: '20px', color: 'white' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>📋 Conditions pour s'inscrire</h3>
              {[
                "Être majeur (+18 ans)",
                "Être marocain ou étranger résidant légalement au Maroc",
                "Posséder le statut d'auto-entrepreneur marocain (loi 114-13) — obligatoire",
                "Avoir un numéro ICE valide",
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#F47C20', fontWeight: 700 }}>·</span>
                  <span style={{ color: '#ccc', fontSize: '14px' }}>{c}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <a href="/inscription-extra" style={{ background: '#F47C20', color: 'white', padding: '18px 48px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '16px', display: 'inline-block' }}>
                S'inscrire gratuitement →
              </a>
            </div>
          </div>
        )}

        {/* ── ÉTABLISSEMENT ── */}
        {onglet === 'etablissement' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                {
                  num: '01',
                  icon: '📝',
                  title: "Créez votre compte recruteur",
                  desc: "Inscrivez-vous sur FoodForce en tant qu'établissement. Fournissez les informations de votre structure.",
                  details: ["Nom et type d'établissement", "Coordonnées du responsable", "Adresse et ville"]
                },
                {
                  num: '02',
                  icon: '📄',
                  title: "Soumettez votre dossier",
                  desc: "Pour valider votre compte et commencer à poster des missions, fournissez les documents de votre établissement.",
                  details: ["Registre de commerce (KBIS)", "Patente", "CIN du gérant", "RIB professionnel"]
                },
                {
                  num: '03',
                  icon: '✅',
                  title: "Validation sous 48h",
                  desc: "Notre équipe vérifie votre dossier. Une fois validé, vous pouvez immédiatement poster des missions.",
                  details: ["Vérification sous 48h ouvrées", "Email de confirmation", "Accès au tableau de bord"]
                },
                {
                  num: '04',
                  icon: '📋',
                  title: "Postez une mission",
                  desc: "Créez votre annonce en choisissant le poste, la date, les horaires. Le taux horaire est fixé automatiquement par FoodForce selon la grille tarifaire.",
                  details: ["Grille tarifaire fixe par poste", "Calcul automatique du coût total", "Mission publiée instantanément"]
                },
                {
                  num: '05',
                  icon: '👥',
                  title: "Recevez des candidatures",
                  desc: "Les extras validés par FoodForce postulent à votre mission. Consultez leurs profils et choisissez celui qui vous convient.",
                  details: ["Profils vérifiés par FoodForce", "Photo, compétences, expériences", "Acceptez ou refusez en un clic"]
                },
                {
                  num: '06',
                  icon: '💳',
                  title: "Mission réalisée & facturation",
                  desc: "À l'issue de la mission, validez le relevé d'heures de l'extra. FoodForce génère la facture et gère le paiement.",
                  details: ["Validation sous 72h", "Facture automatique générée", "Commission FoodForce : 25%"]
                },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '14px', flexShrink: 0 }}>
                      {step.num}
                    </div>
                    {i < 5 && <div style={{ width: '2px', flex: 1, background: '#f0f0f0', minHeight: '40px' }} />}
                  </div>
                  <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', flex: 1, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '28px' }}>{step.icon}</span>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>{step.title}</h3>
                    </div>
                    <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.7, marginBottom: '14px' }}>{step.desc}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {step.details.map((d, j) => (
                        <span key={j} style={{ background: '#f5f5f5', color: '#1a1a1a', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>✓ {d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TARIFICATION */}
            <div style={{ background: '#F47C20', borderRadius: '20px', padding: '32px', marginTop: '20px', color: 'white' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>💰 Tarification transparente</h3>
              <p style={{ opacity: 0.85, fontSize: '14px', marginBottom: '20px' }}>FoodForce applique une commission de 25% sur chaque mission, à la charge exclusive de l'établissement.</p>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '14px', marginBottom: '8px' }}>Exemple : Serveur pour 6h</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', opacity: 0.8 }}>Taux horaire (commission incluse)</span>
                  <span style={{ fontWeight: 700 }}>24.54 MAD/h</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '13px', opacity: 0.8 }}>Total mission (6h)</span>
                  <span style={{ fontWeight: 800, fontSize: '20px' }}>147 MAD</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <a href="/inscription-etablissement" style={{ background: '#F47C20', color: 'white', padding: '18px 48px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '16px', display: 'inline-block' }}>
                Créer mon compte recruteur →
              </a>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#1a1a1a', color: 'white', padding: '30px 60px', textAlign: 'center' }}>
        <p style={{ color: '#444', fontSize: '13px' }}>© 2026 FoodForce.ma — Casablanca, Maroc</p>
      </footer>
    </main>
  );
}