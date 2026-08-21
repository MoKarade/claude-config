# BACKLOG — claude-config

Ce qui est décidé mais pas fait. Une tâche = une case.

## Conventions

- [ ] **CC-04 — Le tableau de `STRUCTURE-DEPOT.md` décrit encore la §10 comme « Renvoi au
  `CLAUDE.md` global de Marc ».** Depuis le 21/08 la §10 est un renvoi à `COMPTE-RENDU.md`
  plus un import de la copie locale. Une ligne à corriger.

## Fait le 21/08/2026

- [x] **CC-01 — Le vérificateur de copies tourne pour de vrai.** Le secret
  `JETON_LECTURE_DEPOTS` a été posé par Marc le 21/08 à 19:42. Premier run vérifié dans sa
  SORTIE, pas seulement à sa couleur : « Empreinte de la source : dded2ce9… / Les 8 copies
  sont à jour. » Le trou est bouché dans les deux sens.
- [x] **CC-03 — Le `main` de BatchChef est archivé, pas détruit.** ⚠️ **Ma recommandation
  initiale de suppression reposait sur une description fausse** (« un `main` mort figé au
  24 avril »). Vérification faite avant d'agir : aucun ancêtre commun avec `master`, et 75
  commits absents du tronc dont `WeekPlannerPage.tsx`. Conservé sur
  **`archive/pre-web-2026-04-24`** (pointe `6638f8b`), contenu vérifié depuis le distant.
  ⚠️ **Il reste UN geste à faire, que je ne peux pas faire** : supprimer la branche `main`
  de `batchchef-`. Le proxy git de la session refuse en `403` les suppressions de branche
  comme les tags, et aucun outil ne le permet autrement. À faire par Marc :
  *batchchef- → Branches → poubelle à côté de `main`*. L'archive est déjà en place, donc
  rien n'est perdu si c'est fait maintenant.

- [x] **CC-02 — `app-template` a maintenant une branche `main`.** Sa branche par défaut était
  `claude/hopeful-lovelace-4d09zx`, un nom généré par une session devenu le tronc. Renommée
  par Marc.
- [x] **CC-05 — `/lesson.md` de DriveAI visait la §7.** Les leçons sont en §9 depuis
  l'alignement sur `STRUCTURE-DEPOT.md` ; la commande écrivait au mauvais endroit.
- [x] **CC-06 — Une PR de documentation consommait du quota Vercel.** Les 8 PR de la
  convention ont chacune déclenché une tentative de déploiement de prévisualisation, toutes
  refusées (100/jour, **partagé entre les six projets**, épuisé).
  Le point qui compte : **`build-necessaire.sh` ne protège PAS de ça.** Il tourne en
  `ignoreCommand`, donc PENDANT le déploiement, alors que le refus tombe à sa CRÉATION. Il
  économise du temps de build, pas du quota — et croire l'inverse laisse le trou ouvert en
  pensant l'avoir bouché.
  Corrigé par `git.deploymentEnabled: { "claude/*": false }` dans les six `vercel.json`, lu
  par l'intégration Git avant la création.
- [x] **CC-07 — 20 jobs de CI n'avaient aucun `timeout-minutes`**, répartis sur les 8 dépôts.
  Sans plafond, un job figé tourne SIX HEURES avant d'échouer (vécu sur DriveAI le 19/08 :
  2 h 15 bloquées sur une installation Playwright, PR « en attente », rien de rouge).
  Chaque plafond est calibré sur la durée **réellement observée** du job le 21/08, pas sur un
  chiffre choisi au hasard ; les quelques jobs qui n'ont pas tourné ce jour-là portent la
  mention « non observé » dans leur commentaire, plutôt qu'une fausse précision.
