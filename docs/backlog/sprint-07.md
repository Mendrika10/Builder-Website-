# Sprint 07 — Analytics par site

> **Goal du sprint** : le propriétaire d'un site voit **ses vues par jour et ses pages les plus vues** — fonctionnalité **réservée aux plans payants** (flag `analytics` du plan effectif).
> Workflow de livraison : charter [§9](../team/charter.md) — une branche `feature/<carte>` et une PR par carte, CI obligatoirement verte.

Owner des stories : voir tableaux. Dépendances : Sprint 06 ✔ DONE (monétisation, plan effectif).

---

### US-080 — Collecte et API analytics (backend) — `READY`

Owner: ⚙️ Backend · Dépend de: Sprint 06 (✅)

| Carte | Tâche | Owner |
|---|---|---|
| STATS-001 | Migration : table `page_view_daily` (site, page?, date, compteur unique) + compteur `vues` sur Page + backfill neutre | 🗄️ database |
| STATS-002 | `POST /public/sites/:slug/view` enrichi : incrément site + vue du jour (upsert atomique) + page optionnelle | ⚙️ backend |
| STATS-003 | `GET /sites/:id/analytics?days=30` (ownership) : total, série quotidienne, top pages — **403 si plan sans analytics** | ⚙️ backend |

### US-081 — Page analytics (frontend) — `READY`

Owner: 💻 Frontend · Dépend de: US-080

| Carte | Tâche | Owner |
|---|---|---|
| STATS-004 | Client `lib/analytics.ts` + page `/dashboard/sites/[id]/analytics` : totaux, graphique barres des vues/jour (SVG, sans dépendance), top pages | 💻 frontend |
| STATS-005 | Lien « Statistiques » depuis l'éditeur + États : plan sans analytics → upsell Pro ; site sans données → message vide | 💻 frontend |
| STATS-006 | QA réelle : visites sur le site public de Marie → courbe et top pages à jour ; Gratuit → upsell visible | 🧪 qa |

### US-082 — Tests et clôture — `READY`

Owner: 🧪 QA · Dépend de: US-080, US-081

| Carte | Tâche | Owner |
|---|---|---|
| STATS-007 | Tests e2e : view publique incrémente (site+jour), analytics 403 en Gratuit, analytics OK en Pro (abonnement actif), 404 hors ownership | 🧪 qa |
| STATS-008 | Bilan sprint doc + Trello + release main | 📚 documentation |

---

## Definition of Done (rappel charter §4.12)

```
[ ] Acceptance Criteria respectés       [ ] Responsive si frontend
[ ] TypeScript valide                   [ ] Code review terminé (sur PR)
[ ] Lint valide                         [ ] Documentation à jour
[ ] Tests passés                        [ ] CI verte sur la PR
```

---

## Bilan Sprint 07 — DONE

| Story | Livré |
|---|---|
| **US-080** ✅ | Table `page_view_daily` (upsert atomique site+page+date) + `vues` par page · endpoint view enrichi · `GET /sites/:id/analytics` gated par le plan effectif (403 avec lien upsell pour Gratuit) |
| **US-081** ✅ | Page `/dashboard/sites/[id]/analytics` : totaux (vues 30j, aujourd'hui, pages), graphique barres SVG des 30 derniers jours, top pages cliquables, upsell Pro pour Gratuit, lien « Statistiques » dans l'éditeur |
| **US-082** ✅ | +4 tests e2e (68/68 PASS) · QA réelle : visites générées sur le site public de Marie (Pro) → série quotidienne et top pages à jour · upsell visible côté Gratuit |

**Gates** : CI verte (#30→#32) · release `preprod → main` #33.

### Livraisons
- PR #30 planning · PR #31 feature analytics · PR #32 bilan — release #33
