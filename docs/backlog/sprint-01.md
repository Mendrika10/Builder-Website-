# Sprint 01 — Fondations techniques

## Sprint Goal

Poser les fondations du rebuild [ADR-001](../adr/ADR-001.md) : monorepo opérationnel, backend NestJS et frontend Next.js qui tournent, PostgreSQL migré avec le cœur du modèle (users + sites), CI qui valide tout, et premier bout de bout en bout (inscription → utilisateur créé en base).

**Durée** : 1 sprint. **Capacité** : toutes les stories ci-dessous sont séquencées par dépendance.

---

## Stories du sprint

### US-090 — Scaffold monorepo — `DONE`

Owner: DevOps · Dépend de: rien

**Tasks**

| ID | Tâche | Owner |
|---|---|---|
| FOND-001 | Créer `apps/web` (Next.js) et `apps/api` (NestJS), npm workspaces, passer ADR-002 à Accepted | DevOps |
| FOND-002 | Lint + typecheck configurés sur les deux apps (ESLint, tsconfig strict) | DevOps |
| FOND-002b | Setup Tailwind sur `apps/web` ([ADR-003](../adr/ADR-003.md)) : config conforme aux tokens de [docs/design/art-direction.md](../design/art-direction.md), `cn()` dans `lib/`, squelette `components/ui/` | DevOps + UI Art Director |
| FOND-003 | Health check `GET /health` sur l'API | Backend |

> Réalisé (17/09/2026) : workspaces npm, `apps/web` (Next 15 + Tailwind/tokens ADR-003, composants ui, démo `/`) et `apps/api` (Nest 10, `GET /health` → `{"status":"ok"}` sur 3201). `npm run typecheck` vert sur les deux apps. Ports : web 3200, api 3201. ADR-002 passé à Accepted.
> Code Review (17/09/2026) : **APPROVED** après corrections — lint web/api opérationnels, test e2e health ajouté (VERT), Logger Nest, config next épurée.
> QA (17/09/2026) : **PASS** — AC validées en live, tokens vérifiés au runtime, accessibilité (aria) ✔, responsive 360px (1 défaut trouvé puis corrigé : flex-wrap sur la rangée de boutons), régression v1 traitée (serveur 3001 relancé, fuite tsconfig scellée). FOND-001 et FOND-002b → DONE.

**Acceptance Criteria**

- `npm install` puis `npm run dev` lance web et api
- `GET http://localhost:3000/health` (api) répond `{ "status": "ok" }`
- `npm run lint` et `npm run typecheck` passent sur tout le repo
- Tailwind opérationnel sur `apps/web` : tokens présents dans `tailwind.config.ts`, un composant `Button` de démo dans `components/ui/`

---

### US-091 — Docker Compose — `DONE`

Owner: DevOps · Dépend de: US-090

