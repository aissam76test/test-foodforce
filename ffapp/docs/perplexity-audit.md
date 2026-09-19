# FFAPP — audit des ZIP Perplexity

Les ZIP fournis ont été analysés comme référence fonctionnelle et visuelle, pas comme source de vérité technique.

## Food Force Pro
- Build frontend Vite/React minifié.
- Routes : /publier, /candidatures, /vivier.
- API : /api/auth/login, /api/auth/logout, /api/auth/me, /api/auth/signup/pro, /api/missions, /api/applications, /api/applications/:id/status, /api/missions/:id/validate, /api/extras, /api/establishments.
- Fonctions : publication de mission, candidatures, vivier, validation des heures, suivi des dépenses TTC.

## Food Force Extras
- Build frontend Vite/React minifié.
- Routes : /mes-missions, /profil, /revenus.
- API : /api/auth/login, /api/auth/logout, /api/auth/me, /api/auth/signup/extra, /api/missions, /api/applications, /api/extras, /api/establishments.
- Fonctions : inscription, choix du métier, missions disponibles, candidature, missions acceptées/réalisées, profil, revenus.

## Tarifs

Le bundle Perplexity embarque une ancienne grille de 59 métiers et des constantes tarifaires côté frontend. Nous ne la prenons pas comme source de vérité.

La source officielle FFAPP est le fichier Excel salaires foodforce v7.xlsx, feuille Grille Tarifaire FoodForce.

Cette feuille contient 59 métiers et documente la formule :
Prix TTC = Taux horaire moyen × 1,45 × 1,25 × 1,20.

Le tarif doit être déterminé côté serveur à partir de cette grille. Une valeur de tarif envoyée par le navigateur ne doit jamais pouvoir modifier le prix officiel.

## Ce que FFAPP reprend
- séparation Pro / Extras ;
- connexion/inscription ;
- publication et candidature ;
- acceptation/refus ;
- validation des heures ;
- profil et historique ;
- écrans et vocabulaire utiles.

## Ce que FFAPP corrige
- grille tarifaire sortie du frontend comme source d'autorité ;
- calcul tarifaire centralisé côté backend ;
- architecture propre Next.js + Supabase ;
- règles métier séparées de l'interface ;
- préparation notifications, messagerie, paiements et administration.
