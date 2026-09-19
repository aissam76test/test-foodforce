# Sécurité tarifaire

Le navigateur ne fournit jamais le montant officiel.

Lors de la création d'une mission, le backend reçoit uniquement un identifiant de métier. Il récupère la ligne correspondante de tariff_grid et enregistre un snapshot des taux sur la mission.

Même si un client tente d'envoyer un hourlyRate, candidateRate, employerTtc ou commission différent, ces valeurs sont ignorées.

La validation finale des heures recalcule le montant à partir du tarif enregistré sur la mission et des heures validées.
