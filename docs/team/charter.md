# Team Charter — Équipe d'agents Site.mg

> Complète [AGENTS.md](../../AGENTS.md) (qui fait quoi) en définissant **comment on travaille ensemble**.
> Chaque agent, à chaque session, applique ce charter. En cas de doute de comportement : ce document prime pour la collaboration, AGENTS.md pour les responsabilités techniques.

---

## 1. Nos valeurs de travail

```text
1. PROFESSIONNALISME   — qualité constante, même sur les petites tâches
2. FIABILITÉ           — ce qui est annoncé DONE est vraiment DONE (DoD vérifiée)
3. TRANSPARENCE        — statuts réels, blocages annoncés tôt, jamais de cache
4. RESPECT DU CADRE    — chaque agent reste dans son rôle, escalade au lieu de déborder
5. COLLECTIF D'ABORD   — le produit gagne, pas l'ego de l'agent ; le travail d'autrui est protégé
```

## 2. RACI — qui décide quoi

**R** fait · **A** approuve (1 seul) · **C** consulté · **I** informé

| Décision / livrable | R | A | C | I |
|---|---|---|---|---|
| Priorités du backlog, Acceptance Criteria | Orchestrator | **Product Owner** | Architect, UX/Art Director | Tous |
| Architecture, patterns, ADR | Architect | **Lead Architect** | Backend/Frontend Leads, DB | Orchestrator |
| Direction artistique, design tokens | UI Art Director | **UI Art Director** | Product Owner, Frontend Lead | Frontend Dev |
| Contrats d'API (DTO, routes) | Backend Lead | **Backend Lead** | Frontend Lead | Devs |
| Schéma DB, migrations | Database Engineer | **Database Engineer** | Backend Lead | Devs, QA |
| Code frontend / backend | Dev concerné | **Code Reviewer** | Lead du domaine | Orchestrator |
| Sécurité | Tous | **Security Engineer** | Leads | Tous |
| Critères « ça marche » | QA | **QA Engineer** | Product Owner | Tous |
| Merge PR feature → preprod | Developer | **Code Reviewer** | Security, QA | Orchestrator |
| Déploiement, CI | DevOps | **DevOps Engineer** | Leads | Tous |

Règle : **une seule approbation (A) par décision** — jamais de validation en solo par l'auteur (voir [AGENTS.md §4.12](../../../AGENTS.md#412--code-reviewer)).

## 3. Gates de handoff (qualité avant de passer la main)

Une tâche ne franchit une étape que si la précédente est franchie :

```text
PO (spécifié) → Art Director (designé) → Architect (contracté)
      ↓
Developer (implémenté + self-review) → Code Reviewer (APPROVED)
      ↓
QA (validé) → Security (verrouillé) → DevOps (intégré) → DONE
```

Chaque handoff exige : la tâche à jour dans `docs/backlog/sprint-NN.md`, les livrables annoncés, et un statut honnête.

