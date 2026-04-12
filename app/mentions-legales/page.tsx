export default function MentionsLegales() {
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

          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a1a', marginBottom: '8px' }}>Mentions Légales</h1>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '40px' }}>FoodForce.ma</p>

          {[
            {
              title: "1. Éditeur du site",
              items: [
                { label: "Nom commercial", desc: "FoodForce.ma" },
                { label: "Statut juridique", desc: "Auto-entrepreneur" },
                { label: "Adresse", desc: "Casablanca, Maroc" },
                { label: "NIF", desc: "[À compléter après création du statut]" },
                { label: "Registre du Commerce", desc: "[À compléter après création du statut]" },
                { label: "Responsable de la publication", desc: "Aïssam Messaoudi" },
                { label: "Email", desc: "contact@foodforce.ma" },
                { label: "Téléphone", desc: "+212 669 507 753" },
              ]
            },
            {
              title: "2. Hébergeur du site",
              items: [
                { label: "Hébergeur", desc: "[À compléter — demander au développeur]" },
                { label: "Adresse", desc: "[À compléter]" },
                { label: "Téléphone", desc: "[À compléter]" },
              ]
            },
            {
              title: "3. Description du service",
              content: "Le site FoodForce.ma a pour objectif de faciliter la mise en relation entre des professionnels indépendants et les établissements du secteur hôtelier et de la restauration à Casablanca, Maroc. FoodForce.ma permet aux utilisateurs (Extras et Établissements) d'interagir pour des missions ponctuelles de prestation de services indépendants. FoodForce.ma ne propose pas de contrats de travail salariés (CDI, CDD) ni de travail temporaire (intérim)."
            },
            {
              title: "4. Collecte et traitement des données personnelles",
              content: "Le site FoodForce.ma collecte et traite des données personnelles afin de fournir ses services (nom, email, téléphone, adresse IP, CIN, RIB, numéro ICE). Ces données sont collectées dans le respect de la loi marocaine n° 09-08 et ne seront jamais partagées avec des tiers sans consentement préalable, sauf obligation légale.",
              footer: "Pour exercer vos droits d'accès, rectification ou suppression : contact@foodforce.ma"
            },
            {
              title: "5. Droits d'accès et durée",
              content: "L'accès à certaines fonctionnalités nécessite la création d'un compte utilisateur. L'utilisateur s'engage à fournir des informations exactes et à jour. Les utilisateurs peuvent mettre fin à leur relation avec la plateforme à tout moment en supprimant leur compte ou en contactant contact@foodforce.ma."
            },
            {
              title: "6. Sécurité des données personnelles",
              list: [
                "Cryptage des données : Les informations sensibles sont protégées par cryptage",
                "Sécurisation des échanges : Les données sont protégées par protocole SSL",
                "Accès limité : Seules les personnes autorisées ont accès aux données",
                "Sauvegarde régulière : Des sauvegardes sont effectuées pour éviter toute perte accidentelle",
              ]
            },
            {
              title: "7. Cookies",
              content: "Le site utilise des cookies pour améliorer l'expérience utilisateur et analyser les comportements de navigation. L'utilisateur peut refuser l'utilisation des cookies via les paramètres de son navigateur. Toutefois, cette désactivation pourrait affecter certaines fonctionnalités du site."
            },
            {
              title: "8. Propriété intellectuelle",
              content: "Tous les éléments du site FoodForce.ma (textes, images, logos, graphismes, icônes) sont protégés par des droits d'auteur et restent la propriété exclusive de Aïssam Messaoudi / FoodForce.ma. L'utilisateur s'engage à ne pas reproduire, distribuer ou exploiter de manière commerciale tout ou partie du contenu du site sans autorisation préalable et écrite."
            },
            {
              title: "9. Modifications des mentions légales",
              content: "FoodForce.ma se réserve le droit de modifier à tout moment les présentes mentions légales. Toute modification sera publiée sur cette page avec la date de mise à jour. Il est recommandé aux utilisateurs de consulter régulièrement cette page."
            },
            {
              title: "10. Règlement des litiges",
              content: "Les présentes mentions légales sont régies par la législation marocaine. En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute procédure judiciaire. À défaut d'accord amiable, tout litige sera soumis à la compétence exclusive des tribunaux compétents du Royaume du Maroc."
            },
            {
              title: "11. Limitation de responsabilité",
              content: "FoodForce.ma agit uniquement en tant qu'intermédiaire entre les Extras et les Établissements. FoodForce.ma ne peut être tenu responsable des interactions, transactions ou accords conclus entre les utilisateurs, ni de tout dommage direct ou indirect découlant de l'utilisation du site. Les utilisateurs sont responsables de leurs actes et engagements vis-à-vis des autres parties."
            },
          ].map((section: any, i) => (
            <div key={i} style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid #FDF0E8' }}>
                {section.title}
              </h2>
              {section.content && <p style={{ color: '#555', fontSize: '15px', lineHeight: 1.8, marginBottom: '12px' }}>{section.content}</p>}
              {section.items && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                  {section.items.map((item: any, j: number) => (
                    <div key={j} style={{ background: '#f9f9f9', borderRadius: '10px', padding: '14px', borderLeft: '3px solid #F47C20' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a1a' }}>{item.label} : </span>
                      <span style={{ color: '#666', fontSize: '14px' }}>{item.desc}</span>
                    </div>
                  ))}
                </div>
              )}
              {section.list && section.list.map((item: string, j: number) => (
                <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ color: '#F47C20', marginTop: '2px', fontSize: '16px' }}>·</span>
                  <span style={{ color: '#555', fontSize: '14px', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
              {section.footer && <p style={{ color: '#888', fontSize: '13px', marginTop: '12px', fontStyle: 'italic' }}>{section.footer}</p>}
            </div>
          ))}

          <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '20px', textAlign: 'center', marginTop: '20px' }}>
            <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
              © 2026 FoodForce.ma — Aïssam Messaoudi — Tous droits réservés<br />
              contact@foodforce.ma · +212 669 507 753 · Casablanca, Maroc
            </p>
          </div>
        </div>
      </div>

      <footer style={{ background: '#1a1a1a', color: 'white', padding: '30px 60px', textAlign: 'center' }}>
        <p style={{ color: '#444', fontSize: '13px' }}>© 2026 FoodForce.ma — Casablanca, Maroc</p>
      </footer>
    </main>
  );
}