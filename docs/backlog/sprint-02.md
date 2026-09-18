# Sprint 02 — Connexion, plans et premier site

> **Goal du sprint** : un utilisateur peut **s'inscrire, se connecter et créer son premier site**.
> Workflow de livraison : charter [§9](../team/charter.md) — une branche `feature/<carte>` et une PR par carte, CI obligatoirement verte.

Owner des stories : voir tableaux. Dépendances : US-093 (Sprint 01) ✔ DONE.

---

### US-002 — Connexion / déconnexion (JWT) — `READY`

Owner: Backend + Frontend · Dépend de: US-093 (✅)

**Tasks**

| ID | Tâche | Owner |
|---|---|---|
| AUTH-010 | `POST /auth/login` : vérifie bcrypt + `emailVerifie`, émet JWT access (15 min) + refresh (7 j), rate limiting | Backend |
| AUTH-011 | `POST /auth/refresh` + `POST /auth/logout` (révocation refresh par hash en base) | Backend |
| AUTH-012 | Guard `JwtAuthGuard` + décorateur `@CurrentUser()`, stratégie passport-jwt | Backend |
| AUTH-013 | Page `/login` (états loading/error/success, lien vers register) + contexte session côté web | Frontend |
| AUTH-014 | Dashboard minimal `/dashboard` (protegé par guard côté client, affiche profil) | Frontend |
| AUTH-015 | Tests unitaires login/refresh/logout + e2e parcours login→refresh→logout | QA |

**Acceptance Criteria**

- Un compte vérifié se connecte et reçoit ses tokens ; un compte non vérifié reçoit 403 avec message clair
- Le mot de passe erroné donne 401 **sans préciser** si l'email existe (anti-énumération)
- `/dashboard` inaccessible sans JWT valide ; refresh renouvelle l'accès sans re-login
- Logout révoque le refresh token (réutilisation impossible)
- Parcours complet testé en e2e

---

### US-010 — Catalogue des plans — `DONE`

Owner: Backend + Frontend · Dépend de: FOND-021 (seed, ✅)

**Tasks**

| ID | Tâche | Owner |
|---|---|---|
| PLAN-001 | API `GET /plans` : liste des plans actifs (prix, quotas, features) depuis la table `plan` | Backend |
| PLAN-002 | Page `/pricing` publique : 3 cartes plans avec tokens design, CTA « Choisir » | Frontend |
| PLAN-003 | Page `/register` : préselection du plan choisi via query param `?plan=pro` | Frontend |
| PLAN-004 | Tests e2e `GET /plans` + rendu /pricing | QA |

**Acceptance Criteria**

- `/pricing` affiche les 3 plans depuis l'API (pas de hardcode) avec prix et quotas corrects
- Le CTA mène vers `/register?plan=<slug>` et la préselection survit au formulaire
- Réponse API sans champs internes inutiles

**Exécution (PLAN-001→004, PR #5)** : GET /plans public (DTO épuré) ✔ · /pricing branchée sur l'API, Pro en avant ✔ · /register?plan= → bandeau de préselection ✔ · e2e plans (correction au passage : seed ajouté en CI) ✔ · 34/34 tests PASS ✔

---

### US-030 — Première page du builder — `DONE`

Owner: Backend + Frontend · Dépend de: US-002 (✅ après sprint)

**Tasks**

| ID | Tâche | Owner |
|---|---|---|
| SITE-001 | API `POST /sites` : crée un site (nom, slug auto-dérivé + unicité), quota max_sites du plan appliqué | Backend |
| SITE-002 | API `GET /sites` : liste des sites de l'utilisateur courant (guard JWT) | Backend |
| SITE-003 | API `PATCH /sites/:id` (renommer) et `DELETE /sites/:id` (soft delete) | Backend |
| SITE-004 | Page `/dashboard/sites` : liste + formulaire « Nouveau site » (nom → slug) | Frontend |
| SITE-005 | Tests unitaires quotas + e2e CRUD sites | QA |

**Acceptance Criteria**

- Un utilisateur Gratuit (1 site) ne peut pas créer un 2e site (403 avec message quota)
- Le slug est unique, dérivé du nom, et éditable avant création
- La liste ne montre que les sites de l'utilisateur (isolation par JWT)
- CRUD testé en e2e

**Exécution (SITE-001→005, PR #6)** : POST/GET/PATCH/DELETE /sites (guard JWT, quotas plan, slug auto unique, soft delete) ✔ · /dashboard/sites : liste + création + renommage inline + suppression confirmée ✔ · e2e CRUD (8 tests) ✔ · 42/42 tests PASS ✔ · parcours validé en réel dans le navigateur (création → renommage → suppression)

---

## Bilan Sprint 02

**3/3 stories DONE** — US-002 (connexion JWT) · US-010 (catalogue plans) · US-030 (premier site). Goal atteint : un utilisateur peut s'inscrire, se connecter et créer son premier site.

```text
[ ] Fonctionnalité implémentée          [ ] Sécurité vérifiée
[ ] Acceptance Criteria respectés       [ ] Responsive si frontend
[ ] TypeScript valide                   [ ] Code review terminé (sur PR)
[ ] Lint valide                         [ ] Documentation à jour
[ ] Tests passés                        [ ] CI verte sur la PR
```
