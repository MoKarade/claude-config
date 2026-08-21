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

## Ce que le contrôle NE couvre pas

⚠️ **Une modification de la source SANS propagation ne déclenche rien.** La CI d'un dépôt ne
peut pas lire `claude-config` (dépôt privé, il faudrait un jeton dans chacun des huit). Le
contrôle attrape une copie éditée sur place ; il n'attrape pas une source qui a avancé seule.
Dit ici plutôt que passé sous silence — voir `BACKLOG.md`, `CC-01`.

## Blocages / anomalies connues

- **`app-template` n'a pas de branche `main`.** Sa branche par défaut est
  `claude/hopeful-lovelace-4d09zx`, et c'est bien elle qui porte l'historique mergé
  (PR #4 à #7). Constaté le 21/08/2026. À renommer, probablement — voir `BACKLOG.md`, `CC-02`.
- **`batchchef-` a `master` ET `main`.** `master` est le tronc (son `CLAUDE.md` §3 le dit) ;
  `main` est resté figé au 2026-04-24. Voir `BACKLOG.md`, `CC-03`.

## Historique des sessions

- **2026-08-21** — Déploiement de `conventions/COMPTE-RENDU.md` : création, amendement sur
  trois arbitrages de Marc (porte de plan, marqueurs de statut, effort vs volume), audit des
  neuf `CLAUDE.md`, propagation dans les 8 dépôts applicatifs avec contrôle CI d'identité.
