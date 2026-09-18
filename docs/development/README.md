# Development — Workflow

## Branches

```text
main
 └── develop
      └── feature/<name> · fix/<name> · chore/<name> …
```

## Routine

```text
1. Choisir une tâche READY dans docs/backlog/sprint-NN.md
2. Vérifier ses dépendances
3. Créer la branche, implémenter
4. Self review + lint + typecheck + tests
5. PR → Code Reviewer → QA → merge sur develop
```

Conventional Commits obligatoires (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).

## Avant de déclarer DONE

La checklist complète est dans [AGENTS.md §10 — Definition of Done](../../AGENTS.md#10-definition-of-done).
