# Sprint 05 — Thèmes, images et analytics

> **Goal du sprint** : le site publié reflète **l'identité de son propriétaire** (thème de couleur), héberge **ses propres images** (upload), et son **audience devient visible** (compteur de vues).
> Workflow de livraison : charter [§9](../team/charter.md) — une branche `feature/<carte>` et une PR par carte, CI obligatoirement verte.

Dépendances : Sprint 04 ✔ DONE (multipage, blocs riches, SEO).

---

### US-060 — Thème de couleur du site — `DONE`

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

### US-061 — Upload d'images — `DONE`

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

### US-062 — Compteur de vues — `DONE`

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

---

## Bilan Sprint 05 — DONE

| Story | Livré |
|---|---|
| **US-060** ✅ | 6 palettes de thème (indigo, émeraude, océan, rose, ambre, neutre) — migration `theme`, PATCH site validé, sélecteur dans l'éditeur, preview et site public thématisés (navigation comprise) |
| **US-061** ✅ | Upload d'images (multer, PNG/JPG/WebP ≤ 5 Mo), servies en statique via `StreamableFile`, champ « Téléverser » dans le bloc image |
| **US-062** ✅ | Compteur de vues — `POST /public/sites/:slug/view`, incrémenté au chargement des pages publiques, affiché dans l'éditeur |

**Gates** : 60/60 tests API PASS · CI verte (#19, #20) · QA réelle : thème Émeraude appliqué au site de Marie + compteur incrémenté en live.
**Incident** : le module `src/modules/uploads/` était ignoré par git (pattern `uploads/` non ancré dans `apps/api/.gitignore`) — corrigé en PR #19.

### Livraisons
- PR #18 planning · PR #19 fix gitignore · PR #20 release `preprod → main`
