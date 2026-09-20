import Link from "next/link";

export default function Home() {
  return (
    <main className="landing">
      <header className="landingHeader">
        <div className="brand">FOOD<span>FORCE</span></div>
        <nav><Link href="/connexion">Se connecter</Link><Link href="/inscription" className="navCta">Créer un compte</Link></nav>
      </header>
      <section className="landingHero">
        <div className="heroCopy">
          <p className="eyebrow">HÔTELLERIE · RESTAURATION · ÉVÉNEMENTIEL</p>
          <h1>Des opportunités<br/><span>dès aujourd’hui.</span></h1>
          <p className="lead">FoodForce connecte les professionnels de l’hospitalité avec les bons extras, au bon moment.</p>
          <div className="heroActions">
            <Link className="primaryBtn" href="/extras">Je suis un extra <span>→</span></Link>
            <Link className="secondaryBtn" href="/pro">Je suis un établissement <span>→</span></Link>
          </div>
        </div>
        <div className="landingVisual">
          <div className="visualBadge">FOODFORCE<br/><small>LA NOUVELLE FAÇON DE TRAVAILLER</small></div>
          <div className="visualCard"><b>Mission disponible</b><span>Serveur · Casablanca</span><strong>36,06 MAD/h</strong></div>
        </div>
      </section>
      <section className="choice">
        <Link className="appCard extraCard" href="/extras"><span className="appKicker">FOODFORCE EXTRAS</span><b>Trouver une mission.</b><small>Consulter des missions anonymisées, postuler et gérer votre planning.</small><span className="cardArrow">Découvrir l’espace Extra →</span></Link>
        <Link className="appCard proCard" href="/pro"><span className="appKicker">FOODFORCE PRO</span><b>Trouver les bons extras.</b><small>Publier vos besoins, recevoir des candidatures et gérer vos équipes.</small><span className="cardArrow">Découvrir l’espace Pro →</span></Link>
      </section>
      <section className="trustBar"><div><b>59</b><span>métiers</span></div><div><b>Tarifs fixes</b><span>grille FoodForce</span></div><div><b>Confidentiel</b><span>identité révélée après sélection</span></div><div><b>Simple</b><span>de la mission au paiement</span></div></section>
    </main>
  );
}