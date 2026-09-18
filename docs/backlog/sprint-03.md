# Sprint 03 — Le builder visuel

> **Goal du sprint** : un utilisateur peut **éditer le contenu de son site (blocs) et le publier** sur une URL publique.
> Workflow de livraison : charter [§9](../team/charter.md) — une branche `feature/<carte>` et une PR par carte, CI obligatoirement verte.

Dépendances : Sprint 02 ✔ DONE (auth JWT, plans, CRUD sites).

---

### US-040 — Pages d'un site (backend) — `DONE`

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

**Exécution (PAGE-001→004, PR #10)** : model Page + migration ✔ · CRUD pages (ownership 404, slug unique par site, sanitization blocs) ✔ · publish/unpublish + GET /public/sites/:slug (@Public, 404 si non publié) ✔ · 9 tests e2e, suite 51/51 PASS ✔

---

### US-041 — Éditeur visuel (frontend) — `DONE`

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

**Exécution (PAGE-005→007, PR #11)** : éditeur /dashboard/sites/[id] (blocs hero/texte/cta, réordonnancement, suppression) ✔ · prévisualisation live ✔ · sauvegarde avec état dirty/saved ✔ · QA live : édition → sauvegarde → reload OK

---

### US-042 — Publication et site public — `DONE`

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

**Exécution (PAGE-008→010, PR #11)** : bouton Publier/Dépublier (statut cible) + lien /s/<slug> ✔ · page publique /s/[slug] en rendu serveur, 404 si non publié ✔ · 🐛 bug Publier trouvé et corrigé en QA live · démo réelle validée dans le navigateur

---

## Bilan Sprint 03

**3/3 stories DONE** — US-040 (pages + publication) · US-041 (éditeur visuel) · US-042 (site public). Goal atteint : un utilisateur peut éditer son site en blocs et le publier sur /s/<slug>.