> Réalisé + review APPROVED + QA PASS (17/09/2026) : compose PostgreSQL 16 + Redis (healthy), ports hôte 6543/6380 (5432/6379 occupés en local), credentials via `.env` (§22 réparé : l'ancien compose avait un mot de passe MySQL en dur), `.env.example` racine + api + web, `.gitignore` par app. psql 16.15 et redis PONG vérifiés.

**Tasks**

| ID | Tâche | Owner |
|---|---|---|
| FOND-010 | `docker-compose.yml` : `db` (PostgreSQL 16), `redis`, ports documentés | DevOps |
| FOND-011 | `.env.example` complet à la racine et par app, sans secrets réels | DevOps |

**Acceptance Criteria**

- `docker compose up -d` démarre PostgreSQL et Redis
- L'API se connecte à PostgreSQL via `DATABASE_URL` du `.env`
- `README.md` décrit l'installation en ≤ 10 commandes

---

### US-092 — Modèle de données initial — `DONE`

Owner: Database Engineer · Dépend de: US-091

**Tasks**

| ID | Tâche | Owner |
|---|---|---|
| FOND-020 | Migration initiale : tables `user`, `email_verification`, `plan`, `subscription`, `site` + enums + index | Database |
| FOND-021 | Seed : 3 plans (Gratuit / Pro / Business) | Database |

**Acceptance Criteria**

- `npm run db:migrate` applique la migration sur une base vide
- Unicité : `user.email`, `site.slug`
- Index sur toutes les clés étrangères
- Seed idempotent

**Exécution (FOND-020/021)** : migration `init` appliquée sur base vide ✔ · unicités `user_email_key`/`site_slug_key` testées ✔ · 8 index FK ✔ · seed idempotent (2e run, toujours 3 plans) ✔ · client Prisma isolé dans `src/generated/prisma` (cohabitation v1 MySQL) ✔

---

### US-093 — Inscription + vérification email (bout en bout) — `DONE`

Owner: Backend + Frontend · Dépend de: US-092

**Tasks**

| ID | Tâche | Owner |
|---|---|---|
| AUTH-001 | API `POST /auth/register` : DTO, validation, bcrypt, unicité email, réponse sans données sensibles | Backend |
| AUTH-002 | API `POST /auth/verify` : code à 6 chiffres, expiration, limite de tentatives, blocage temporaire | Backend |
| AUTH-003 | API `POST /auth/resend-code` (rate limited) | Backend |
| AUTH-004 | Envoi d'email via Nodemailer (module notifications) | Backend |
| AUTH-005 | Pages `/register` et `/verify` (Formik + Yup, états loading/error/success) | Frontend |
| AUTH-006 | Tests unitaires services + tests e2e du parcours register→verify | QA |

**Acceptance Criteria**

- Inscription crée un utilisateur avec `emailVerifie = false` et envoie un code
- 3 codes erronés → blocage temporaire du compte (message clair)
- Le code expiré est refusé
- Les réponses API n'exposent jamais le hash du mot de passe
- Parcours complet testé en e2e

**Exécution (AUTH-001→006)** : register/verify/resend-code en Nest ✔ · bcryptjs cost 12, code 6 chiffres `crypto.randomInt`, expiration 15 min ✔ · 3 erreurs → blocage 15 min ✔ · anti-énumération sur resend ✔ · emails Nodemailer (transport dev logge le code ; SMTP_* optionnels) ✔ · pages `/register` + `/verify` (états loading/error/success, cooldown 60 s, accessibles) ✔ · CORS configuré (CORS_ORIGIN) ✔ · adaptation tracée : react-hook-form/zod → validation native + class-validator (Formik incompatible React 19, zod déjà en v1) ✔ · **parcours réel testé en navigateur : inscription → code → compte activé** ✔

---

### US-091b — CI/CD — `DONE`

### US-091b — CI/CD — `READY`

Owner: DevOps · Dépend de: US-090

**Tasks**

| ID | Tâche | Owner |
|---|---|---|
| FOND-030 | GitHub Actions : lint + typecheck + tests + build, déclenché sur PR vers `develop` | DevOps |

**Acceptance Criteria**

- Une PR rouge (lint, typecheck, tests ou build KO) ne peut pas merger

**Exécution (FOND-030)** : workflow `.github/workflows/ci.yml` — jobs `web` (lint/typecheck/build) et `api` (lint/typecheck/tests/build, PostgreSQL 16 de service + `prisma migrate deploy`). ⚠️ Reste **une action manuelle côté GitHub** : activer la branch protection sur `develop` (Require status checks) pour l'interdiction de merge rouge.

---

## Hors sprint (prochain candidat : Sprint 02)

Connexion/sessions (US-002), catalogue des plans (US-010), première page du builder (US-030).

---

## Definition of Done (rappel, voir [AGENTS.md §10](../../AGENTS.md#10-definition-of-done))

```text
[ ] Fonctionnalité implémentée          [ ] Sécurité vérifiée
[ ] Acceptance Criteria respectés       [ ] Responsive si frontend
[ ] TypeScript valide                   [ ] Code review terminé
[ ] Lint valide                         [ ] Documentation à jour
[ ] Tests passés                        [ ] Aucun bug critique connu
[ ] Erreurs gérées
```
