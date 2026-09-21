# Sprint 08 — Domaine personnalisé & branding

> **Goal du sprint** : un utilisateur Pro **connecte son propre domaine** (champ + vérification DNS CNAME) et son site publié **n'affiche plus le badge Site.mg**.
> Workflow de livraison : charter [§9](../team/charter.md) — une branche `feature/<carte>` et une PR par carte, CI obligatoirement verte.

Owner des stories : voir tableaux. Dépendances : Sprint 07 ✔ DONE (analytics, plan effectif).

---

### US-090 — Domaine côté API — `READY`

Owner: ⚙️ Backend · Dépend de: Sprint 07 (✅)

| Carte | Tâche | Owner |
|---|---|---|
| DOM-001 | DTO : `domainePerso` accepté dans PATCH /sites/:id (normalisation minuscule, sans protocole ni chemin) | ⚙️ backend |
| DOM-002 | Gate plan : PATCH refuse si le plan effectif n'inclut pas `domainePerso` (403 upsell) ; `null` autorisé pour retirer | ⚙️ backend |
| DOM-003 | `POST /sites/:id/domaine/verifier` — vérifie l'enregistrement CNAME vers `<slug>.sites.site.mg` (résolution DNS) et met à jour `sslActif` | 🔐 security |

### US-091 — Public sans badge — `READY`

Owner: 💻 Frontend/Backend · Dépend de: US-090

| Carte | Tâche | Owner |
|---|---|---|
| BRD-001 | Le plan effectif du propriétaire expose `removeBranding` dans la vue publique (`GET /public/sites/:slug` et pages) | ⚙️ backend |
| BRD-002 | Pages publiques : badge « propulsé par Site.mg » affiché **seulement** si le plan ne le retire pas | 💻 frontend |

### US-092 — Éditeur : section domaine — `READY`

Owner: 💻 Frontend · Dépend de: US-090

| Carte | Tâche | Owner |
|---|---|---|
| DOM-004 | Section « Domaine personnalisé » dans l'éditeur : champ, upsell si Gratuit, CNAME à configurer, bouton Vérifier avec état (en attente / vérifié) | 💻 frontend |
| DOM-005 | QA réelle : domaine enregistré + vérification (CNAME absent → message clair), badge absent sur le site Pro de Marie | 🧪 qa |
| DOM-006 | Tests e2e : PATCH domaine gated 403, normalisation, retrait (null), badge conditionnel en public, vérification DNS en échec propre | 🧪 qa |

---

## Definition of Done (rappel charter §4.12)

```
[ ] Acceptance Criteria respectés       [ ] Responsive si frontend
[ ] TypeScript valide                   [ ] Code review terminé (sur PR)
[ ] Lint valide                         [ ] Documentation à jour
[ ] Tests passés                        [ ] CI verte sur la PR
```

---

## Bilan Sprint 08 — DONE

| Story | Livré |
|---|---|
| **US-090** ✅ | `domainePerso` dans PATCH (normalisé, gated 403 avec upsell, `null` pour retirer) + endpoint de vérification DNS CNAME vers `<slug>.sites.site.mg` (sslActif reflète le résultat) |
| **US-091** ✅ | `removeBranding` exposé dans les vues publiques (depuis le plan effectif du propriétaire) ; les 2 pages publiques masquent le badge quand il est vrai |
| **US-092** ✅ | Section Domaine dans l'éditeur (upsell Gratuit, CNAME affiché, bouton Vérifier à 3 états) · QA réelle : domaine `chez-marie.mg` enregistré puis retiré, vérification en échec propre, badge absent en Pro · +4 tests e2e (72/72 PASS) |

**Gates** : CI verte (#34→#36) · release `preprod → main` #37.

### Livraisons
- PR #34 planning · PR #35 feature domaine + branding · PR #36 bilan — release #37
