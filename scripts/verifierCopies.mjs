#!/usr/bin/env node
// scripts/verifierCopies.mjs — le TRANSPORT. Lit les huit copies via l'API GitHub et
// passe le tout à la logique pure de `copiesAJour.mjs`, qui juge.
//
// ⚠️ CE SCRIPT ÉCHOUE S'IL N'A PAS DE JETON, plutôt que de rendre « 0 dépôt vérifié, tout
// va bien ». Un run qui ne vérifie rien ne doit pas ressembler à un run vert — c'est la
// même garde que `npm run constellation` dans Hubperso, et elle est là pour la même
// raison : le jour où le secret expire, on veut le voir, pas hériter d'un vert vide.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { verifier, rapport } from "./copiesAJour.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(ICI, "..", "conventions", "COMPTE-RENDU.md");
const CHEMIN_COPIE = "docs/COMPTE-RENDU.md";

/**
 * Les huit dépôts et LEUR branche de tronc — qui n'est pas `main` partout.
 * BatchChef vit sur `master` : son `main` est une histoire SANS ANCÊTRE COMMUN, pas une
 * vieille copie (constaté le 21/08/2026). Interroger la mauvaise branche rendrait un
 * verdict faux avec l'aplomb d'un verdict vrai.
 */
const DEPOTS = [
  { depot: "MoKarade/Hubperso", branche: "main" },
  { depot: "MoKarade/app-template", branche: "main" },
  { depot: "MoKarade/batchchef-", branche: "master" },
  { depot: "MoKarade/CarAI", branche: "main" },
  { depot: "MoKarade/DriveAI", branche: "main" },
  { depot: "MoKarade/FinanceAI", branche: "main" },
  { depot: "MoKarade/hub-contract", branche: "main" },
  { depot: "MoKarade/JobAI", branche: "main" },
];

async function lireCopie({ depot, branche }, jeton) {
  const url = `https://api.github.com/repos/${depot}/contents/${CHEMIN_COPIE}?ref=${branche}`;
  let reponse;
  try {
    reponse = await fetch(url, {
      headers: {
        authorization: `Bearer ${jeton}`,
        accept: "application/vnd.github.raw+json",
        "x-github-api-version": "2022-11-28",
      },
      signal: AbortSignal.timeout(15_000),
    });
  } catch (err) {
    return { depot, contenu: null, erreur: `injoignable — ${err.message}` };
  }

  // 404 = la copie n'existe pas : c'est « absente », un état de fond.
  if (reponse.status === 404) return { depot, contenu: null };
  // Tout le reste (401, 403, 5xx) est un « je ne sais pas » — surtout PAS « absente ».
  // Confondre les deux ferait croire qu'un dépôt n'a jamais reçu la convention alors que
  // c'est le jeton qui n'a pas la portée.
  if (!reponse.ok) {
    return { depot, contenu: null, erreur: `HTTP ${reponse.status}` };
  }
  return { depot, contenu: await reponse.text() };
}

const jeton = process.env.JETON_LECTURE_DEPOTS;
if (!jeton) {
  console.error(
    "Aucun jeton dans JETON_LECTURE_DEPOTS.\n" +
      "Ce script REFUSE de tourner à vide : un run qui ne vérifie rien rendrait un vert\n" +
      "qui ne veut rien dire. Poser le secret (portée : Contents lecture seule sur les huit\n" +
      "dépôts) dans Settings → Secrets → Actions de ce dépôt.",
  );
  process.exit(1);
}

const source = readFileSync(SOURCE, "utf8");
const copies = await Promise.all(DEPOTS.map((d) => lireCopie(d, jeton)));
const verdict = verifier({ source, copies });

console.log(rapport(verdict));
process.exit(verdict.ok ? 0 : 1);
