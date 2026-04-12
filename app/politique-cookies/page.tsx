export default function PolitiqueCookies() {
  return (
    <main style={{ fontFamily: "'Poppins', sans-serif", background: '#f9f9f9', minHeight: '100vh' }}>
      
      {/* NAVBAR */}
      <nav style={{ background: 'white', padding: '16px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#1a1a1a' }}>Food</span>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#F47C20' }}>Force</span>
        </a>
      </nav>

      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 20px 80px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '48px', boxShadow: '0 4px 30px rgba(0,0,0,0.06)' }}>
          
          <div style={{ display: 'inline-block', background: '#FDF0E8', color: '#F47C20', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, marginBottom: '24px' }}>
            Dernière mise à jour : Avril 2026
          </div>
          
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a1a', marginBottom: '8px' }}>Politique de Cookies</h1>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '40px' }}>FoodForce.ma</p>

          {[
            {
              title: "Qu'est-ce qu'un cookie ?",
              content: "Un cookie est un petit fichier texte déposé sur votre appareil lors de votre visite sur foodforce.ma. Il permet d'améliorer votre expérience de navigation et d'analyser l'utilisation du site."
            },
            {
              title: "Cookies utilisés sur FoodForce.ma",
              items: [
                { label: "Cookies essentiels", desc: "Nécessaires au fonctionnement du site (connexion, session). Ils ne peuvent pas être désactivés." },
                { label: "Cookies analytiques", desc: "Nous permettent de comprendre comment vous utilisez le site (pages visitées, durée). Nécessitent votre consentement." },
                { label: "Cookies de préférences", desc: "Mémorisent vos choix (langue, paramètres). Nécessitent votre consentement." },
              ]
            },
            {
              title: "Votre consentement",
              content: "Conformément à la loi marocaine n° 09-08, nous vous demandons votre accord avant de déposer des cookies non essentiels sur votre appareil. Vous pouvez accepter ou refuser via la bannière cookies affichée lors de votre première visite."
            },
            {
              title: "Gérer vos cookies",
              content: "Vous pouvez modifier vos préférences à tout moment via les paramètres de votre navigateur. La désactivation de certains cookies peut affecter le fonctionnement du site."
            },
            {
              title: "Contact",
              content: "Pour toute question : contact@foodforce.ma"
            },
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid #FDF0E8' }}>
                {section.title}
              </h2>
              {section.content && (
                <p style={{ color: '#555', fontSize: '15px', lineHeight: 1.8 }}>{section.content}</p>
              )}
              {section.items && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {section.items.map((item: any, j: number) => (
                    <div key={j} style={{ background: '#f9f9f9', borderRadius: '12px', padding: '16px', borderLeft: '3px solid #F47C20' }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a1a', marginBottom: '4px' }}>{item.label}</div>
                      <div style={{ color: '#666', fontSize: '14px', lineHeight: 1.6 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#1a1a1a', color: 'white', padding: '30px 60px', textAlign: 'center' }}>
        <p style={{ color: '#444', fontSize: '13px' }}>© 2026 FoodForce.ma — Casablanca, Maroc</p>
      </footer>
    </main>
  );
}