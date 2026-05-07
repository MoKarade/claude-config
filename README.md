# claude-config — config Claude Code globale de Marc

Config personnelle réutilisable sur tous mes projets : agents spécialisés, skills, slash commands, rules par langage, et mes règles personnelles (français, no fake data, stack ennuyeuse, etc.).

## Origine du contenu

| Source | Quoi | Licence |
|---|---|---|
| [`affaan-m/everything-claude-code`](https://github.com/affaan-m/everything-claude-code) | 48 agents · 182 skills · 68 commands · 89 rules · mcp-configs | MIT (cf. `LICENSE.everything-claude-code`) |
| Personnel | `CLAUDE.md`, `bootstrap.ps1`, `bootstrap.sh`, `README.md` | Privé |

## Quick start

### Windows (PC cible)

```powershell
git clone https://github.com/MoKarade/claude-config C:\claude-config
cd C:\claude-config
# Activer Developer Mode pour symlinks (Settings > Privacy & security > For developers)
.\bootstrap.ps1
```

### Linux/Mac

```bash
git clone https://github.com/MoKarade/claude-config ~/claude-config
cd ~/claude-config
./bootstrap.sh
```

## Modes de bootstrap

- `symlink` (default) : `~/.claude/agents` → `<repo>/agents`. `git pull` = MAJ auto.
- `copy` : copies fixes. Relancer après chaque `git pull`.
- `-Force` : écrase l'existant (backup auto dans `~/.claude/.backup-<ts>/`)
- `-DryRun` : affiche sans rien faire

## Top 10 agents

`code-reviewer`, `security-reviewer`, `planner`, `architect`, `python-reviewer`, `typescript-reviewer`, `tdd-guide`, `silent-failure-hunter`, `refactor-cleaner`, `performance-optimizer`. Liste complète : `ls ~/.claude/agents/`.

## Top slash commands

`/code-review`, `/feature-dev`, `/build-fix`, `/quality-gate`, `/checkpoint`, `/aside`, `/instinct-status`, `/auto-update`, `/evolve`. Liste complète : `ls ~/.claude/commands/`.

## Conflits ECC vs règles Marc

`CLAUDE.md` §8 : **règles Marc prévalent** (français, no fake data, no emoji par défaut, stack ennuyeuse).

## Sync entre 2 PC

```bash
# Modifier puis push
git add . && git commit -m "feat: ..." && git push

# Sur l'autre PC
git pull
# Mode symlink : pris en compte direct
# Mode copy : ./bootstrap.sh --force (ou .\bootstrap.ps1 -Force)
```

## Maintenance

### Sync ECC vers nouvelle version

```bash
git clone --depth 1 https://github.com/affaan-m/everything-claude-code /tmp/ecc
cd ~/claude-config
rm -rf agents skills commands rules mcp-configs
cp -r /tmp/ecc/{agents,skills,commands,rules,mcp-configs} .
cp /tmp/ecc/LICENSE LICENSE.everything-claude-code
git add . && git commit -m "chore: sync ECC" && git push
```

### Ajouter un agent custom

```bash
cat > agents/mon-agent-perso.md <<'EOF'
---
name: mon-agent-perso
description: Quand l'utiliser
tools: ["Read", "Grep", "Bash"]
model: sonnet
---

(corps du prompt en FR)
EOF

git add agents/mon-agent-perso.md
git commit -m "feat: agent perso"
git push
```

## Liens

- ECC source : https://github.com/affaan-m/everything-claude-code
- Claude Code docs : https://docs.claude.com/en/docs/claude-code
