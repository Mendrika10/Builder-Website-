# Sprint 04 — Sites multipages et contenu riche

> **Goal du sprint** : un utilisateur peut **construire un site multipage** (quota du plan appliqué), avec des **blocs plus riches** (image, contact, horaires) et un **SEO de base** sur le site public.
> Workflow de livraison : charter [§9](../team/charter.md) — une branche `feature/<carte>` et une PR par carte, CI obligatoirement verte.

Dépendances : Sprint 03 ✔ DONE (pages, éditeur, publication, site public).

---

### US-050 — Multi-pages — `READY`

Owner: Backend + Frontend · Dépend de: US-040/041 (✅ Sprint 03)

**Tasks**

| ID | Tâche | Owner |
|---|---|---|
| PAGE-011 | Quota `max_pages` du plan appliqué à `POST /sites/:siteId/pages` (403 avec message plan) | ⚙️ backend |
| PAGE-012 | Éditeur : gestionnaire de pages (liste, création, suppression, bascule entre pages) | 💻 frontend |
| PAGE-013 | Site public multipage : `/s/[slug]/[pageSlug]` + navigation entre les pages publiées | 💻 frontend |
| PAGE-014 | Tests e2e : quota pages + parcours multipage public | 🧪 qa |

**Acceptance Criteria**

- Un plan limité à 5 pages refuse la 6e (403 avec message clair)
- L'éditeur permet de créer, supprimer et basculer entre les pages du site
- Le site public expose chaque page sur `/s/<slug>/<page>` avec une navigation cohérente
- Parcours e2e : 2 pages créées, publiées et visitables en public

---

### US-051 — Blocs riches (image, contact, horaires) — `READY`

Owner: Backend + Frontend · Dépend de: US-050

**Tasks**

| ID | Tâche | Owner |
|---|---|---|
| BLOC-001 | API : sanitization étendue aux blocs `image` (url, alt), `contact` (téléphone, email, adresse), `horaires` (texte) | ⚙️ backend |
| BLOC-002 | Éditeur : champs des nouveaux blocs (image par URL en v1) | 💻 frontend |
| BLOC-003 | Rendu : BlocView des nouveaux blocs (image responsive, carte contact, horaires) | 💻 frontend |
| BLOC-004 | Tests e2e sanitization + QA visuelle sur la preview | 🧪 qa |

**Acceptance Criteria**

- Les 3 nouveaux blocs passent la sanitization (URL http(s) uniquement pour image, champs texte bornés)
- L'éditeur propose les 6 types de blocs avec leurs champs dédiés
- Le rendu public est fidèle à la prévisualisation et responsive

---

### US-052 — SEO de base du site public — `READY`

Owner: Frontend · Dépend de: US-050

**Tasks**

| ID | Tâche | Owner |
|---|---|---|
| SEO-001 | `generateMetadata` sur `/s/[slug]` et `/s/[slug]/[pageSlug]` : title/description dérivés du contenu (titre de page + premier texte) | 💻 frontend |
| SEO-002 | QA : vérification des balises générées sur la preview | 🧪 qa |

**Acceptance Criteria**

- Chaque page publique a un `<title>` et une `meta description` uniques et lisibles
- Aucune fuite du contenu des sites non publiés (404 → pas de metadata)

---

## Definition of Done (rappel, voir [AGENTS.md §10](../../AGENTS.md#10-definition-of-done))

```text
[ ] Fonctionnalité implémentée          [ ] Sécurité vérifiée
[ ] Acceptance Criteria respectés       [ ] Responsive si frontend
[ ] TypeScript valide                   [ ] Code review terminé (sur PR)
[ ] Lint valide                         [ ] Documentation à jour
[ ] Tests passés                        [ ] CI verte sur la PR
```
