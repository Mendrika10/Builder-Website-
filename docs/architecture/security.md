# Architecture — Security

## Modèle d'authentification

* Inscription avec **vérification email par code** (expiration, limite de tentatives, blocage temporaire après échecs répétés).
* Sessions par **JWT** (cookies httpOnly) — aucune donnée sensible dans le payload.
* Mots de passe hachés avec **bcrypt** (coût ≥ 10), jamais stockés ni loggés en clair.

## Autorisation

* Rôles : `client`, `admin`, `support`.
* Vérification de **propriété** sur chaque ressource : un utilisateur ne peut accéder qu'à ses sites, pages, médias, formulaires.
* Contrôle côté backend uniquement — le frontend ne fait qu'afficher.

## Checklist systématique ([Security Engineer](../../AGENTS.md#411--security-engineer))

```text
[ ] Authentification requise ?
[ ] Autorisation / propriété vérifiée ?
[ ] Entrées validées (DTO) ?
[ ] Sorties non sensibles (pas de hash de mot de passe dans les réponses) ?
[ ] Rate limiting sur auth et endpoints publics ?
[ ] Upload de fichiers : type MIME + taille contrôlés ?
[ ] Pas de secret dans le code ou les logs ?
[ ] Erreurs génériques côté client (pas de stack trace) ?
```

## Secrets

* Uniquement via variables d'environnement (`.env`, jamais commités) — voir [Règle Security](../../AGENTS.md#22-règle-security).
* `.env.example` documente les variables nécessaires, sans valeurs réelles.
