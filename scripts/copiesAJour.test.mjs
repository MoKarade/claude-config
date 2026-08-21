// Tests de la logique pure. `node --test`, aucune dépendance : ce dépôt n'a pas de
// package.json et n'a pas à en gagner un pour être testé.

import { test } from "node:test";
import assert from "node:assert/strict";
import { empreinte, verifier, rapport } from "./copiesAJour.mjs";

const SOURCE = "# Convention\n\nDu texte.\n";

test("une copie identique est à jour", () => {
  const v = verifier({ source: SOURCE, copies: [{ depot: "Hubperso", contenu: SOURCE }] });
  assert.equal(v.ok, true);
  assert.equal(v.resultats[0].etat, "a-jour");
});

test("un seul octet de différence suffit à faire échouer", () => {
  const v = verifier({ source: SOURCE, copies: [{ depot: "JobAI", contenu: SOURCE + "x" }] });
  assert.equal(v.ok, false);
  assert.equal(v.problemes[0].etat, "derivee");
});

test("une fin de ligne Windows n'est PAS une dérive", () => {
  // Sinon le vérificateur rougirait sur un dépôt cloné depuis le PC Windows de Marc,
  // pour une raison qui n'a rien à voir avec le contenu de la convention.
  const v = verifier({ source: SOURCE, copies: [{ depot: "CarAI", contenu: SOURCE.replace(/\n/g, "\r\n") }] });
  assert.equal(v.ok, true);
});

test("une copie absente et une copie dérivée ne se confondent pas", () => {
  const v = verifier({
    source: SOURCE,
    copies: [{ depot: "A", contenu: null }, { depot: "B", contenu: "autre" }],
  });
  assert.deepEqual(v.problemes.map((p) => p.etat), ["absente", "derivee"]);
});

test("une lecture impossible fait ÉCHOUER, elle ne passe pas pour un succès", () => {
  // Le point qui compte : « je ne sais pas » ne doit jamais ressembler à « tout va bien ».
  const v = verifier({ source: SOURCE, copies: [{ depot: "A", contenu: null, erreur: "HTTP 403" }] });
  assert.equal(v.ok, false);
  assert.equal(v.problemes[0].etat, "illisible");
});

test("zéro copie ne rend pas un vert vide", () => {
  // Un run qui ne vérifie rien rendrait ok:true ici. C'est le transport qui doit refuser
  // de tourner sans cible — mais on fige le comportement pour qu'on s'en souvienne.
  const v = verifier({ source: SOURCE, copies: [] });
  assert.equal(v.ok, true, "la fonction pure est neutre — la garde est dans verifierCopies.mjs");
});

test("le rapport nomme le dépôt fautif et dit quoi faire", () => {
  const v = verifier({ source: SOURCE, copies: [{ depot: "DriveAI", contenu: "autre" }] });
  const texte = rapport(v);
  assert.match(texte, /DriveAI/);
  assert.match(texte, /DÉRIVÉE/);
  assert.match(texte, /ci\.yml/);
});

test("l'empreinte est celle de sha256sum sur le contenu normalisé", () => {
  assert.equal(empreinte("a\n"), empreinte("a\r\n"));
  assert.notEqual(empreinte("a\n"), empreinte("b\n"));
  assert.equal(empreinte("").length, 64);
});
