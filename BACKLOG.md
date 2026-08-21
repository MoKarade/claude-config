# BACKLOG — claude-config

Ce qui est décidé mais pas fait. Une tâche = une case.

## Conventions

- [ ] **CC-01 — Détecter une source qui avance sans propagation.** Le `sha256sum -c` de chaque
  dépôt attrape une copie éditée sur place, pas une source modifiée ici sans être propagée.
  Piste : un workflow planifié **dans ce dépôt** qui lit les 8 `docs/COMPTE-RENDU.md` via
  l'API et compare. Demande un jeton à portée lecture sur les 8 dépôts — donc une décision de
  Marc avant de coder. Limite documentée dans `HANDOVER.md`.
- [ ] **CC-04 — Le renvoi de `STRUCTURE-DEPOT.md` décrit encore la §10 comme « Renvoi au
  `CLAUDE.md` global de Marc ».** Depuis le 21/08 la §10 est un renvoi à `COMPTE-RENDU.md`.
  Une ligne à corriger dans le tableau des sections.

## Anomalies d'écosystème (constatées le 21/08/2026, non corrigées — hors périmètre)

- [ ] **CC-02 — `app-template` n'a pas de `main`.** Branche par défaut :
  `claude/hopeful-lovelace-4d09zx`, qui porte pourtant tout l'historique mergé. Un nom de
  branche généré par une session est devenu le tronc du dépôt. À renommer en `main`
  (opération GitHub, pas git : ça casse les PR ouvertes si mal fait).
- [ ] **CC-03 — `batchchef-` a deux troncs apparents.** `master` est le vrai (son `CLAUDE.md`
  §3 l'écrit) ; `main` existe et pointe sur le 2026-04-24. Un `main` figé qui traîne finira
  par servir de base à quelqu'un. À supprimer ou à aligner.
- [ ] **CC-05 — DriveAI : `/lesson.md` renvoie à « `CLAUDE.md` §7. Leçons apprises ».** Les
  leçons sont en **§9** dans ce fichier depuis l'alignement sur `STRUCTURE-DEPOT.md`. La
  commande écrit donc au mauvais endroit. Trouvé pendant l'audit du 21/08, laissé tel quel :
  hors périmètre de la tâche demandée.
