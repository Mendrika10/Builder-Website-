# Trello — Suivi d'exécution du sprint

> Trello est l'outil de **suivi visuel** de l'équipe. La source de vérité du contenu reste `docs/backlog/` ; le board Trello reflète les statuts.
> Gouvernance : [AGENTS.md](../../AGENTS.md) · Collaboration : [charter.md](charter.md)

## Board

**Nom** : `Site.mg — Sprint Board`

## Listes (= statuts AGENTS.md §9, dans l'ordre des gates du charter §3)

| # | Liste | Ce qui s'y trouve |
|---|---|---|
| 1 | `BACKLOG` | Tâches non planifiées |
| 2 | `READY` | Planifiées, dépendances vérifiées, prêtes à développer |
| 3 | `IN PROGRESS` | En développement (owner = agent assigné) |
| 4 | `BLOCKED` | Bloquées — la carte cite la dépendance et la piste de déblocage |
| 5 | `IN REVIEW` | En Code Review (gate Reviewer) |
| 6 | `QA` | En validation QA (gate QA) |
| 7 | `DONE` | DoD complète (AGENTS.md §10) — archivées en fin de sprint |

## Labels (= agents, couleur unique par agent)

`👑 orchestrator` · `📋 product-owner` · `🏗️ architect` · `🎨 ui-art-director` ·
`💻 frontend` · `⚙️ backend` · `🗄️ database` · `🧪 qa` · `🔐 security` ·
`🔍 reviewer` · `🚀 devops` · `📚 documentation`

## Cartes

* **Titre** : `ID — Titre court` (ex. `FOND-001 — Scaffold monorepo`).
* **Description** : tâche Owner + dépendances + Acceptance Criteria, copiés depuis `docs/backlog/sprint-NN.md`.
* **Checklist** : les Acceptance Criteria, cochées au fur et à mesure — une carte n'entre dans `DONE` que checklist complète.
* **Membres** : l'agent owner (mappé sur un membre Trello du board).

## Règles de déplacement (gates du charter)

```text
→ IN PROGRESS   le developer commence (dépendances OK)
→ BLOCKED       dès identification + piste de déblocage en description
→ IN REVIEW     implémentation + self-review + lint/typecheck/tests verts
→ QA            Code Reviewer APPROVED
→ DONE          QA validée + DoD complète
```

Un déplacement qui saute une gate est une violation du charter.

## Création / synchronisation du board

Le script `scripts/trello/sync.mjs` crée le board, les listes et les cartes du sprint courant depuis `scripts/trello/sprint-data.json` via l'API Trello (fetch natif Node, aucune dépendance).

### Obtenir les credentials (une seule fois)

1. https://trello.com/power-ups/admin → **Créer un Power-Up** :
   * Espace de travail, e-mail, auteur : vos valeurs
   * **URL du connecteur iframe** : `https://example.com` suffit (champ obligatoire, inutilisé par le script)
2. ⚠️ **La section « OAuth 2.0 » ne sert pas** (son client ID n'est pas la clé API ; l'alerte « URL de rappel » peut être ignorée).
3. Dans le menu du Power-Up, ouvrir **« Authentification Trello »** → y figure la **Clé API** (32 caractères) → `TRELLO_API_KEY`
4. Autoriser le token (remplacer `TA_CLE` par la clé API) :
   `https://trello.com/1/authorize?expiration=30days&name=Site.mg&scope=read,write&response_type=token&key=TA_CLE`
   → le **Token** affiché → `TRELLO_TOKEN`
5. Mettre les deux dans `.env` (gitigné).

### Synchroniser

```bash
npm run trello:sync
```

Le script est idempotent : relancer ne duplique rien.

Les credentials restent dans `.env` (jamais commités — [règle Security](../../AGENTS.md#22-règle-security)).
