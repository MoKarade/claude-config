# Structure commune des dépôts du hub perso

> **Source de vérité unique.** Cette convention est écrite ICI et nulle part ailleurs.
> Chaque dépôt s'y conforme et y renvoie ; aucun ne la recopie.
>
> La raison n'est pas cosmétique. Le 19-20/08/2026, un audit des huit dépôts a trouvé la
> même règle écrite dans quatre fichiers différents, avec quatre formulations et **trois
> états de vérité différents** : « une seule adresse admise » survivait dans les README
> alors que le code avait deux étages depuis cinq jours. Une règle tenue à N endroits
> diverge toujours, et c'est l'exemplaire le moins relu qui gagne.

## Les huit dépôts

| Dépôt | Rôle |
|---|---|
| `Hubperso` | Le tableau de bord. Consomme le contrat, ne le définit pas. |
| `hub-contract` | Le contrat partagé (types + schémas Zod). Source de vérité du format. |
| `app-template` | Le squelette d'une nouvelle app. Ce qu'on forke. |
| `FinanceAI` · `DriveAI` · `BatchChef` · `JobAI` · `CarAI` | Les apps. |

## Arborescence

```
<racine>/
├── README.md          ← à quoi sert l'app, pour un lecteur extérieur
├── CLAUDE.md          ← comment on y travaille (structure ci-dessous)
├── HANDOVER.md        ← l'état RÉEL : ce qui tourne, ce qui reste à poser
├── BACKLOG.md         ← ce qui est décidé mais pas fait
└── docs/
    ├── adr/           ← 0001-slug.md, 0002-slug.md … décisions architecturales
    └── *.md           ← documents thématiques (DEPLOIEMENT, LESSONS, ARCHITECTURE…)
```

**Points fixés, parce qu'ils divergeaient :**

- Les ADR vont dans **`docs/adr/`**, jamais dans `decisions/` à la racine ni dans un
  `decisions.md` unique. Numérotés `NNNN-slug.md`, à quatre chiffres.
- `BACKLOG.md` est à la **racine**, pas dans `docs/`.
- Un fichier daté (`AUDIT_2026-08-12.md`, `PLAN_CHANTIERS_2026-06-19.md`) est un **récit**,
  pas une référence. Il vit dans `docs/` et **ne se met pas à jour** : sa date dit à quoi il
  correspond. Ce qui doit rester vrai va dans un document sans date.

## Le squelette de `CLAUDE.md`

Mêmes titres, **même ordre**, numérotés. Une section qui ne s'applique pas au dépôt est
**omise** — jamais laissée vide ni remplie pour faire nombre. La numérotation reste celle de
la liste ci-dessous : un dépôt sans intégration hub passe de 7 à 9, et c'est le signe visible
qu'il n'en a pas.

| # | Titre | Contenu |
|---|-------|---------|
| — | *(en-tête)* | Le projet en une phrase, la stack, la destination. Avant tout titre. |
| 1 | **Principes non négociables** | Ce qu'on ne fait jamais, et POURQUOI. La section qui compte. |
| 2 | **Conventions de code** | Langue, typage, style, nommage. |
| 3 | **Workflow git** | Branches, commits, PR. |
| 4 | **Commandes utiles** | Ce qu'on tape vraiment. |
| 5 | **Vérifications avant commit** | Le gate, en un bloc copiable. |
| 6 | **Après un merge : vérifier le DÉPLOIEMENT, pas seulement la CI** | Texte commun, ci-dessous. |
| 7 | **Intégration hub** | Ce que l'app publie, et le jeton dans ses DEUX sens. |
| 8 | **Documentation (où vit quoi)** | Une ligne par document, ce qu'il contient. |
| 9 | **Leçons apprises** | Les règles durables, tirées de vrais incidents. |
| 10 | **Style** | Renvoi au `CLAUDE.md` global de Marc. |

### Comment écrire un principe non négociable

Un principe se juge à sa capacité d'arrêter quelqu'un qui allait faire l'erreur. Donc :

- **Ce qu'on s'interdit**, pas ce qu'on souhaite. « Jamais de `--force` sur main » arrête ;
  « faire attention aux force-push » n'arrête personne.
- **Le pourquoi, avec l'incident.** Une règle sans sa raison se contourne à la première
  occasion qui semble en valoir la peine. « Vécu le 31/07 : quatre projets Vercel ont cessé
  de déployer pendant 3 h » vaut dix lignes d'exhortation.
- **Le mode de panne**, quand il est silencieux. C'est l'information la plus chère : ce qui
  échoue bruyamment se corrige seul.

## Le texte commun de la section 6

À reprendre tel quel — il décrit un incident réel qui vaut pour tous les dépôts servis par
Vercel :

> **CI verte ne veut pas dire « en ligne ».** Ce sont deux systèmes indépendants : la CI juge
> le code, l'hébergeur construit et sert. Un merge peut passer le gate et ne jamais être
> déployé — la branche reste verte, le site continue de servir l'ancien build, et rien n'est
> rouge nulle part.
>
> Vécu le 31/07/2026 : quatre projets Vercel ont cessé de créer des déploiements pendant ~3 h.
> DriveAI et JobAI ont rattrapé au push suivant ; Hubperso et BatchChef n'en ont pas eu — leur
> commit d'en-têtes de sécurité est resté **cinq jours** en attente sans que personne ne le
> voie.
>
> Donc, après un merge qui change ce qui est SERVI : vérifier qu'un déploiement de production
> a bien été créé et qu'il est `READY`, puis **contrôler l'effet sur la réponse réelle** — un
> en-tête se lit dans la réponse, il ne se déduit pas du fichier source.
>
> Corollaire : un merge qui ne change QUE de la doc n'a pas de déploiement à vérifier. Le dire
> plutôt que de laisser croire qu'on a vérifié.

## Ce qui reste propre à chaque dépôt

La convention fixe la FORME. Elle ne dicte pas le contenu : les garde-fous de DriveAI (zone
protégée, aucune suppression) n'ont rien à voir avec ceux de CarAI (deux sources, hiérarchie).
Un dépôt peut ajouter des sections après la 10 — DriveAI et JobAI ont un « Protocole de
précision » que les autres n'ont pas besoin d'avoir.

**Ce qui ne se négocie pas, c'est l'ordre et les titres des sections qui existent** : une
session qui ouvre n'importe lequel des huit dépôts doit trouver les principes en 1 et le gate
en 5, sans chercher.
