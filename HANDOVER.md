# HANDOVER — claude-config

> L'état RÉEL des conventions communes et comment le vérifier. À lire en premier.
> **Dernière mise à jour** : 2026-08-21.

## TL;DR

Ce dépôt porte deux conventions communes aux neuf dépôts de l'écosystème. Elles ne sont
**pas** chargées par renvoi : chaque dépôt en garde une **copie synchronisée**, et sa CI
échoue si la copie a dérivé.

| Convention | Source | Copie dans les dépôts | Contrôle |
|---|---|---|---|
| `conventions/STRUCTURE-DEPOT.md` | ici | aucune — c'est une convention de FORME de fichier, appliquée à la main | aucun |
| `conventions/COMPTE-RENDU.md` | ici | `docs/COMPTE-RENDU.md` dans les 8 dépôts applicatifs | `sha256sum -c` dans chaque `ci.yml` |

## Le fait qui explique tout le montage

**Un `CLAUDE.md` ne charge rien hors de son propre arbre.** Un lien Markdown vers ce dépôt
est lisible par un humain ; il n'arrive jamais dans la session. C'est le mode de panne vécu
le 20/08/2026 — Marc avait écrit ses règles dans un `~/.claude/CLAUDE.md` local, constatait
« je ne vois pas la différence », et rien n'était jamais arrivé jusqu'aux sessions.

D'où le montage retenu (décision de Marc, 21/08/2026) : **copie synchronisée + contrôle CI**.
Chaque `CLAUDE.md` importe `@docs/COMPTE-RENDU.md`, et chaque `ci.yml` vérifie l'empreinte
sha256 de cette copie.

## Comment vérifier que ça tient

```bash
# L'empreinte qui fait foi
sha256sum conventions/COMPTE-RENDU.md

# Dans un dépôt : la copie doit rendre la MÊME
sha256sum docs/COMPTE-RENDU.md

# Et le ci.yml doit contenir cette empreinte
grep -o '[0-9a-f]\{64\}' .github/workflows/ci.yml
```

Le contrôle a été **prouvé discriminant** le 21/08 : un seul octet ajouté à une copie fait
sortir `sha256sum -c` en code 1.

## Faire évoluer la convention

1. Modifier `conventions/COMPTE-RENDU.md` **ici**, et rien d'autre.
2. Copier le fichier dans les 8 `docs/COMPTE-RENDU.md`.
3. Mettre à jour les 8 empreintes dans les 8 `.github/workflows/ci.yml`.
4. Une PR par dépôt.

La friction est volontaire. Une copie modifiable sur place redevient huit conventions
différentes en trois mois — c'est ce qui est arrivé aux trois règles de cadrage, recopiées
dans neuf `CLAUDE.md` le 20/08 et déjà divergentes le lendemain.

## Le contrôle dans l'autre sens

Le `sha256sum -c` de chaque dépôt attrape une copie **éditée sur place**. Il n'attrapait pas
une **source modifiée ici sans propagation** — cas où les huit dépôts restent VERTS avec une
version périmée, c'est-à-dire le mode de panne qui ressemble trait pour trait au succès.

C'est ce que ferme `.github/workflows/copies.yml` : deux jobs, l'un qui teste la logique
**sans réseau ni jeton** (`scripts/copiesAJour.mjs`, 8 tests), l'autre qui lit les huit copies
via l'API et compare. Il tourne à chaque push touchant `conventions/`, et une fois par jour.

✅ **Le secret `JETON_LECTURE_DEPOTS` est posé** (21/08/2026, 19:42) et le premier run est
vert. Vérifié dans sa SORTIE et pas seulement à sa couleur — « Les 8 copies sont à jour »,
avec l'empreinte de la source affichée.

⚠️ Il ÉCHOUE si le secret disparaît — pas de `continue-on-error`, pas de garde
`if: secrets…` qui sauterait le pas. Sauter le pas rendrait le job vert en n'ayant rien
vérifié : exactement la panne qu'on cherche à rendre visible.

Les quatre états rendus sont **distincts** parce qu'ils appellent des gestes différents :
`à jour` / `dérivée` / `absente` / `illisible`. Une lecture impossible (401, 403, 5xx) ne se
range PAS dans « absente » — sinon on croirait qu'un dépôt n'a jamais reçu la convention
alors que c'est la portée du jeton qui est en cause.

## Blocages / anomalies connues

- **`batchchef-` : réglé le 21/08, mais un geste reste à faire.** L'ancienne branche `main`
  — 75 commits, aucun ancêtre commun avec `master` — est conservée sur
  `archive/pre-web-2026-04-24`. ⚠️ La branche `main` elle-même **existe encore** : le proxy
  git de session refuse les suppressions de branche en `403`. À supprimer à la main par Marc.
  `BACKLOG.md`, `CC-03`.
- **`app-template` : réglé le 21/08.** Sa branche par défaut, `claude/hopeful-lovelace-4d09zx`,
  a été renommée `main` par Marc.

## Historique des sessions

- **2026-08-21** — Déploiement de `conventions/COMPTE-RENDU.md` : création, amendement sur
  trois arbitrages de Marc (porte de plan, marqueurs de statut, effort vs volume), audit des
  neuf `CLAUDE.md`, propagation dans les 8 dépôts applicatifs avec contrôle CI d'identité.
  Puis, sur ses arbitrages du soir : vérificateur bidirectionnel des copies (CC-01), coupure
  des prévisualisations Vercel sur `claude/*` (CC-06), plafonds de temps sur 20 jobs de CI
  (CC-07), renvoi de `/lesson.md` corrigé (CC-05). Suppression du `main` de BatchChef
  **arrêtée** après vérification (CC-03).
