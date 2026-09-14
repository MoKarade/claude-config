# CLAUDE.md global de Marc — règles de collaboration

> **Source de vérité** pour tous mes projets. À copier/symlinker dans `~/.claude/CLAUDE.md` sur chaque PC.
>
> **Profil rapide** : Marc, francophone, beginner-intermédiaire, basé au Québec. Veut "Claude fait le max" + qualité production avant tout.

---

## 1. Langue & ton

- ✅ **Français par défaut** dans toutes les réponses, prompts, docs.
- ✅ **Tutoie Marc**, ton direct, technique mais clair.
- ✅ Préfère explications concrètes à théorie abstraite.
- ❌ Pas de jargon non-expliqué la première fois.
- ❌ Pas d'emojis sauf si Marc demande explicitement.
- ❌ Pas de captures d'écran — du texte qui ne se périme pas.

## 2. Approche du code & des décisions

- ✅ **"Claude fait le max"** : prends des initiatives, propose des solutions complètes, pas juste des questions.
- ✅ **No fake data** : jamais de mockup hardcodé en prod, vraies sources ou empty states honnêtes.
- ✅ **Stack ennuyeuse** : préfère technos stables + documentées (Postgres, FastAPI, Next.js) à expérimental.
- ✅ **Tout gratuit** : Marc veut zéro abonnement.
- ✅ **Local-first** : les données ne quittent jamais le PC sauf backup chiffré.
- ✅ **Decisions justifiées** : chaque choix technique majeur → ADR court (Contexte / Décision / Pourquoi / Trade-offs / Alternatives rejetées).

### Code & technique — comment on travaille ensemble

- **Avant de coder : TOUTES les questions de cadrage d'un coup**, en un seul batch — y
  compris ce qui définit « fini » et l'objectif exact. Pas de questions au compte-gouttes
  qui interrompent le travail trois fois.
- **Une fois que tu as tout ce qu'il te faut : exécute en continu** jusqu'à atteindre
  l'objectif donné, puis arrête-toi. Ni avant, ni au-delà.
- **Sur le technique, assume ton expertise** : tu sais souvent mieux que moi. Sois **ferme
  sur les faits**, très réfléchi. Une recommandation molle qui me renvoie la décision
  technique ne m'aide pas — et si tu t'es trompé, corrige-toi franchement.

⚠️ Ces règles sont lues au DÉMARRAGE d'une session, depuis ce dépôt. Les écrire dans
`~/.claude/CLAUDE.md` sans pousser, ou dans un réglage de l'interface web, ne les fait pas
descendre dans une session distante — vécu le 20/08/2026 : Marc a constaté « je ne vois pas
la différence » alors que rien n'était arrivé jusqu'à la session.

### Fusionner ce qui est vert, et le BROUILLON est le seul frein

Décision de Marc, 21/08/2026. **Confirmée le 14/09/2026** (« fusionne seul »), après un
incident qui a montré que l'automatisation ne suffit pas — voir l'encadré plus bas. Vaut pour
**toutes** les sessions Claude, dans les huit dépôts.

- **Je fusionne moi-même une PR dès que sa CI est verte et qu'elle n'est plus en brouillon**
  (`merge_pull_request`, API REST). Je n'attends pas de validation pour ce qui est vert.
- **Et je ne compte PAS sur l'auto-merge pour le faire à ma place.** Il existe, il est bon,
  et il a déjà été mort deux fois sans que personne ne le voie (ci-dessous). Un mécanisme
  dont la panne est silencieuse ne peut pas être la seule voie.
- **Une PR en BROUILLON n'est jamais fusionnée.** Rien ne doit la repasser en « ready »
  automatiquement — c'était le défaut de l'auto-merge de DriveAI, corrigé le 21/08.
- **La seule exception qui reste en brouillon : un ADR en statut « Proposé ».** Par
  définition il demande une décision de Marc. Tout le reste part.
- **Je ne merge pas les PR des autres sessions.** Je ne peux pas savoir si leur travail est
  fini — une PR verte peut attendre une revue que sa session a elle-même demandée (vécu le
  14/09 : la #347 de DriveAI portait « revue flotte en cours, à intégrer avant de sortir du
  brouillon »). Leur brouillon est leur frein, pas le mien à lever.

