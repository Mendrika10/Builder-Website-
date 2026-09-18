# Sprint 03 — Le builder visuel

> **Goal du sprint** : un utilisateur peut **éditer le contenu de son site (blocs) et le publier** sur une URL publique.
> Workflow de livraison : charter [§9](../team/charter.md) — une branche `feature/<carte>` et une PR par carte, CI obligatoirement verte.

Dépendances : Sprint 02 ✔ DONE (auth JWT, plans, CRUD sites).

---

### US-040 — Pages d'un site (backend) — `READY`

Owner: Backend · Dépend de: US-030 (✅ Sprint 02)

**Tasks**

| ID | Tâche | Owner |
|---|---|---|
| PAGE-001 | Migration : model `Page` (titre, slug unique par site, contenu JSON, ordre) + relation Site→pages | 🗄️ database |
| PAGE-002 | API pages : `POST /sites/:siteId/pages`, `GET /sites/:siteId/pages`, `PUT /pages/:id`, `DELETE /pages/:id` (ownership + slug auto) | ⚙️ backend |
| PAGE-003 | Publication : `POST /sites/:siteId/publish` (statut `publie` + date) / `unpublish`, et `GET /public/sites/:slug` public (site publié + pages) | ⚙️ backend |
| PAGE-004 | Tests e2e : CRUD pages, ownership, publication, endpoint public 200/404 | 🧪 qa |

**Acceptance Criteria**

- Le contenu d'une page est du JSON typé (blocs : hero, texte, cta) validé à l'entrée
- Seul le propriétaire du site peut créer/modifier/supprimer ses pages (404 sinon)
- `GET /public/sites/:slug` répond 200 uniquement si le site est **publié** (404 sinon, sans fuite d'info)
- Parcours e2e complet : page → édition → publication → visible en public

---

### US-041 — Éditeur visuel (frontend) — `READY`

Owner: Frontend · Dépend de: US-040

**Tasks**

| ID | Tâche | Owner |
|---|---|---|
| PAGE-005 | Page `/dashboard/sites/[id]` : éditeur de la page d'accueil (ajout/suppression/réordonnancement de blocs) | 💻 frontend |
| PAGE-006 | Prévisualisation live des blocs (composants partagés tokens design) + sauvegarde `PUT /pages/:id` | 💻 frontend |
| PAGE-007 | QA : typecheck/lint + parcours réel sur la preview (édition → sauvegarde → reload) | 🧪 qa |

**Acceptance Criteria**

- L'utilisateur ajoute, modifie, déplace et supprime des blocs (hero / texte / CTA)
- La prévisualisation reflète le contenu en cours (pas seulement la sauvegarde)
- Les modifications sont persistées et survivent à un rechargement

---

### US-042 — Publication et site public — `READY`

Owner: Frontend · Dépend de: US-041

**Tasks**

| ID | Tâche | Owner |
|---|---|---|
| PAGE-008 | Bouton Publier / Dépublier sur l'éditeur (statut du site) + affichage de l'URL publique | 💻 frontend |
| PAGE-009 | Page publique `/s/[slug]` : rendu serveur des blocs publiés (site non publié → 404) | 💻 frontend |
| PAGE-010 | QA : démo réelle complète (éditer → publier → voir `/s/<slug>` dans le navigateur) | 🧪 qa |

**Acceptance Criteria**

- Publier change le statut et expose l'URL `/s/<slug>` ; dépublier la rend 404
- Le rendu public utilise les tokens design (Ivoire & Indigo) et est fidèle à la prévisualisation
- Le parcours complet est validé en conditions réelles sur la preview

---

## Definition of Done (rappel, voir [AGENTS.md §10](../../AGENTS.md#10-definition-of-done))

```text
[ ] Fonctionnalité implémentée          [ ] Sécurité vérifiée
[ ] Acceptance Criteria respectés       [ ] Responsive si frontend
[ ] TypeScript valide                   [ ] Code review terminé (sur PR)
[ ] Lint valide                         [ ] Documentation à jour
[ ] Tests passés                        [ ] CI verte sur la PR
```
