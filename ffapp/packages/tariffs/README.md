# Grille tarifaire FFAPP

Source de vérité : salaires foodforce v7.xlsx, feuille Grille Tarifaire FoodForce.

La feuille officielle contient 59 métiers.

Formule documentée :
- taux candidat = taux moyen × 1,45
- prix employeur HT = taux candidat × 1,25
- TVA = HT × 20 %
- prix employeur TTC = HT + TVA

Exemple Serveur :
- taux moyen : 24,87 MAD/h
- candidat : 36,06 MAD/h
- employeur HT : 45,08 MAD/h
- TVA : 9,02 MAD/h
- employeur TTC : 54,09 MAD/h

Ces valeurs doivent être stockées/calculées côté serveur. Le frontend ne constitue jamais une autorité tarifaire.
