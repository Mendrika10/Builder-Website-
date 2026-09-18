# Sprint 05 — Thèmes, images et analytics

> **Goal du sprint** : le site publié reflète **l'identité de son propriétaire** (thème de couleur), héberge **ses propres images** (upload), et son **audience devient visible** (compteur de vues).
> Workflow de livraison : charter [§9](../team/charter.md) — une branche `feature/<carte>` et une PR par carte, CI obligatoirement verte.

Dépendances : Sprint 04 ✔ DONE (multipage, blocs riches, SEO).

---

### US-060 — Thème de couleur du site — `READY`

Owner: Backend + Frontend · Dépend de: US-042 (✅ Sprint 03)

**Tasks**

| ID | Tâche | Owner |
|---|---|---|
| THEME-001 | Migration : `theme` (varchar 20, défaut `indigo`) sur Site + accepté dans PATCH /sites/:id | ⚙️ backend |
| THEME-002 | Palette de thèmes prédéfinis (indigo, emeraude, orange, rose, ocean) — variables CSS partagées | 💻 frontend |
| THEME-003 | Éditeur : sélecteur de thème (aperçu immédiat) + application au rendu BlocView | 💻 frontend |
| THEME-004 | QA : thème persisté, visible sur la preview ET le site public | 🧪 qa |

**Acceptance Criteria**

- Le propriétaire choisit parmi 5 thèmes prédéfinis (pas de couleur libre en v1 : cohérence design)
- Le thème est appliqué à la prévisualisation et au site public, persisté en base
- Un thème inconnu est rejeté par l'API (validation)

---

### US-061 — Upload d'images — `READY`

Owner: Backend + Frontend · Dépend de: US-051 (✅ Sprint 04)

**Tasks**

| ID | Tâche | Owner |
|---|---|---|
| IMG-001 | API : `POST /uploads` (multer mémoire, jpg/png/webp ≤ 2 Mo), fichier servi en statique `/uploads/*` | ⚙️ backend |
| IMG-002 | Éditeur : champ image = upload OU URL externe, retour d'URL relative | 💻 frontend |
| IMG-003 | QA : upload réel, bloc image avec image uploadée rendu en public | 🧪 qa |

**Acceptance Criteria**

- Seuls jpg/png/webp ≤ 2 Mo sont acceptés (415 sinon) ; le nom est régénéré (uuid + extension sûre)
- Les fichiers sont servis par l'API (limités au dossier uploads)
- L'utilisateur peut choisir entre une URL externe et un fichier local

---

### US-062 — Compteur de vues — `READY`

Owner: Backend + Frontend · Dépend de: US-040 (✅ Sprint 03)

**Tasks**

| ID | Tâche | Owner |
|---|---|---|
| VIEW-001 | Migration : `vues` (int, défaut 0) sur Site + `POST /public/sites/:slug/view` (increment atomique) | ⚙️ backend |
| VIEW-002 | Page publique : incrément au chargement (client) + affichage discret du compteur dans le footer | 💻 frontend |
| VIEW-003 | Tests e2e : increment, vue publique seulement | 🧪 qa |

**Acceptance Criteria**

- Chaque visite d'une page publique incrémente le compteur du site (une fois par session en v1 simple : à chaque chargement)
- Le compteur n'apparaît que sur le site public (pas dans l'éditeur)
- Endpoint public sûr : increment atomique, 404 si site non publié

---

## Definition of Done (rappel, voir [AGENTS.md §10](../../AGENTS.md#10-definition-of-done))

```text
[ ] Fonctionnalité implémentée          [ ] Sécurité vérifiée
[ ] Acceptance Criteria respectés       [ ] Responsive si frontend
[ ] TypeScript valide                   [ ] Code review terminé (sur PR)
[ ] Lint valide                         [ ] Documentation à jour
[ ] Tests passés                        [ ] CI verte sur la PR
```
