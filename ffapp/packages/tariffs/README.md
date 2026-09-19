# FoodForce Tariffs

Source of truth: salaires foodforce v7.xlsx, sheet Grille Tarifaire FoodForce.

The sheet contains 59 métiers. The official formula published in the workbook is:

- Candidate: Taux moyen × 1.45
- FoodForce commission: 25%
- VAT: 20%
- Employer TTC: Taux moyen × 1.45 × 1.25 × 1.20

Example from the workbook:
- Serveur average: 24.869110 MAD/h
- Candidate: 36.060209 MAD/h
- Employer HT: 45.075262 MAD/h
- VAT: 9.015052 MAD/h
- Employer TTC: 54.090314 MAD/h

Security rule: a Pro client never chooses or sends a price. The server loads the official tariff by job/tariff id and stores a snapshot on the mission.

The SQL seed is in supabase/migrations/002_seed_tariffs.sql.
The index.ts file contains the shared calculation and mismatch guard for server-side use.
