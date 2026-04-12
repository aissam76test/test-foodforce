export default function CGU() {
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

          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a1a', marginBottom: '8px' }}>Conditions Générales d'Utilisation</h1>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '32px' }}>FoodForce.ma</p>

          {/* SOMMAIRE */}
          <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '20px', marginBottom: '40px' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a1a', marginBottom: '12px' }}>Sommaire</div>
            {[
              "1. Conditions générales entre FoodForce.ma et les Établissements",
              "2. Conditions générales entre FoodForce.ma et les Extras",
              "3. Protection des données personnelles",
              "4. Dispositions finales",
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ color: '#F47C20' }}>→</span>
                <span style={{ color: '#555', fontSize: '14px' }}>{item}</span>
              </div>
            ))}
          </div>

          {/* SECTION 1 — ÉTABLISSEMENTS */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ background: '#F47C20', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'white', margin: 0 }}>
                1. Conditions générales entre FoodForce.ma et les Établissements
              </h2>
            </div>

            {[
              {
                title: "Qui sommes-nous ?",
                content: "Nous sommes FoodForce.ma, plateforme de mise en relation entre des professionnels indépendants de l'hôtellerie-restauration et des établissements du secteur, opérée depuis Casablanca, Maroc. Les présentes CGU définissent le cadre d'utilisation des services proposés sur foodforce.ma, conformément à la législation marocaine en vigueur.",
                footer: "Contact : contact@foodforce.ma | +212 669 507 753"
              },
              {
                title: "Quels services proposons-nous ?",
                content: "FoodForce.ma vous met en relation avec des prestataires de services indépendants pour des besoins en cuisine, bar, salle, hôtel ou événements pour une courte durée.",
                warning: "FoodForce.ma ne propose pas de mise en relation pour des contrats salariés (CDI, CDD) ni de travail temporaire (intérim). Notre activité est exclusivement limitée à la mise en relation pour des missions de prestation de services indépendants."
              },
              {
                title: "Les Extras sont des prestataires indépendants",
                content: "L'Extra n'est ni le salarié de FoodForce.ma, ni votre salarié. Il n'est soumis à aucun lien de subordination. FoodForce.ma est un tiers à la relation entre vous et l'Extra."
              },
              {
                title: "Conditions d'inscription",
                content: "Pour vous inscrire, vous devez fournir :",
                list: ["Nom de l'établissement et coordonnées du responsable", "Registre de commerce", "Patente", "CIN du gérant", "RIB professionnel"]
              },
              {
                title: "Publication d'une annonce",
                content: "Vous publiez une annonce en précisant le profil recherché, la durée, les horaires, le lieu et la description de la mission. Vous sélectionnez librement parmi les Extras ayant répondu et confirmez la mission."
              },
              {
                title: "Relevé d'activité",
                content: "À l'issue de chaque mission, l'Extra remplit un relevé d'heures. Vous disposez de 72 heures pour valider ou contester. Sans contestation dans ce délai, le relevé fait foi et la facturation est émise."
              },
              {
                title: "Annulation",
                list: ["Plus de 72h avant la mission : aucune incidence", "Moins de 72h avant la mission : frais d'annulation de 150 MAD HT, dont la moitié reversée à l'Extra"]
              },
              {
                title: "Tarification",
                content: "FoodForce.ma applique une commission de 25% sur le montant de la prestation, à la charge exclusive de l'Établissement."
              },
              {
                title: "Recrutement direct d'un Extra",
                list: ["Plus de 150h réalisées dans votre établissement via FoodForce.ma : aucun frais", "Moins de 150h : indemnité de 1 000 MAD HT", "Sans information préalable : pénalité de 5 000 MAD HT"]
              },
              {
                title: "Vos engagements",
                list: ["Respecter les lois et règlements marocains", "Vérifier l'identité de l'Extra à son arrivée", "Ne pas utiliser les données des Extras à d'autres fins que la réalisation des missions", "Garantir FoodForce.ma contre toute réclamation résultant du non-respect des présentes CGU"]
              },
            ].map((section: any, i) => (
              <div key={i} style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid #f0f0f0' }}>
                  {section.title}
                </h3>
                {section.warning && (
                  <div style={{ background: '#FDF0E8', border: '1px solid rgba(244,124,32,0.3)', borderRadius: '10px', padding: '14px', marginBottom: '10px', fontSize: '14px', color: '#F47C20', fontWeight: 600 }}>
                    ⚠️ {section.warning}
                  </div>
                )}
                {section.content && <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.8, marginBottom: '8px' }}>{section.content}</p>}
                {section.list && section.list.map((item: string, j: number) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ color: '#F47C20', marginTop: '2px' }}>·</span>
                    <span style={{ color: '#555', fontSize: '14px', lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
                {section.footer && <p style={{ color: '#888', fontSize: '13px', marginTop: '8px', fontStyle: 'italic' }}>{section.footer}</p>}
              </div>
            ))}
          </div>

          {/* SECTION 2 — EXTRAS */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'white', margin: 0 }}>
                2. Conditions générales entre FoodForce.ma et les Extras
              </h2>
            </div>

            {[
              {
                title: "Services proposés",
                content: "FoodForce.ma vous met en relation avec des établissements de l'hôtellerie-restauration pour réaliser des missions ponctuelles en tant que prestataire indépendant.",
                warning: "FoodForce.ma ne propose pas de mise en relation pour des emplois salariés (CDI, CDD) ni de travail temporaire."
              },
              {
                title: "Vous travaillez en toute indépendance",
                content: "Vous déterminez librement vos conditions de travail. Vous n'êtes soumis à aucun lien de subordination vis-à-vis de FoodForce.ma ni des Établissements. Vous êtes seul responsable de vos obligations sociales, fiscales et administratives."
              },
              {
                title: "Conditions d'inscription",
                content: "Pour vous inscrire, vous devez :",
                list: ["Être majeur (+18 ans), marocain ou étranger résidant légalement au Maroc", "Posséder le statut d'auto-entrepreneur marocain (loi 114-13) — condition obligatoire", "Fournir votre numéro ICE", "Fournir votre CIN recto/verso", "Fournir votre RIB", "Fournir une photo d'identité récente"]
              },
              {
                title: "Relevé d'activité et paiement",
                content: "À l'issue de chaque mission, vous remplissez un relevé d'heures. L'Établissement dispose de 72h pour valider ou contester. FoodForce.ma encaisse la rémunération pour votre compte et vous la reverse après déduction de sa commission."
              },
              {
                title: "Annulation",
                list: ["Plus de 24h avant : aucune incidence", "Moins de 24h avant ou non-présentation : frais d'annulation de 50 MAD HT", "Annulation par l'Établissement moins de 24h avant : une indemnité est partagée entre FoodForce.ma et vous"]
              },
              {
                title: "Vos engagements",
                list: ["Réaliser personnellement les missions acceptées", "Maintenir votre statut d'auto-entrepreneur actif", "Informer FoodForce.ma de tout changement de situation", "Ne pas contacter directement les Établissements pour court-circuiter la plateforme", "Respecter les règles de courtoisie avec FoodForce.ma et les Établissements"]
              },
              {
                title: "Ce qui vous est interdit",
                list: ["Exercer des activités illégales via la plateforme", "Copier ou détourner le concept ou la base de données de FoodForce.ma", "Vendre ou concéder votre accès aux Services", "Diffuser des contenus illicites ou diffamatoires", "Tenter de pirater les systèmes de FoodForce.ma"]
              },
            ].map((section: any, i) => (
              <div key={i} style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid #f0f0f0' }}>
                  {section.title}
                </h3>
                {section.warning && (
                  <div style={{ background: '#FDF0E8', border: '1px solid rgba(244,124,32,0.3)', borderRadius: '10px', padding: '14px', marginBottom: '10px', fontSize: '14px', color: '#F47C20', fontWeight: 600 }}>
                    ⚠️ {section.warning}
                  </div>
                )}
                {section.content && <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.8, marginBottom: '8px' }}>{section.content}</p>}
                {section.list && section.list.map((item: string, j: number) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ color: '#F47C20', marginTop: '2px' }}>·</span>
                    <span style={{ color: '#555', fontSize: '14px', lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* SECTION 3 — DONNÉES */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ background: '#F47C20', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'white', margin: 0 }}>
                3. Protection des données personnelles
              </h2>
            </div>
            {[
              { title: "Données collectées", content: "Vos données sont utilisées pour gérer votre accès aux Services, vérifier votre identité, assurer la gestion des missions et des paiements, et respecter les obligations légales marocaines." },
              { title: "Durée de conservation", content: "Vos données sont conservées 3 ans à compter de votre dernière utilisation." },
              { title: "Vos droits", content: "Conformément à la loi 09-08, vous disposez des droits d'accès, de rectification, d'effacement, d'opposition et de portabilité.", footer: "Pour les exercer : contact@foodforce.ma" },
              { title: "Stockage", content: "Les documents sensibles (CIN, RIB, ICE) sont stockés de manière sécurisée avec accès restreint. FoodForce.ma ne divulgue jamais vos données à des tiers non autorisés." },
            ].map((section: any, i) => (
              <div key={i} style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid #f0f0f0' }}>{section.title}</h3>
                <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.8 }}>{section.content}</p>
                {section.footer && <p style={{ color: '#888', fontSize: '13px', marginTop: '8px', fontStyle: 'italic' }}>{section.footer}</p>}
              </div>
            ))}
          </div>

          {/* SECTION 4 — DISPOSITIONS FINALES */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'white', margin: 0 }}>
                4. Dispositions finales
              </h2>
            </div>
            {[
              { title: "Propriété intellectuelle", content: "Tous les contenus de FoodForce.ma sont protégés par les droits de propriété intellectuelle. Toute reproduction non autorisée est interdite." },
              { title: "Décharge de responsabilité", content: "FoodForce.ma intervient exclusivement en qualité d'intermédiaire de mise en relation. FoodForce.ma n'est pas partie aux contrats conclus entre Extras et Établissements." },
              { title: "Résiliation", content: "Tout utilisateur peut se désinscrire à tout moment en contactant contact@foodforce.ma. La désinscription est effective sous 7 jours." },
              { title: "Droit applicable", content: "Les présentes CGU sont régies par le droit marocain. En cas de litige, les tribunaux de Casablanca sont seuls compétents." },
            ].map((section: any, i) => (
              <div key={i} style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid #f0f0f0' }}>{section.title}</h3>
                <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.8 }}>{section.content}</p>
              </div>
            ))}
          </div>

          <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
              © 2026 FoodForce.ma — Tous droits réservés<br />
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