⚠️ **L'AUTO-MERGE DE CE PARC EST UN WORKFLOW MAISON — LÀ OÙ IL EXISTE (relevé plus bas) —
ET IL A ÉTÉ MORT DEUX FOIS.**

Ce n'est pas le réglage natif de GitHub (`Allow auto-merge`), qui est d'ailleurs désactivé au
niveau des dépôts — j'ai cru le 14/09 que c'était LE mécanisme, et j'ai conclu à tort que la
règle du 21/08 n'avait jamais pu fonctionner. C'est faux : le mécanisme est
`.github/workflows/auto-merge.yml` + `scripts/autoMerge.mjs` (décision PURE et testée, source
dans ce dépôt), et il a tourné des centaines de fois.

Ce qui est vrai, et pire : **il tombe en silence.**

| Date | Ce qui manquait | Comment ça s'est manifesté |
|---|---|---|
| 21/08 | `checks: read`, `statuses: read` | Cinq essais, refus de merger, dès le premier run |
| 14/09 | `actions: read` | Runs 361-364 de Hubperso en échec sur `Resource not accessible by integration (…checkSuite.workflowRun)`. Cinq PR vertes restées ouvertes ; il a fallu ouvrir les journaux pour comprendre |

`gh pr view --json statusCheckRollup` descend jusqu'à `checkSuite.workflowRun`, qui relève de
l'API **Actions** et non de `checks`. Les deux fois, échec FERMÉ : aucune PR mal fusionnée,
mais aucune PR fusionnée du tout — et **rien de rouge là où quelqu'un regarde**, puisque le
seul signal est un run d'Actions en échec que personne n'ouvre.

**Une permission manquante ne se manifeste jamais par « il manque une permission ».** Elle se
manifeste par du silence. D'où la garde, désormais dans `tests/autoMerge.test.ts` de Hubperso
et de CarAI : les cinq permissions sont verrouillées par le gate, qui lui est lu.

⚠️ **MESURÉ LE 14/09 AU SOIR, ET LE RÉSULTAT CONTREDIT LA PHRASE QUI ÉTAIT ÉCRITE ICI.**
Cette section annonçait un auto-merge « identique dans les huit dépôts » et six dépôts
« probablement » atteints du même défaut, à porter. Les deux sont faux. La phrase venait d'un
commentaire dans le fichier, pas d'une mesure — exactement le mode de panne que cette section
raconte, reproduit dans la section qui le raconte.

Relevé dépôt par dépôt (`.github/workflows/` lu sur la branche par défaut de chacun) :

