// scripts/copiesAJour.mjs — juge si les copies de la convention ont dérivé de leur source.
//
// ── LE TROU QUE CE FICHIER BOUCHE ───────────────────────────────────────────────────
//
// Chaque dépôt vérifie DÉJÀ, dans sa propre CI, que SA copie de `docs/COMPTE-RENDU.md`
// n'a pas été éditée sur place (`sha256sum -c` contre une empreinte écrite dans son
// `ci.yml`). Ce contrôle-là attrape la main qui modifie une copie.
//
// Il n'attrape PAS l'autre sens : on modifie la SOURCE ici, on oublie de propager, et les
// huit dépôts restent VERTS avec une version périmée. Rien ne rougit nulle part — c'est le
// mode de panne le plus cher, parce qu'il ressemble trait pour trait au succès.
//
// D'où ce vérificateur, qui regarde depuis le seul endroit qui voit les neuf : ici.
//
// ── PUR ─────────────────────────────────────────────────────────────────────────────
//
// Aucun réseau, aucune horloge, aucun jeton. On lui passe le contenu de la source et ce
// qu'on a lu dans chaque dépôt ; il rend un verdict. Le transport est dans
// `verifierCopies.mjs` — c'est lui qui parle à GitHub, et c'est lui qu'on ne peut pas
// tester sans secret. La règle du dépôt : fonctions pures d'un côté, I/O de l'autre.

import { createHash } from "node:crypto";

/** Empreinte d'un contenu. Normalise la fin de ligne : un CRLF n'est pas une dérive de fond. */
export function empreinte(contenu) {
  const normalise = contenu.replace(/\r\n/g, "\n");
  return createHash("sha256").update(normalise, "utf8").digest("hex");
}

/**
 * États possibles d'une copie. Ils sont DISTINCTS parce qu'ils appellent des gestes
 * différents : une copie absente veut dire « ce dépôt n'a jamais reçu la convention »,
 * une copie dérivée veut dire « quelqu'un a modifié l'un des deux côtés », et une lecture
 * impossible veut dire « je ne sais pas » — ce qui n'est ni un succès ni un échec de fond.
 * Les confondre en un booléen ferait envoyer corriger le mauvais dépôt.
 */
export const ETATS = /** @type {const} */ (["a-jour", "derivee", "absente", "illisible"]);

/**
 * @param {{ source: string, copies: Array<{depot: string, contenu: string|null, erreur?: string|null}> }} params
 */
export function verifier({ source, copies }) {
  const attendue = empreinte(source);

  const resultats = copies.map(({ depot, contenu, erreur }) => {
    if (erreur) return { depot, etat: "illisible", detail: erreur };
    if (contenu === null) return { depot, etat: "absente", detail: "docs/COMPTE-RENDU.md introuvable" };
    const trouvee = empreinte(contenu);
    if (trouvee === attendue) return { depot, etat: "a-jour", empreinte: trouvee };
    return { depot, etat: "derivee", empreinte: trouvee, attendue };
  });

  // `illisible` compte comme un échec. Un vérificateur qui ne sait pas ne doit jamais
  // rendre vert : c'est exactement ainsi qu'on prend l'habitude de croire un run muet.
  const problemes = resultats.filter((r) => r.etat !== "a-jour");

  return { attendue, resultats, ok: problemes.length === 0, problemes };
}

/** Rapport lisible. Sépare ce qui va de ce qui ne va pas — on lit d'abord les problèmes. */
export function rapport(verdict) {
  const lignes = [`Empreinte de la source : ${verdict.attendue}`, ""];

  if (verdict.ok) {
    lignes.push(`Les ${verdict.resultats.length} copies sont à jour.`);
    return lignes.join("\n");
  }

  lignes.push(`${verdict.problemes.length} copie(s) à corriger :`, "");
  for (const p of verdict.problemes) {
    if (p.etat === "derivee") {
      lignes.push(`  ${p.depot} — DÉRIVÉE (${p.empreinte.slice(0, 12)}… au lieu de ${p.attendue.slice(0, 12)}…)`);
    } else {
      lignes.push(`  ${p.depot} — ${p.etat.toUpperCase()} : ${p.detail}`);
    }
  }
  lignes.push(
    "",
    "Pour corriger : copier conventions/COMPTE-RENDU.md dans docs/COMPTE-RENDU.md du dépôt,",
    "PUIS mettre à jour l'empreinte inscrite dans son .github/workflows/ci.yml.",
    "Les deux, sinon sa propre CI rougit à la place de celle-ci.",
  );
  return lignes.join("\n");
}
