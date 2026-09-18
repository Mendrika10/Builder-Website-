# Architecture — Frontend (Next.js)

## Structure

```text
apps/web/
├── app/                 # routes (App Router)
├── components/
│   └── ui/              # boutons, inputs, cards, modals… (réutilisables)
├── features/            # modules par domaine (auth, sites, builder…)
├── hooks/
├── services/            # clients API (Axios + React Query)
├── types/
├── utils/
├── layouts/
├── lib/                 # cn(), helpers
└── tailwind.config.ts   # design tokens (source de vérité visuelle)
```

## Design system (Tailwind)

Le CSS est exclusivement utilitaire (**Tailwind CSS**, [ADR-003](../adr/ADR-003.md)) :

* **Design tokens** dans `tailwind.config.ts` : `extend.colors`, `extend.fontFamily`, `extend.spacing` — jamais de valeurs arbitraires (`bg-[#ff0000]`) répétées dans le code.
* Classes conditionnelles via `cn()` (clsx + tailwind-merge) dans `lib/`.
* Composants `components/ui/` avec variantes et états — aucune duplication de combinaisons de classes.
* Breakpoints par défaut `sm/md/lg/xl/2xl` sauf besoin justifié.

Les tokens sont **définis par l'UI Art Director** (voir [docs/skills/](../skills/README.md)) avant toute implémentation d'interface. Chaque interface respecte la règle [UI QUALITY STANDARD](../../AGENTS.md#415-ui-quality-standard--skills-frontend).

## Zones de l'application

| Zone | Routes | Accès |
|---|---|---|
| Marketing | `/` (landing, tarifs, FAQ) | public |
| Auth | `/login`, `/register`, `/verify` | public |
| Dashboard | `/dashboard`, `/sites`, `/billing`, `/settings` | authentifié + email vérifié |
| Builder | `/builder/[siteId]` | authentifié + propriétaire du site |
| Site publié | `/[slug]`, `/[slug]/[pageSlug]` | public |
| Preview | `/preview/[siteId]` | authentifié |

## State management

* **React Query** : état serveur (requêtes, cache, invalidation).
* **Formik + Yup** : formulaires et validation.
* Pas d'état global métier lourd : l'état serveur passe par React Query.

## Règles

* Chaque écran prévoit les états : Loading / Success / Error / Empty / Disabled ([règle Frontend](../../AGENTS.md#19-règle-frontend)).
* Les composants sont réutilisés, jamais dupliqués ([règle Anti-Duplication](../../AGENTS.md#17-règle-anti-duplication)).
* Les textes d'interface suivent le skill `ux-writing` (microcopy contextuelle, pas de « Something went wrong »).
* Workflow UI : Requirement → **UI Art Director** (direction + tokens + spec composants) → Frontend Developer → Visual QA.
