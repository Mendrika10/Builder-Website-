# Documentation — Site.mg

SaaS de création de sites web. Rebuild en cours sur la stack [ADR-001](adr/ADR-001.md).

## Organisation de l'équipe

La gouvernance des agents (rôles, workflow, Definition of Done, Scrum) est définie à la racine : [AGENTS.md](../AGENTS.md).

## Index

| Dossier | Contenu |
|---|---|
| [architecture/](architecture/) | overview, frontend, backend, database, security |
| [adr/](adr/) | Architecture Decision Records (ADR-001 stack, ADR-002 monorepo, ADR-003 Tailwind) |
| [backlog/](backlog/) | Product backlog et plans de sprint |
| [team/](team/) | Team Charter : valeurs, RACI, gates, rituels · suivi Trello |
| [design/](design/) | Direction artistique & design tokens (UI Art Director) |
| [skills/](skills/) | Référentiels de qualité frontend (design, UX, microcopy) |
| [api/](api/) | Contrats d'API (à venir : premiers endpoints au Sprint 01) |
| [database/](database/) | Schéma et migrations (à venir) |
| [deployment/](deployment/) | Environments et déploiement (à venir) |
| [development/](development/) | Workflow de développement (à venir) |
| [testing/](testing/) | Stratégie de tests (à venir) |

## Démarrage rapide (cible, Sprint 01)

```bash
npm install
docker compose up -d        # PostgreSQL 16 (:5432) + Redis (:6379)
cp apps/api/.env.example apps/api/.env
npm run db:migrate          # migrations (US-092, à venir)
npm run dev:api             # API NestJS   → http://localhost:3201 (GET /health)
npm run dev:web             # Web Next.js  → http://localhost:3200
```
