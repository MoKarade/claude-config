# BACKLOG — claude-config

Ce qui est décidé mais pas fait. Une tâche = une case.

## Conventions

- [x] 🔧 **CC-08 — L'auto-merge tombe en silence : mesuré dans les huit dépôts, et le
  résultat contredit l'hypothèse.** Mesuré le 14/09 sur Hubperso : runs 361 à 364
  d'`auto-merge.yml` tous en échec entre 18h53 et 19h42 Z sur `Resource not accessible by
  integration (…checkSuite.workflowRun)`. Cause : `actions: read` absent des `permissions:` —
  `gh pr view --json statusCheckRollup` descend jusqu'à ce champ, qui relève de l'API Actions
  et non de `checks`. **Deuxième fois** (le 21/08, c'étaient `checks: read` et
  `statuses: read`). Échec FERMÉ les deux fois : aucune PR mal fusionnée, aucune PR fusionnée
  du tout, et rien de rouge là où quelqu'un regarde.
  **Corrigé** : CarAI ([#108](https://github.com/MoKarade/CarAI/pull/108), par une autre
  session) et Hubperso ([#52](https://github.com/MoKarade/Hubperso/pull/52)), avec dans les
  deux cas les cinq permissions verrouillées par `tests/autoMerge.test.ts`. **Prouvé** le
  14/09 à 20:21 Z : le run 371 de Hubperso a fusionné la #53 tout seul, première fois depuis
  trois semaines.
  ⚠️ **Le portage annoncé ici n'avait pas lieu d'être, et c'est la leçon.** Cette entrée
  disait « probablement la même permission absente dans six dépôts, `autoMerge.mjs` se
  déclarant identique partout ». Mesure faite : **DriveAI a une implémentation entièrement
  différente** (elle ne lit jamais `statusCheckRollup`, donc n'est pas concernée — 475 runs,
  les cinq derniers verts) et **les cinq autres n'ont aucun auto-merge**. Il n'y avait rien à
  porter. Une affirmation tirée d'un commentaire de fichier plutôt que d'une mesure, dans
  l'entrée même qui raconte ce mode de panne. Détail dans la §2 du `CLAUDE.md`.
  *(Sans conséquence sur la façon de travailler : Marc a confirmé le 14/09 que les sessions
  fusionnent elles-mêmes.)*

- [ ] 🔧 **CC-09 — Cinq dépôts sur huit n'ont aucun auto-merge.** Constat de la mesure
  ci-dessus : seuls `Hubperso`, `CarAI` et `DriveAI` en ont un, et DriveAI par une
  implémentation qui lui est propre. Rien n'est cassé — les sessions fusionnent elles-mêmes
  depuis le 14/09 — donc **ne rien construire sans que Marc le demande**. Inscrit pour qu'une
  session ne cherche pas un workflow qui n'existe pas, ni ne conclue à une panne devant son
  absence. La question à poser le jour où ça revient : un auto-merge de plus est-il utile
  maintenant que le merge par la session ne dépend d'aucun workflow ?

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
