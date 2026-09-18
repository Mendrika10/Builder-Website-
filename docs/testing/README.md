# Testing — Stratégie

## Pyramide cible

```text
        e2e           ← parcours critiques (inscription, publication)
      intégration     ← endpoints API avec base de test
      unitaires       ← services, hooks, composants logiques
```

## Responsabilités

* **Backend Developer** : tests unitaires des services + tests d'intégration des endpoints (supertest).
* **Frontend Developer** : tests de composants pour la logique ; forms et états d'erreur couverts.
* **QA Engineer** : parcours e2e, régression, edge cases, validation des Acceptance Criteria.

## Checklist QA par fonctionnalité

```text
[ ] Fonction principale   [ ] Permissions
[ ] Validation            [ ] Responsive
[ ] Erreurs               [ ] Edge cases
[ ] Loading               [ ] Régression
[ ] Empty state
```

Chaque bug corrigé reçoit un test de régression ([gestion des bugs](../../AGENTS.md#26-gestion-des-bugs)).
