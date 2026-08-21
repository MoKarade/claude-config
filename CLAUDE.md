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
