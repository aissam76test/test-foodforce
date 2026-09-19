# FFAPP — architecture de départ

## Applications
- apps/pro : Food Force Pro
- apps/extras : Food Force Extras
- apps/admin : administration FoodForce (à venir)
- packages/domain : règles métier partagées
- packages/ui : composants UI partagés
- packages/tariffs : grille tarifaire officielle

## Règle tarifaire absolue

Le client sélectionne uniquement un métier et une mission. Le serveur retrouve le métier dans la grille officielle et calcule le montant.

Le serveur ne doit jamais accepter hourlyRate, commission, ttc ou toute autre valeur tarifaire fournie par le navigateur comme autorité.

Le frontend peut afficher une estimation, mais la valeur finale est recalculée côté serveur.

## Flux mission
1. Pro choisit le métier.
2. Serveur vérifie le métier.
3. Serveur associe la ligne tarifaire officielle.
4. Serveur enregistre la mission avec un snapshot tarifaire.
5. Extra candidate.
6. Pro accepte/refuse.
7. Les heures réellement travaillées sont validées.
8. Le montant final est recalculé à partir du snapshot officiel et des heures validées.
9. Facturation et paiement utilisent exclusivement ce montant serveur.

## Données principales
users, extras, establishments, tariff_grid, missions, applications, worked_hours, payments, evaluations, messages, notifications.

## Sécurité
RLS Supabase sur les données utilisateur. Les opérations sensibles passent par des fonctions serveur contrôlées.
