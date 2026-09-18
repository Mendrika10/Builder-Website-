# Architecture — Overview

> Produit : **Site.mg** — SaaS de création de sites web (équivalent Wix/Webflow francophone).
> Le produit permet à un utilisateur de créer, éditer et publier un site sans coder.

## Cible architecturale

```text
Frontend
Next.js / React / TypeScript
        │
        │ REST API / WebSocket
        ↓
Backend
NestJS / Node.js
        │
        ├── PostgreSQL
        │
        └── Redis
```

Voir [ADR-001](../adr/ADR-001.md) (stack) et [ADR-002](../adr/ADR-002.md) (monorepo).

## Domaines fonctionnels (issus du produit)

| Domaine | Description |
|---|---|
| Auth | Inscription, connexion, vérification email, sessions |
| Plans & Billing | Plans Gratuit/Pro/Business, abonnements, paiements (Stripe) |
| Sites | CRUD sites, statut (brouillon/publié/suspendu/archivé), slug |
| Builder | Éditeur visuel : pages, sections, blocs, thème |
| Publication | Rendu public des sites publiés, domaines personnalisés |
| Media | Upload et gestion des images |
| Formulaires | Formulaires de contact des sites publiés + soumissions |
| Analytics | Statistiques de visite des sites publiés |
| Notifications | Emails transactionnels |

## Principes

* Séparation stricte frontend / backend : le frontend ne parle **jamais** directement à la base.
* Toute modification du schéma passe par une migration ([règle Database](../../AGENTS.md#21-règle-database)).
* Validation systématique des entrées côté backend (DTO + class-validator ou Zod).
* Chaque décision structurante est tracée dans un [ADR](../adr/).
