# Architecture — Database (PostgreSQL)

## Domaines et entités principales

```text
User
 ├── Subscription ── Plan
 ├── Site ── Theme
 │        ├─ Page ── Section ── Bloc
 │        ├─ Media
 │        ├─ Domain (DNS + SSL)
 │        ├─ Form ── Submission
 │        └─ Analytics (agrégats par jour)
 └── Notification
```

## Conventions

* Noms de tables en `snake_case`, majuscule en tête de phrase interdite.
* UUID comme clés primaires.
* `created_at` / `updated_at` sur toutes les tables métier.
* Énumérations PostgreSQL pour les statuts (rôles, statut abonnement, statut site, statut DNS…).

## Règles

* Toute modification du schéma passe par une **migration** versionnée — jamais de modification manuelle ([règle Database](../../AGENTS.md#21-règle-database)).
* Index sur toutes les clés étrangères et sur les colonnes de filtrage fréquent (statut, dates).
* Contraintes d'unicité : email utilisateur, slug de site, nom de domaine.
* Suppressions en cascade des données filles d'un site ; `SET NULL` ou `RESTRICT` selon la sémantique des relations.

## Référence métier

Le produit existant (builder-website) documente le MCD de référence : 16 tables couvrant plans, utilisateurs, vérification email, abonnements, paiements, catégories/modèles, sites, thèmes, pages, blocs, sections, médias, domaines, formulaires, soumissions, analytiques. Ce modèle sera porté vers PostgreSQL avec ces conventions.
