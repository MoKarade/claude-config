# BACKLOG — claude-config

Ce qui est décidé mais pas fait. Une tâche = une case.

## En attente d'un geste de Marc

- [ ] **CC-01 — Poser le jeton du vérificateur de copies.** Le workflow, la logique pure et
  ses 8 tests sont livrés (`scripts/copiesAJour.mjs`, `.github/workflows/copies.yml`). Il
  **échoue tant que le secret n'est pas posé**, et c'est voulu : un run qui ne vérifie rien
  ne doit pas ressembler à un run vert.
  À créer : *Settings → Developer settings → Personal access tokens → Fine-grained*, portée
  sur les 8 dépôts applicatifs, permission **Contents : Read-only**, rien d'autre. Puis
  *claude-config → Settings → Secrets and variables → Actions → New repository secret*,
  nom exact **`JETON_LECTURE_DEPOTS`**.

- [ ] **CC-03 — BatchChef : décider du sort de la branche `main`. ⚠️ NE PAS SUPPRIMER EN
  L'ÉTAT.** Marc avait autorisé la suppression le 21/08 sur ma description « un `main` mort
  figé au 24 avril ». **Cette description était fausse** et je l'ai découvert en vérifiant
  avant d'agir :
  - `main` et `master` n'ont **aucun ancêtre commun** (`git merge-base` ne rend rien) — ce
    sont deux histoires sans rapport, pas une copie périmée de l'autre.
  - `main` porte **75 commits absents de `master`**, dont du travail réel : « Weekly
    meal-planner (Trello-style) », « Reliability + cost-saving + unit/name sanity overhaul »,
    `frontend/components/features/WeekPlannerPage.tsx` — un fichier qui **n'existe nulle
    part sur `master`**.
  - Le reste (~70 commits) sont des instantanés automatiques de données de recettes.

  Autrement dit : `main` est l'ancien BatchChef, avant la reprise à zéro sous `web/`. Le
  supprimer jetterait une base de code entière contenant au moins une fonctionnalité sans
  équivalent aujourd'hui. Décision à prendre par Marc : archiver (tag + suppression),
  récupérer le planificateur hebdomadaire, ou laisser en place.
  Empreinte à conserver dans tous les cas : `main` = `6638f8b`, `master` = `f127336`.

## Conventions

- [ ] **CC-04 — Le tableau de `STRUCTURE-DEPOT.md` décrit encore la §10 comme « Renvoi au
  `CLAUDE.md` global de Marc ».** Depuis le 21/08 la §10 est un renvoi à `COMPTE-RENDU.md`
  plus un import de la copie locale. Une ligne à corriger.

## Fait le 21/08/2026

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