Les gates Developer → Reviewer → QA empruntent une **Pull Request** (détails [§9](#9-git--pull-requests--workflow-de-livraison)).

## 4. Communication

**Format structuré** (voir [AGENTS.md §13](../../../AGENTS.md#13-communication-entre-agents)) pour tout handoff ou blocage : FROM / TO / SUBJECT / CONTEXT / REQUIRED / DEPENDENCY / STATUS.

**Règles :**

* Ne jamais supposer : une information manquante est demandée, pas devinée ([AGENTS.md §37](../../../AGENTS.md#37-règle-en-cas-dincertitude)).
* Un blocage est signalé **dès qu'il est identifié**, avec ce qui le débloquerait.
* Une contradiction entre docs est signalée à l'Orchestrator, pas contournée.
* Le code existant est lu et respecté avant modification ([AGENTS.md §38](../../../AGENTS.md#38-règle-de-modification-du-code)).

## 5. Escalade

```text
Désaccord technique entre 2 agents   → Leads concernés tranchent
Désaccord sur les priorités          → Orchestrator → Product Owner
Désaccord architectural              → Lead Architect → ADR
Violations (DoD, sécurité, secrets)  → Orchestrator + agent fautif corrigent
Blocage > 1 tâche                    → Orchestrator réajuste le sprint
```

Escalader n'est pas un échec : c'est la procédure normale. Le seul vrai échec est de laisser passer un problème connu.

## 6. Rituels de l'équipe

| Rituel | Quand | Contenu |
|---|---|---|
| Sprint Planning | Début de sprint | Goal, stories, dépendances, DoD (AGENTS.md §6) |
| Suivi de sprint | Chaque session | Statuts à jour dans `sprint-NN.md` **et sur le board Trello** ([trello.md](trello.md)), blocages listés |
| Sprint Review | Fin de sprint | Démo des stories DONE vs Acceptance Criteria (§34) |
| Rétrospective | Après review | What went well / not well / to change (§35) → actions concrètes |
| Revue d'ADR | À chaque décision | Proposé → Accepted après implémentation validée |

## 7. Protocole de session d'agent (à chaque session)

1. **Lire** AGENTS.md + ce charter + le sprint courant.
2. **Situer** : quelle tâche prend-on ? Quel est son statut réel ?
3. **Vérifier les dépendances** avant de coder ([AGENTS.md §14](../../../AGENTS.md#14-gestion-des-dépendances)).
4. **Travailler dans son rôle** : handoffs par les gates (§3), RACI respecté (§2).
5. **Déplacer sa carte Trello** à chaque changement de gate (les règles de déplacement sont dans [trello.md](trello.md)).
6. **Mettre à jour** le sprint et les docs en fin de session — un travail non documenté est un travail non fait.
7. **Livrer via Git** : branche feature, commits par feature, PR ouverte avant la gate Reviewer ([§9](#9-git--pull-requests--workflow-de-livraison)).

## 8. Interdits absolus (qualité pro)

```text
✗ Se valider soi-même comme unique reviewer
✗ Annoncer DONE sans la Definition of Done complète
✗ Committer des secrets ou modifier la production sans procédure
✗ Écraser le travail d'un autre agent sans coordination
✗ Installer une dépendance majeure sans validation du Lead (§18 AGENTS.md)
✗ Marquer BLOCKED sans proposer de piste de déblocage
✗ Garder une information importante pour soi
```

## 9. Git & Pull Requests — workflow de livraison

> Détail des conventions : [AGENTS.md §11](../../AGENTS.md#11-git-workflow) (branches, Conventional Commits) et [§12](../../AGENTS.md#12-pull-request-workflow) (cycle PR). Ici : comment l'équipe livre, concrètement.

### 9.1 Branches

```text
main      ← production. Protégée : merge uniquement via PR verte (CI OK)
preprod   ← intégration. PR feature → preprod, PR preprod → main en fin de sprint
feature/<carte>   ← une branche par carte Trello (ex. feature/auth-001-register)
```

**Règles :**
- Une branche `feature/<id-carte>` par carte — jamais de commit direct sur `preprod`/`main`.
- `preprod` toujours déployable ; `main` toujours livrable.
- Fins de sprint : une PR `preprod → main` par sprint (livraison du sprint).

### 9.2 Commits par feature

- **Un commit par carte Trello** (ou par livrable cohérent) — Conventional Commits (AGENTS.md §11) : `feat(auth-001): ...`, `fix: ...`, `docs: ...`.
- Message focalisé sur le **pourquoi**, carte référencée ; portée = id de carte quand il y en a une.
- Jamais de secrets, jamais d'artefacts de build (`*.tsbuildinfo`, `dist/`, clients générés) — `.gitignore` fait respecter.

### 9.3 Cycle de livraison d'une carte

```text
Carte READY → git checkout -b feature/auth-001-register (depuis preprod)
  → implémentation + commits par feature
  → push + Pull Request feature/... → preprod
  → gate Code Reviewer (§4.12) sur la PR        → APPROVED
  → gate QA (§4.10) sur la PR                    → PASS
  → merge (squash ou merge commit) → carte DONE
Fin de sprint : PR preprod → main → CI verte → merge = sprint livré
```

La PR **remplace le handoff informel** : c'est le support des gates Reviewer/QA, avec la CI obligatoirement verte avant merge.

### 9.4 RACI Git (complète le §2)

| Action | R | A |
|---|---|---|
| Branche + commits feature | Developer | — |
| Ouverture de la PR (description : AC, tests, preuves) | Developer | — |
| Merge feature → preprod | Code Reviewer approuve, **QA valide** | **Code Reviewer** |
| Merge preprod → main (fin de sprint) | DevOps prépare | **Product Owner** |
| Hotfix : branche `hotfix/...` depuis `main`, PR dédiée, puis report sur `preprod` | Developer | **Code Reviewer** |

### 9.5 Interdits Git

```text
✗ Commit direct sur main ou preprod (tout passe par PR)
✗ Forcer un push (git push --force) sur une branche partagée
✗ Merger avec la CI rouge ou sans les gates Reviewer/QA
✗ Self-merge d'une PR par son auteur
✗ Un commit « fourre-tout » mélangeant plusieurs cartes
✗ Committer des secrets (.env, tokens) — voir §22 AGENTS.md
```

---

## 10. Signature d'équipe

Chaque agent peut faire appel à un autre ; aucun agent ne travaille isolément quand un handoff est requis. L'équipe livre **ensemble** ou n'a rien livré : une fonctionnalité n'est terminée que si PO, Architect, Dev, Reviewer, QA et Security l'ont traversée selon les gates ci-dessus.
