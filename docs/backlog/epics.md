# Product Backlog — Site.mg

Backlog vivant du produit. Structure : EPIC → FEATURE → USER STORY → TASK.
Le statut des stories est suivi dans les fichiers de sprint (`sprint-NN.md`).

Statuts possibles : `BACKLOG · READY · IN PROGRESS · BLOCKED · IN REVIEW · QA · DONE`

Sprint courant : [sprint-02.md](sprint-02.md) — Connexion, plans et premier site. Sprint 01 (fondations) : livré.

---

## EPIC-01 — Authentication

Inscription, connexion, vérification email, sessions, gestion de compte.

* US-001 — Inscription avec vérification email par code
* US-002 — Connexion / déconnexion
* US-003 — Renvoi du code de vérification, blocage après tentatives
* US-004 — Récupération de mot de passe
* US-005 — Paramètres du compte (profil, langue, mot de passe)

## EPIC-02 — Plans & Billing

Monétisation freemium.

* US-010 — Catalogue des plans (Gratuit / Pro / Business)
* US-011 — Souscription à un plan (Stripe Checkout)
* US-012 — Webhooks Stripe (abonnement actif/suspendu/annulé)
* US-013 — Historique de facturation
* US-014 — Application des quotas de plan côté backend

## EPIC-03 — Sites

* US-020 — Créer un site (nom, slug, modèle de départ)
* US-021 — Lister / dupliquer / supprimer ses sites
* US-022 — Paramètres du site (SEO, langue, statut)

## EPIC-04 — Builder visuel

* US-030 — Éditeur de pages par sections (navbar, hero, FAQ, footer…)
* US-031 — Ajout / suppression / réordonnancement de sections
* US-032 — Édition du contenu et du style d'une section
* US-033 — Multi-pages par site
* US-034 — Thème du site (couleurs, typographie)
* US-035 — Bibliothèque de modèles et blocs

## EPIC-05 — Publication

* US-040 — Publier / dépublier un site
* US-041 — Rendu public par slug (`/[slug]/[pageSlug]`)
* US-042 — Preview authentifiée avant publication
* US-043 — Domaine personnalisé (DNS + SSL)

## EPIC-06 — Media

* US-050 — Upload d'images (type MIME + taille contrôlés)
* US-051 — Bibliothèque de médias par site

## EPIC-07 — Formulaires

* US-060 — Formulaire de contact sur les sites publiés
* US-061 — Consultation des soumissions dans le dashboard

## EPIC-08 — Analytics

* US-070 — Collecte des visites des sites publiés
* US-071 — Dashboard analytics (visites, pages vues, sources, rebond)

## EPIC-09 — Notifications

* US-080 — Emails transactionnels (vérification, bienvenue, facturation)

## EPIC-10 — Fondations techniques

* US-090 — Scaffold monorepo (`apps/web`, `apps/api`) — [ADR-002](../adr/ADR-002.md)
* US-091 — Docker Compose (web, api, PostgreSQL, Redis)
* US-092 — CI/CD (lint, typecheck, tests, build)
* US-093 — Observabilité (logs structurés, health checks)
