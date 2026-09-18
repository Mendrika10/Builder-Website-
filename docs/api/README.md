# API — Contrats

Cette section documentera les contrats d'API au fur et à mesure des sprints, démarrant avec l'authentification (Sprint 01 : `POST /auth/register`, `POST /auth/verify`, `POST /auth/resend-code`).

## Format d'une spec d'endpoint

```text
## POST /auth/register

Auth: public
Body DTO:  { nom, email, password }
Validation: email valide et unique ; password ≥ 8 caractères
200: { id, nom, email, emailVerifie: false }
Errors: 400 validation · 409 email déjà utilisé · 429 trop de tentatives
Tests: unitaires (service) + e2e (parcours)
```

Rappel ([règle Backend](../../AGENTS.md#20-règle-backend)) : chaque endpoint gère authentication, authorization, validation, erreurs, logging et tests.
