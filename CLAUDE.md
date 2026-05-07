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

- ✅ ADR pour décisions architecturales (`decisions/<NNNN>-<slug>.md`).
- ✅ Journal de session (`JOURNAL.md`) tenu à chaque session importante.
- ✅ Mettre à jour la doc quand on change le code (doc périmée = pire que pas de doc).
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

| Projet | Repo | Stack | Statut |
|---|---|---|---|
| **Personal Data Hub** | `MoKarade/hub` | Python 3.13 / FastAPI / Next.js 15 / Postgres+pgvector / Ollama | Phase 7+ — production-ready |

## 10. PCs

- **PC dev (sans Claude)** : G:\Mon disque\... — modifs code uniquement, push GitHub
- **PC cible 24/7** : C:\hub\... — Windows + RTX 5080, run le hub

GitHub = source de vérité unique entre les deux.
