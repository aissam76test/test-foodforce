export default function PolitiqueConfidentialite() {
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

          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a1a', marginBottom: '8px' }}>Politique de Confidentialité</h1>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '40px' }}>FoodForce.ma</p>

          {[
            {
              title: "1. Introduction",
              content: "FoodForce.ma accorde une importance primordiale à la protection de vos données personnelles. La présente politique explique comment nous collectons, utilisons, stockons et protégeons vos données conformément à la loi marocaine n° 09-08. En utilisant le site foodforce.ma, vous acceptez les pratiques décrites dans la présente politique."
            },
            {
              title: "2. Responsable du traitement",
              items: [
                { label: "Nom commercial", desc: "FoodForce.ma" },
                { label: "Email", desc: "contact@foodforce.ma" },
                { label: "Téléphone", desc: "+212 669 507 753" },
                { label: "Adresse", desc: "Casablanca, Maroc" },
              ]
            },
            {
              title: "3. Données collectées",
              content: "Selon votre profil, nous collectons les données suivantes :",
              groups: [
                {
                  label: "Pour les Extras",
                  items: ["Nom et prénom", "Adresse email et numéro de téléphone", "Adresse de domicile", "Photo d'identité", "Copie CIN recto/verso", "Numéro ICE (statut auto-entrepreneur)", "RIB (coordonnées bancaires)", "Disponibilités et compétences professionnelles"]
                },
                {
                  label: "Pour les Établissements",
                  items: ["Nom de l'établissement et coordonnées du responsable", "Registre de commerce", "Patente", "CIN du gérant", "RIB professionnel"]
                },
                {
                  label: "Données de navigation",
                  items: ["Adresse IP", "Cookies de navigation", "Pages visitées et durée des visites"]
                }
              ]
            },
            {
              title: "4. Finalités du traitement",
              list: ["Créer et gérer votre compte utilisateur", "Assurer la mise en relation entre Extras et Établissements", "Vérifier votre identité et valider votre dossier", "Gérer les missions et les paiements", "Vous envoyer des notifications liées aux missions disponibles", "Améliorer nos services et l'expérience utilisateur", "Respecter nos obligations légales et réglementaires marocaines"]
            },
            {
              title: "5. Base légale du traitement",
              list: ["Votre consentement lors de l'inscription", "L'exécution du contrat de mise en relation", "Le respect de nos obligations légales au Maroc"]
            },
            {
              title: "6. Durée de conservation",
              content: "Vos données personnelles sont conservées pendant 3 ans à compter de votre dernière utilisation des Services. Les documents d'identité et bancaires sont conservés le temps nécessaire à la réalisation des missions et au respect des obligations légales."
            },
            {
              title: "7. Partage des données",
              content: "Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées uniquement dans les cas suivants :",
              list: ["Avec les Établissements ou Extras dans le cadre strict de la mise en relation", "Avec nos prestataires techniques (hébergement, sécurité) sous contrat de confidentialité", "En cas d'obligation légale ou sur demande des autorités compétentes marocaines"]
            },
            {
              title: "8. Sécurité des données",
              list: ["Chiffrement SSL de toutes les communications", "Stockage sécurisé des documents sensibles avec accès restreint", "Compression et optimisation des fichiers uploadés (CIN, RIB, ICE)", "Accès aux données limité aux seules personnes habilitées", "Sauvegardes régulières pour prévenir toute perte accidentelle"]
            },
            {
              title: "9. Vos droits",
              content: "Conformément à la loi marocaine n° 09-08, vous disposez des droits suivants :",
              items: [
                { label: "Droit d'accès", desc: "Consulter vos données personnelles" },
                { label: "Droit de rectification", desc: "Corriger vos données inexactes" },
                { label: "Droit d'effacement", desc: "Demander la suppression de vos données" },
                { label: "Droit d'opposition", desc: "Vous opposer au traitement de vos données" },
                { label: "Droit à la portabilité", desc: "Recevoir vos données dans un format lisible" },
              ],
              footer: "Pour exercer ces droits : contact@foodforce.ma — Délai de réponse : 30 jours maximum."
            },
            {
              title: "10. Cookies",
              list: ["Maintenir votre session de connexion", "Mémoriser vos préférences", "Analyser l'utilisation du site (statistiques anonymes)"],
              footer: "Vous pouvez désactiver les cookies dans les paramètres de votre navigateur."
            },
            {
              title: "11. Modifications",
              content: "FoodForce.ma se réserve le droit de modifier la présente politique à tout moment. Toute modification sera publiée sur cette page avec la date de mise à jour. La poursuite de l'utilisation du site après modification vaut acceptation de la nouvelle politique."
            },
            {
              title: "12. Contact",
              items: [
                { label: "Email", desc: "contact@foodforce.ma" },
                { label: "Téléphone", desc: "+212 669 507 753" },
                { label: "Adresse", desc: "Casablanca, Maroc" },
              ]
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
              {section.groups && section.groups.map((group: any, k: number) => (
                <div key={k} style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#F47C20', marginBottom: '8px' }}>{group.label}</div>
                  {group.items.map((it: string, l: number) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ color: '#F47C20', marginTop: '2px' }}>·</span>
                      <span style={{ color: '#555', fontSize: '14px', lineHeight: 1.6 }}>{it}</span>
                    </div>
                  ))}
                </div>
              ))}
              {section.list && section.list.map((item: string, j: number) => (
                <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ color: '#F47C20', marginTop: '2px', fontSize: '16px' }}>·</span>
                  <span style={{ color: '#555', fontSize: '14px', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
              {section.footer && <p style={{ color: '#888', fontSize: '13px', marginTop: '12px', fontStyle: 'italic' }}>{section.footer}</p>}
            </div>
          ))}
        </div>
      </div>

      <footer style={{ background: '#1a1a1a', color: 'white', padding: '30px 60px', textAlign: 'center' }}>
        <p style={{ color: '#444', fontSize: '13px' }}>© 2026 FoodForce.ma — Casablanca, Maroc</p>
      </footer>
    </main>
  );
}