| Dépôt | Auto-merge | Atteint par `actions: read` ? |
|---|---|---|
| `Hubperso` | `auto-merge.yml` + `scripts/autoMerge.mjs` | **Oui** — corrigé (#52), et PROUVÉ : le run 371 a fusionné la #53 tout seul |
| `CarAI` | idem | **Oui** — corrigé (#108) |
| `DriveAI` | `auto-merge.yml`, **implémentation entièrement différente** | **Non** |
| `JobAI`, `BatchChef`, `FinanceAI`, `hub-contract`, `app-template` | **aucun auto-merge** | **Non** — il n'y a rien à corriger |

**Pourquoi DriveAI est indemne, et ce n'est pas de la chance.** Son workflow ne lit jamais
`statusCheckRollup` : il se fie au fait que l'événement `workflow_run` de la CI soit
`success`, puis interroge `isDraft`, `labels` et `isCrossRepository` un par un. Il ne
descend donc jamais jusqu'à `checkSuite.workflowRun`, le champ qui relève de l'API Actions.
475 runs, les cinq derniers verts. **Le bug n'est pas « une permission oubliée » : c'est une
permission oubliée PAR UNE MANIÈRE PARTICULIÈRE de lire les checks.** Une correction portée
à l'aveugle dans les huit dépôts aurait ajouté des permissions à des workflows qui n'en ont
pas besoin, et surtout n'aurait rien appris.

**Ce que la mesure révèle par ailleurs** : cinq dépôts sur huit n'ont aucun auto-merge. Ce
n'est pas un incident — c'est un parc plus hétérogène que ce que ce fichier décrivait.
Aucune conséquence pratique depuis que je fusionne moi-même, et rien n'est à construire sans
que Marc le demande. C'est dit ici pour qu'une session ne cherche pas un workflow qui n'existe
pas, ni ne conclue à une panne devant son absence.

Diagnostic d'origine : CarAI #108 et Hubperso #52.

C'est exactement pour ça que Marc a confirmé « fusionne seul » **après** avoir su que le
mécanisme existait et venait d'être réparé : le merge par la session ne dépend d'aucun
workflow, donc d'aucune panne silencieuse.

⚠️ **Pourquoi le brouillon et pas un label.** Le 20/08, l'ADR-0045 de DriveAI — ouverte en
brouillon, portant « statut Proposé, demande ta ratification » — a été fusionnée **63
secondes** après sa création. Le frein d'alors (`do-not-merge`) était opt-in et se posait à
la main, APRÈS la création. Un frein qui demande un geste plus rapide que l'automatisation
n'est pas un frein. Le brouillon, lui, se pose au moment où l'on ouvre la PR.

⚠️ **« CI verte » ne veut pas dire « correct »**, et l'auto-merge ne prétend pas le
contraire. Le 20/08, la CI était verte pendant que la doc était fausse, pendant que la
production servait une version périmée, et pendant que la constellation avait dérivé. Verte
veut dire « aucun test n'a échoué ». C'est à celui qui ouvre la PR de décider si elle doit
rester en brouillon.

## 3. Style de code

- **Linting strict** quand possible (ruff, eslint, mypy strict, tsc --noEmit).
- **Type hints partout** en Python.
- **Comments minimum** : nommage clair plutôt que commentaires verbeux.
- **Exit early** : returns multiples > nested ifs.
- **Error handling honnête** : ne pas avaler les erreurs, ne pas ajouter de try/except qui cache un vrai bug.

## 4. Workflow git

- ✅ Branches : `claude/<short-slug>` pour les modifs Claude, `feature/<slug>` pour Marc.
- ✅ Commits descriptifs en français : `feat:`, `fix:`, `docs:`, `refactor:`.
- ✅ PR drafts pour itération.
- ✅ Avant push : `git pull` (sync bidirectionnelle entre PC).
- ❌ Jamais `--force` sur main.
- ❌ Jamais `--no-verify`.

## 5. Tests & validation

- ✅ pytest (Python), tsc + npm test (TS), avant chaque commit.
- ✅ Healthcheck endpoint après chaque modif backend.
- ❌ Mock-only tests (au moins 1 integration test par feature).

## 6. Sécurité

- ❌ JAMAIS de secret en clair dans le code, le repo, le chat, ou Drive.
- ❌ JAMAIS de credentials hardcodés, même temporairement.
- ✅ Vault `age + sops` ou variables d'env utilisateur.
- ✅ Rotation des secrets après tout incident potentiel.
- ✅ Cloudflare Access (Google OAuth + MFA) pour toute exposition Internet.

## 7. Documentation

- ✅ **Structure commune à tous les dépôts du hub : [`conventions/STRUCTURE-DEPOT.md`](./conventions/STRUCTURE-DEPOT.md).**
  Arborescence, squelette de `CLAUDE.md`, ordre des sections. Écrite là et nulle part
  ailleurs — un dépôt s'y conforme et y renvoie, il ne la recopie pas.
- ✅ **Forme des comptes-rendus, commits, PR et docs générées :
  [`conventions/COMPTE-RENDU.md`](./conventions/COMPTE-RENDU.md).** Fil de travail, résumé
  final à structure fixe, vulgarisation, labels de confiance, cadrage en un seul batch.
  Elle régit **la forme** ; le `CLAUDE.md` d'un dépôt garde **le contenu métier**.
- ✅ ADR pour décisions architecturales : **`docs/adr/<NNNN>-<slug>.md`**.
  *(Cette ligne disait `decisions/` jusqu'au 20/08/2026, alors que DriveAI, JobAI et
  BatchChef écrivaient déjà dans `docs/adr/` — seul Hubperso suivait la règle. Corrigé dans
  le sens de l'usage, pas l'inverse.)*
- ✅ Mettre à jour la doc quand on change le code (doc périmée = pire que pas de doc).
- ✅ **Un chiffre au présent dans une doc rote.** « 813 tests », « frein à 110 $ », « la
  campagne est finie » : personne ne les relit, et rien ne signale qu'ils sont devenus faux.
  Soit on les date (« au 20/08 : … »), soit on renvoie à la source qui fait foi.
- ✅ Diagrammes Mermaid (rendu GitHub natif).

## 8. ECC — Everything Claude Code

Cette config installe les éléments **ECC** (https://github.com/affaan-m/everything-claude-code) en local : agents spécialisés, skills, rules, slash commands.

### Comment ça interagit avec mes règles

- Les **agents ECC** sont en anglais. Quand tu les invoques, **réponds-moi toujours en français**.
- Les **rules ECC** par langage sont des baselines — **mes règles personnelles ci-dessus prévalent** en cas de conflit.
- Les **skills ECC** sont auto-chargés selon le contexte. Active uniquement ceux qui matchent vraiment la tâche.
- Si un agent ECC suggère une action contraire à mes règles (ex: fake data, emoji, anglais) → **applique mes règles**.

### Top agents ECC

- `code-reviewer` — review qualité + sécurité après chaque modif
- `security-reviewer` — audit sécurité approfondi (avant chaque déploiement Internet)
- `python-reviewer`, `typescript-reviewer` — review par langage
- `planner` — planification de feature complexe
- `architect`, `code-architect` — design architectural
- `tdd-guide` — discipline TDD
- `silent-failure-hunter` — détection des bugs silencieux
- `refactor-cleaner` — refactor propre
- `performance-optimizer` — optimisation
- `build-error-resolver` — résolution erreurs de build

Liste complète : `ls ~/.claude/agents/`.

## 9. Projets actifs

L'écosystème du hub perso — huit dépôts, tous sur `hubperso.com` ou un sous-domaine.
*(Cette table listait `MoKarade/hub` en Python/FastAPI/Ollama jusqu'au 20/08/2026 : un projet
qui n'est aucun des huit, dans une stack qu'aucun n'utilise.)*

| Dépôt | Rôle | Stack |
|---|---|---|
| `Hubperso` | Le tableau de bord — consomme le contrat, ne le définit pas | Next.js 15 · Neon · Auth.js v5 |
| `hub-contract` | Le contrat partagé (types + schémas Zod) | TypeScript · Zod |
| `app-template` | Le squelette à forker pour une nouvelle app | Next.js 15 · Auth.js v5 |
| `FinanceAI` | Patrimoine, projections, fiscalité | Next.js · Postgres |
| `DriveAI` | Classement automatique du Drive | Apps Script + Vercel + SPA |
| `BatchChef` | Batchs de cuisine, listes d'épicerie | Next.js 15 · Neon · MCP |
| `JobAI` | Veille d'emploi et suivi de candidatures | Next.js 15 · Neon · MCP |
| `CarAI` | Télémétrie du véhicule (Smartcar, Toyota) | Next.js 15 · Neon · MCP |

**Accès** : la connexion est unique (cookie partagé sur `.hubperso.com`), l'autorisation est
**par app** et se gère depuis `hubperso.com/administration`. `AUTHORIZED_EMAIL` n'est pas une
allowlist : c'est le PROPRIÉTAIRE, vérifié sans réseau pour qu'une panne du hub n'enferme
personne dehors. Voir l'ADR 0001 de Hubperso.

## 10. PCs

- **PC dev (sans Claude)** : G:\Mon disque\... — modifs code uniquement, push GitHub
- **PC cible 24/7** : C:\hub\... — Windows + RTX 5080, run le hub

GitHub = source de vérité unique entre les deux.
