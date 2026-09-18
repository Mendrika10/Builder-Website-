# Architecture — Backend (NestJS)

## Organisation des modules

```text
apps/api/
├── src/
│   ├── modules/
│   │   ├── auth/          # inscription, connexion, vérification email
│   │   ├── users/
│   │   ├── plans/         # catalogue des plans
│   │   ├── billing/       # abonnements, paiements (Stripe)
│   │   ├── sites/
│   │   ├── builder/       # pages, sections, blocs, thèmes
│   │   ├── publication/   # rendu public, domaines
│   │   ├── media/
│   │   ├── forms/         # formulaires + soumissions
│   │   ├── analytics/
│   │   └── notifications/ # emails transactionnels
│   ├── common/            # guards, filters, interceptors, decorators
│   ├── config/            # configuration typée, validation d'env
│   ├── database/          # client DB, migrations
│   └── main.ts
└── test/
```

## Pattern par fonctionnalité

```text
Controller      → HTTP, DTO, codes de retour
    ↓
Service         → logique métier, transactions
    ↓
Repository      → accès données
    ↓
PostgreSQL
```

## Règles par endpoint

Chaque endpoint définit : méthode HTTP, route, authentification, autorisation, DTO de requête, validation, réponse, erreurs, tests.
Voir [Règle Backend](../../AGENTS.md#20-règle-backend) : ne jamais faire confiance aux données du frontend.

## Quotas et plans

Les limites de plan (nb de sites, nb de pages, stockage, domaine perso, analytics) sont vérifiées **côté backend** — le frontend les affiche mais ne les fait pas respecter.
