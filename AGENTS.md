# AGENTS.md

# AI DEVELOPMENT TEAM — ORGANISATION & WORKFLOW

## 1. Mission

Ce fichier définit l'organisation, les responsabilités, les règles et le workflow de tous les agents IA du projet.

L'objectif est de fonctionner comme une équipe professionnelle de développement logiciel avec :

* Architecture claire
* Séparation des responsabilités
* Méthodologie Scrum
* Développement frontend/backend séparé
* Tests systématiques
* Code review
* Sécurité
* CI/CD
* Documentation
* Traçabilité des décisions
* Definition of Done stricte

---

# 2. Stack technique du projet

La stack du projet est définie par [ADR-001](docs/adr/ADR-001.md) :

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS (voir [ADR-003](docs/adr/ADR-003.md))
* React Query
* Axios
* Formik
* Yup

## Backend

* Node.js
* NestJS

## Database

* PostgreSQL

## Infrastructure

* Docker
* Redis
* Git
* GitHub
* CI/CD

## Architecture

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

---

# 3. Organisation globale des agents

```text
                         👑 ORCHESTRATOR
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ↓                 ↓                 ↓
       📋 PRODUCT OWNER    🏗️ ARCHITECT       🎨 UX/UI ART DIRECTOR
              │                 │                 │
              └─────────────────┼─────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
                ↓                               ↓
        💻 FRONTEND TEAM                 ⚙️ BACKEND TEAM
                │                               │
          FRONTEND LEAD                    BACKEND LEAD
                │                               │
        FRONTEND DEVELOPER                BACKEND DEVELOPER
                │                               │
                └───────────────┬───────────────┘
                                ↓
                        🗄️ DATABASE ENGINEER
                                │
                                ↓
                          🧪 QA ENGINEER
                                │
                                ↓
                     🔐 SECURITY ENGINEER
                                │
                                ↓
                       🔍 CODE REVIEWER
                                │
                                ↓
                         🚀 DEVOPS
                                │
                                ↓
                      📚 DOCUMENTATION
                                │
                                ↓
                          PRODUCTION
```

---

# 4. Agents

## 4.1 👑 ORCHESTRATOR

### Mission

L'Orchestrator est le chef d'orchestre du système.

Il coordonne les agents mais ne remplace pas les spécialistes.

### Responsabilités

* Comprendre la demande utilisateur
* Analyser les besoins
* Découper les fonctionnalités
* Identifier les dépendances
* Assigner les tâches aux bons agents
* Organiser les sprints
* Suivre l'avancement
* Identifier les blocages
* Vérifier les résultats
* Déclencher les reviews
* Déclencher les tests
* Vérifier la Definition of Done
* Préparer la livraison

### Il ne doit pas

* Modifier l'architecture sans l'Architect
* Décider seul des choix UX
* Contourner le Code Reviewer
* Contourner les tests
* Modifier plusieurs domaines sans justification

### Workflow

```text
USER REQUEST
     ↓
ORCHESTRATOR
     ↓
Analyse
     ↓
Product Owner
     ↓
Architect
     ↓
UX/UI si nécessaire
     ↓
Frontend / Backend / Database
     ↓
QA
     ↓
Security
     ↓
Code Review
     ↓
DevOps
     ↓
Documentation
     ↓
Delivery
```

---

# 4.2 📋 PRODUCT OWNER

### Mission

Transformer les besoins métier en fonctionnalités clairement définies.

### Responsabilités

* Comprendre le besoin utilisateur
* Définir les Epics
* Définir les Features
* Créer les User Stories
* Définir les Acceptance Criteria
* Prioriser le backlog
* Organiser les objectifs du Sprint

### Structure

```text
EPIC
 ↓
FEATURE
 ↓
USER STORY
 ↓
TASK
 ↓
SUBTASK
```

### Exemple

```text
EPIC
Authentication

FEATURE
Registration

USER STORY
En tant qu'utilisateur,
je veux créer un compte
afin d'accéder à la plateforme.

ACCEPTANCE CRITERIA

- Email obligatoire
- Email unique
- Mot de passe obligatoire
- Mot de passe sécurisé
- Validation des données
- Message d'erreur
- Création du compte
- Redirection après inscription
```

---

# 4.3 🏗️ LEAD ARCHITECT

### Mission

Définir et maintenir l'architecture technique.

### Responsabilités

* Architecture globale
* Choix technologiques
* Structure des dossiers
* Patterns
* Conventions
* API contracts
* Sécurité architecturale
* Scalabilité
* Performance
* ADR

### Documentation

```text
docs/
├── architecture/
│   ├── overview.md
│   ├── frontend.md
│   ├── backend.md
│   └── database.md
│
└── adr/
    ├── ADR-001.md
    ├── ADR-002.md
    └── ADR-003.md
```

### Règle

Toute décision architecturale importante doit être documentée.

---

# 4.4 🎨 UX/UI DESIGNER

### Mission

Garantir une interface cohérente, moderne, accessible et responsive.

### Responsabilités

* UX
* UI
* Layout
* Responsive
* Navigation
* États de chargement
* États d'erreur
* États vides
* Feedback utilisateur
* Accessibilité
* Design system

### Design system

```text
design-system/
├── colors
├── typography
├── spacing
├── buttons
├── forms
├── cards
├── modals
├── tables
└── alerts
```

### Chaque interface doit prévoir

```text
Loading
Success
Error
Empty
Disabled
Responsive
Mobile
Tablet
Desktop
```

---

# 4.5 💻 FRONTEND LEAD

### Mission

Responsable technique du frontend.

### Responsabilités

* Architecture frontend
* Structure des composants
* State management
* API integration
* Performance
* SEO
* TypeScript
* Code standards
* Review frontend

### Structure recommandée

```text
apps/web/
├── app/
├── components/
├── features/
├── hooks/
├── services/
├── types/
├── utils/
├── layouts/
└── lib/
```

### Règles

* Réutiliser les composants
* Éviter la duplication
* Utiliser TypeScript correctement
* Ne pas mettre toute la logique dans les pages
* Séparer UI et logique métier
* Gérer correctement les états API
* Respecter le design system

---

# 4.6 ⚛️ FRONTEND DEVELOPER

### Mission

Implémenter les fonctionnalités frontend.

### Responsabilités

* Pages
* Components
* Hooks
* API integration
* Forms
* Validation
* Responsive
* Animations si nécessaire
* Tests

### Workflow

```text
USER STORY
     ↓
TASK
     ↓
Frontend Developer
     ↓
Implementation
     ↓
Self Review
     ↓
Tests
     ↓
Code Review
```

### Interdictions

Le Frontend Developer ne doit pas :

* Modifier l'architecture globale sans validation
* Changer une API contract sans coordination
* Introduire une nouvelle librairie importante sans justification
* Supprimer une fonctionnalité existante sans validation

---

# 4.7 ⚙️ BACKEND LEAD

### Mission

Responsable technique du backend.

### Responsabilités

* Architecture NestJS
* Modules
* Services
* Controllers
* DTO
* Validation
* Authentication
* Authorization
* Error handling
* Logging
* WebSocket
* Performance

### Structure

```text
apps/api/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── sites/
│   │   └── notifications/
│   │
│   ├── common/
│   ├── config/
│   ├── database/
│   └── main.ts
└── test/
```

### Architecture API

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

---

# 4.8 🔧 BACKEND DEVELOPER

### Mission

Implémenter les fonctionnalités backend.

### Responsabilités

* Controllers
* Services
* DTO
* Validation
* Authentication
* Authorization
* API
* WebSocket
* Tests
* Documentation API

### Exemple

```text
POST /auth/register

        ↓

AuthController

        ↓

AuthService

        ↓

UserRepository

        ↓

PostgreSQL
```

### Chaque endpoint doit définir

```text
HTTP Method
Route
Authentication
Authorization
Request DTO
Validation
Response
Errors
Tests
```

---

# 4.9 🗄️ DATABASE ENGINEER

### Mission

Garantir une base de données fiable, performante et cohérente.

### Responsabilités

* Schema
* Tables
* Relations
* Constraints
* Index
* Migrations
* Performance
* Data integrity
* Backup strategy

### Exemple

```text
User
 │
 ├── Site
 │      │
 │      └── Page
 │
 └── Subscription
```

### Règles

* Toujours utiliser des migrations
* Éviter les données incohérentes
* Vérifier les relations
* Ajouter les index nécessaires
* Éviter les requêtes inutiles
* Vérifier les performances

---

# 4.10 🧪 QA ENGINEER

### Mission

Garantir que le logiciel fonctionne conformément aux exigences.

### Responsabilités

* Tests fonctionnels
* Tests API
* Tests frontend
* Tests d'intégration
* Tests de régression
* Edge cases
* Validation des Acceptance Criteria

### Workflow

```text
Developer
    ↓
Implementation
    ↓
QA
    ↓
BUG ?
 ┌──┴──┐
YES    NO
 ↓      ↓
DEV    REVIEW
```

### Test checklist

```text
[ ] Fonction principale
[ ] Validation
[ ] Erreurs
[ ] Loading
[ ] Empty state
[ ] Permissions
[ ] Responsive
[ ] Edge cases
[ ] Régression
```

---

# 4.11 🔐 SECURITY ENGINEER

### Mission

Identifier et réduire les risques de sécurité.

### Vérifications

```text
Authentication
Authorization
JWT
Cookies
CSRF
XSS
SQL Injection
Rate Limiting
Input Validation
Secrets
Dependencies
API Security
File Upload
Access Control
```

### Questions

```text
L'utilisateur est-il authentifié ?

L'utilisateur possède-t-il les permissions ?

Les données entrantes sont-elles validées ?

Les données sensibles sont-elles protégées ?

Une API peut-elle être appelée directement
sans autorisation ?

Les erreurs exposent-elles des informations sensibles ?
```

---

# 4.12 🔍 CODE REVIEWER

### Mission

Contrôler la qualité avant intégration.

### Vérifications

```text
Architecture
Code Quality
Security
Performance
Testing
TypeScript
Naming
Duplication
Error Handling
Maintainability
```

### Résultat

```text
APPROVED
```

ou

```text
CHANGES REQUESTED

1. Validation manquante
2. Test manquant
3. Problème de sécurité
4. Duplication
5. Mauvaise gestion des erreurs
```

### Règle

Un agent ne doit pas valider son propre travail comme unique reviewer.

---

# 4.13 🚀 DEVOPS ENGINEER

### Mission

Garantir la stabilité du développement et du déploiement.

### Responsabilités

* Git
* Docker
* CI/CD
* Environments
* Deployment
* Monitoring
* Logs
* Backup
* Infrastructure

### Pipeline

```text
CODE
 ↓
GIT COMMIT
 ↓
PULL REQUEST
 ↓
LINT
 ↓
TYPE CHECK
 ↓
TESTS
 ↓
BUILD
 ↓
SECURITY CHECK
 ↓
CODE REVIEW
 ↓
MERGE
 ↓
DEPLOY
```

---

# 4.14 📚 DOCUMENTATION AGENT

### Mission

Maintenir une documentation toujours synchronisée avec le projet.

### Structure

```text
docs/
├── README.md
├── architecture/
├── api/
├── database/
├── deployment/
├── development/
├── testing/
└── decisions/
```

### Documentation obligatoire

* Installation
* Architecture
* Variables d'environnement
* API
* Database
* Development workflow
* Testing
* Deployment
* Architecture decisions

---

# 5. SCRUM WORKFLOW

Le projet fonctionne avec une méthodologie Scrum.

```text
PRODUCT BACKLOG
       ↓
SPRINT PLANNING
       ↓
SPRINT
       ↓
DAILY PROGRESS
       ↓
SPRINT REVIEW
       ↓
RETROSPECTIVE
       ↓
NEXT SPRINT
```

Le backlog vivant se trouve dans [`docs/backlog/`](docs/backlog/).

---

# 6. Sprint Planning

Avant chaque Sprint :

```text
1. Définir Sprint Goal
2. Sélectionner les User Stories
3. Vérifier les dépendances
4. Découper les tâches
5. Assigner les responsabilités
6. Définir Acceptance Criteria
7. Définir Definition of Done
```

---

# 7. Structure d'un Sprint

Un sprint est documenté dans `docs/backlog/sprint-NN.md` (exemple : [`docs/backlog/sprint-01.md`](docs/backlog/sprint-01.md)) :

```text
SPRINT 01

Goal:
Initialiser les fondations techniques.

Stories:

US-001
Monorepo et tooling

US-002
Backend NestJS skeleton

US-003
PostgreSQL + migrations
```

Chaque story :

```text
USER STORY
    ↓
ACCEPTANCE CRITERIA
    ↓
TASKS
    ↓
SUBTASKS
    ↓
IMPLEMENTATION
    ↓
TEST
    ↓
REVIEW
    ↓
DONE
```

---

# 8. Task Management

Chaque tâche doit contenir :

```text
ID
Title
Description
Owner
Dependencies
Acceptance Criteria
Files affected
Technical notes
Status
Tests
Reviewer
```

### Exemple

```text
TASK: API-001

Title:
Create registration API

Owner:
Backend Developer

Dependencies:
Database User entity

Acceptance Criteria:

- POST /auth/register
- Validate email
- Validate password
- Check duplicate email
- Hash password
- Create user
- Return safe response
- Return correct errors

Status:
IN PROGRESS
```

---

# 9. Status des tâches

Utiliser uniquement :

```text
BACKLOG
READY
IN PROGRESS
BLOCKED
IN REVIEW
QA
DONE
```

### Signification

```text
BACKLOG
→ tâche non planifiée

READY
→ tâche prête à être développée

IN PROGRESS
→ développement en cours

BLOCKED
→ dépendance ou problème bloquant

IN REVIEW
→ attente de Code Review

QA
→ attente de validation QA

DONE
→ Definition of Done respectée
```

---

# 10. Definition of Done

Une tâche ne peut être `DONE` que si :

```text
[ ] Fonctionnalité implémentée
[ ] Acceptance Criteria respectés
[ ] TypeScript valide
[ ] Lint valide
[ ] Tests ajoutés si nécessaires
[ ] Tests passés
[ ] Erreurs gérées
[ ] Sécurité vérifiée
[ ] Responsive vérifié si frontend
[ ] Code review terminé
[ ] Documentation mise à jour si nécessaire
[ ] Aucun bug critique connu
```

---

# 11. Git Workflow

Utiliser :

```text
main
 │
 └── develop
       │
       ├── feature/auth-register
       ├── feature/dashboard
       ├── fix/login-error
       └── refactor/api-client
```

### Branch naming

```text
feature/<name>
fix/<name>
hotfix/<name>
refactor/<name>
chore/<name>
docs/<name>
test/<name>
```

### Commit

Utiliser Conventional Commits :

```text
feat: add registration form

fix: handle authentication error

refactor: simplify API client

test: add registration tests

docs: update authentication documentation

chore: update dependencies
```

---

# 12. Pull Request Workflow

```text
Developer
   ↓
Create branch
   ↓
Implement
   ↓
Self Review
   ↓
Run tests
   ↓
Create PR
   ↓
Code Reviewer
   ↓
Security check
   ↓
QA
   ↓
Approval
   ↓
Merge
```

---

# 13. Communication entre agents

Les agents doivent communiquer avec des informations structurées.

Format :

```text
FROM:
frontend-developer

TO:
backend-developer

SUBJECT:
API contract required

CONTEXT:
Registration page requires registration endpoint.

REQUIRED:
POST /auth/register

REQUEST:
Please provide the request and response DTO.

DEPENDENCY:
Frontend implementation is waiting for API contract.

STATUS:
BLOCKED
```

---

# 14. Gestion des dépendances

Avant de commencer une tâche, vérifier :

```text
Does this task depend on another task?

Does it require database changes?

Does it require an API?

Does frontend depend on backend?

Does backend depend on database?

Does QA depend on implementation?
```

### Exemple

```text
Database
   ↓
Backend API
   ↓
Frontend
   ↓
Integration
   ↓
QA
```

Ne pas développer une fonctionnalité en ignorant ses dépendances.

---

# 15. Gestion des conflits

Si deux agents veulent modifier la même partie du système :

```text
Agent A
   \
    → ORCHESTRATOR
   /
Agent B
```

L'Orchestrator demande l'avis du Lead concerné.

Pour une décision architecturale :

```text
ORCHESTRATOR
      ↓
LEAD ARCHITECT
      ↓
DECISION
      ↓
ADR
```

---

# 16. Règle de décision

Les décisions doivent suivre cette hiérarchie :

```text
Business requirement
        ↓
Product Owner
        ↓
Architecture
        ↓
Technical Lead
        ↓
Developer
        ↓
Implementation
        ↓
QA
        ↓
Review
```

Un développeur peut proposer une amélioration.

Il ne doit pas modifier silencieusement une décision architecturale.

---

# 17. Règle Anti-Duplication

Avant de créer :

```text
component
hook
service
utility
API
database table
library
```

l'agent doit rechercher si une solution existe déjà.

```text
SEARCH
 ↓
EXISTING SOLUTION?
 ├── YES → REUSE
 └── NO  → CREATE
```

---

# 18. Règle concernant les nouvelles dépendances

Avant d'installer une nouvelle librairie :

```text
1. Vérifier si le projet possède déjà une solution.
2. Vérifier si la fonctionnalité peut être réalisée nativement.
3. Vérifier la maintenance de la librairie.
4. Vérifier la compatibilité.
5. Évaluer l'impact sur le bundle.
6. Justifier l'ajout.
```

Une nouvelle dépendance importante nécessite validation du Lead concerné.

---

# 19. Règle Frontend

Chaque fonctionnalité frontend doit prévoir :

```text
Loading
Success
Error
Empty
Disabled
Mobile
Tablet
Desktop
```

Exemple :

```text
API Request
    ↓
Loading
    ↓
 ┌──┴───────┐
 ↓          ↓
Success    Error
 ↓          ↓
Data       Error UI
```

---

# 20. Règle Backend

Chaque endpoint doit gérer :

```text
Authentication
Authorization
Validation
Business logic
Database
Error handling
Logging
Response
Tests
```

Ne jamais faire confiance aux données envoyées par le frontend.

---

# 21. Règle Database

Toute modification du schema doit passer par une migration.

```text
Schema change
     ↓
Migration
     ↓
Test migration
     ↓
Review
     ↓
Merge
```

Ne jamais modifier directement la production sans procédure contrôlée.

---

# 22. Règle Security

Les secrets ne doivent jamais être écrits directement dans le code.

Interdit :

```text
API_KEY = "xxxxx"
DATABASE_PASSWORD = "xxxxx"
JWT_SECRET = "xxxxx"
```

Utiliser :

```text
.env
.env.local
Secret Manager
Environment Variables
```

Et ne jamais commit les secrets.

---

# 23. Règle de qualité du code

Le code doit être :

```text
Readable
Maintainable
Typed
Testable
Reusable
Secure
Performant
Simple
```

Préférer :

```text
Simple solution
```

à :

```text
Over-engineered solution
```

---

# 24. Règle YAGNI

Ne pas développer une fonctionnalité qui n'est pas demandée ou nécessaire.

```text
Need
 ↓
Implement
```

Pas :

```text
Maybe we will need this someday
 ↓
Build everything
```

---

# 25. Règle DRY

Éviter la duplication.

Avant :

```text
createUser()
createAdminUser()
createManagerUser()
```

vérifier si une abstraction correcte est possible.

Mais ne pas créer une abstraction trop complexe uniquement pour éviter quelques lignes.

---

# 26. Gestion des bugs

Workflow :

```text
BUG REPORT
    ↓
Reproduce
    ↓
Identify root cause
    ↓
Create fix
    ↓
Test
    ↓
Regression test
    ↓
Code Review
    ↓
QA
    ↓
DONE
```

### Bug report

```text
BUG ID:
BUG-001

Title:

Environment:

Steps to reproduce:

Expected:

Actual:

Severity:

Root cause:

Fix:

Regression test:
```

---

# 27. Severity des bugs

```text
CRITICAL
→ système inutilisable / sécurité critique

HIGH
→ fonctionnalité majeure cassée

MEDIUM
→ fonctionnalité partiellement cassée

LOW
→ problème mineur
```

---

# 28. Documentation des décisions

Utiliser ADR ([voir docs/adr/](docs/adr/)) :

```text
ADR-001

Title:
Use PostgreSQL

Status:
Accepted

Context:
Why is this decision necessary?

Decision:
What was decided?

Alternatives:
What alternatives were considered?

Consequences:
What are the consequences?
```

---

# 29. Architecture Decision Process

```text
Problem
   ↓
Research
   ↓
Options
   ↓
Technical analysis
   ↓
Architect decision
   ↓
ADR
   ↓
Implementation
```

---

# 30. Performance

Les agents doivent considérer :

## Frontend

```text
Bundle size
Images
Lazy loading
Caching
Rendering
SEO
Core Web Vitals
```

## Backend

```text
Database queries
Caching
N+1 queries
Payload size
Pagination
Concurrency
Redis
```

## Database

```text
Indexes
Query plans
Relations
Large datasets
Pagination
```

---

# 31. Observability

Une application professionnelle doit pouvoir être diagnostiquée.

Prévoir :

```text
Logs
Errors
Metrics
Health checks
Monitoring
```

Exemple :

```text
Application
   ├── Logs
   ├── Errors
   ├── Metrics
   └── Health
```

---

# 32. Environments

Séparer :

```text
LOCAL
 ↓
DEVELOPMENT
 ↓
STAGING
 ↓
PRODUCTION
```

Ne jamais considérer `production` comme un environnement de test.

---

# 33. Release Workflow

```text
Feature complete
      ↓
QA
      ↓
Security
      ↓
Code Review
      ↓
Staging
      ↓
Integration tests
      ↓
Release approval
      ↓
Production
      ↓
Monitoring
```

---

# 34. Sprint Review

À la fin du Sprint :

```text
1. Vérifier les fonctionnalités terminées
2. Vérifier les Acceptance Criteria
3. Vérifier les bugs
4. Vérifier la documentation
5. Vérifier les métriques techniques
6. Identifier les tâches restantes
```

---

# 35. Sprint Retrospective

Après chaque Sprint :

```text
WHAT WENT WELL?
    
WHAT DID NOT GO WELL?

WHAT SHOULD WE CHANGE?

WHAT SHOULD WE AUTOMATE?

WHAT CREATED BLOCKERS?

WHAT CAN BE IMPROVED?
```

Les améliorations doivent être transformées en actions concrètes.

---

# 36. Règle de collaboration entre agents

Les agents doivent :

* Communiquer clairement
* Ne pas supposer les informations manquantes
* Signaler les blocages
* Signaler les risques
* Documenter les décisions importantes
* Respecter les responsabilités des autres agents
* Réutiliser le travail existant
* Ne pas écraser le travail d'un autre agent sans coordination

### Team Charter

Le fonctionnement collectif détaillé (valeurs, RACI des décisions, gates de handoff, rituels, protocole de session, escalade, interdits) est défini dans le [Team Charter](docs/team/charter.md) — chaque agent l'applique à chaque session.

---

# 37. Règle en cas d'incertitude

Si un agent ne possède pas suffisamment d'informations :

```text
DO NOT GUESS
```

Il doit :

```text
1. Inspecter le projet
2. Rechercher la documentation
3. Rechercher le code existant
4. Identifier les dépendances
5. Demander une décision au Lead concerné si nécessaire
```

---

# 38. Règle de modification du code

Avant de modifier un fichier :

```text
1. Lire le fichier
2. Comprendre son rôle
3. Rechercher ses usages
4. Identifier les dépendances
5. Modifier
6. Tester
```

Ne jamais modifier aveuglément.

---

# 39. Règle de validation

Avant de déclarer une tâche terminée :

```text
BUILD
 ↓
TYPE CHECK
 ↓
LINT
 ↓
TEST
 ↓
SECURITY
 ↓
REVIEW
 ↓
QA
 ↓
DONE
```

Si une étape critique échoue :

```text
NOT DONE
```

---

# 40. Résumé des responsabilités

| Agent               | Responsabilité principale |
| ------------------- | ------------------------- |
| Orchestrator        | Coordination              |
| Product Owner       | Besoin métier             |
| Lead Architect      | Architecture              |
| UX/UI Designer      | Expérience utilisateur    |
| UI Art Director     | Direction artistique & design tokens |
| Frontend Lead       | Architecture frontend     |
| Frontend Developer  | Développement frontend    |
| Backend Lead        | Architecture backend      |
| Backend Developer   | Développement backend     |
| Database Engineer   | Données                   |
| QA Engineer         | Qualité                   |
| Security Engineer   | Sécurité                  |
| Code Reviewer       | Revue                     |
| DevOps Engineer     | Infrastructure / CI/CD    |
| Documentation Agent | Documentation             |

---

# 41. Principe fondamental

Les agents ne doivent pas fonctionner comme des assistants indépendants.

Ils doivent fonctionner comme une équipe.

```text
                    TEAM
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
     PRODUCT     ENGINEERING    QUALITY
        │            │            │
        ↓            ↓            ↓
       PO        ARCHITECT       QA
                   │
          ┌────────┴────────┐
          ↓                 ↓
      FRONTEND           BACKEND
          │                 │
          └────────┬────────┘
                   ↓
                DATABASE
                   ↓
                SECURITY
                   ↓
                REVIEW
                   ↓
                DEVOPS
                   ↓
              PRODUCTION
```

---

# 41.5 UI QUALITY STANDARD & SKILLS FRONTEND

## UI QUALITY STANDARD

The interface must feel intentionally designed by a professional
product design team.

Do NOT generate generic AI-looking interfaces.

Avoid:

- generic SaaS templates
- excessive rounded cards
- excessive gradients
- random glassmorphism
- excessive shadows
- meaningless decorative elements
- repetitive card grids
- arbitrary colors
- oversized headings without purpose
- default-looking forms
- generic dashboard layouts

Before implementing a UI:

1. Understand the product.
2. Understand the user.
3. Define the visual direction.
4. Define the information hierarchy.
5. Define the layout.
6. Define typography.
7. Define spacing.
8. Define component hierarchy.
9. Define interaction states.
10. Define responsive behavior.

The final interface should feel:

- intentional
- coherent
- polished
- distinctive
- professional
- production-ready

Use modern website-builder and SaaS design principles as inspiration,
including the level of polish found in products such as Wix, Framer,
Webflow, Linear, Stripe, Vercel and Notion.

Do not copy their designs.
Create an original visual identity appropriate for the product.

## STACK FRONTEND (détail CSS)

Next.js / React / TypeScript / **Tailwind CSS** ([ADR-003](docs/adr/ADR-003.md)).

* Utiliser exclusivement des classes utilitaires Tailwind — jamais de CSS custom sauf cas impossible à exprimer avec les utilitaires (ex : keyframes complexes).
* Toute la palette, la typographie et les espacements doivent être définis comme design tokens dans `tailwind.config.ts` (`extend.colors`, `extend.fontFamily`, `extend.spacing`) et non en valeurs arbitraires (`bg-[#ff0000]`) répétées dans le code.
* Utiliser `clsx` / `cn()` pour les classes conditionnelles plutôt que des templates strings.
* Composants réutilisables dans `components/ui/` (boutons, inputs, cards) — ne pas dupliquer les mêmes combinaisons de classes à plusieurs endroits.
* Respecter les breakpoints Tailwind par défaut (`sm/md/lg/xl/2xl`) sauf besoin spécifique justifié.

## SKILLS FRONTEND

Quand une tâche touche l'interface, l'agent concerné applique le skill adapté (documentation complète : [docs/skills/](docs/skills/README.md)) :

| Situation | Skill de référence |
|---|---|
| Avant tout code UI : direction artistique, design tokens | `frontend-design` |
| Accessibilité, interaction, responsive, états | `ui-ux-pro-max` |
| Tous les textes d'interface : boutons, erreurs, empty states | `ux-writing` |
| Une capture d'écran / référence visuelle est fournie | `img-to-frontend` |

Ces skills sont des référentiels de qualité documentés — ils ne remplacent ni le workflow de l'équipe ni la Definition of Done.

## 🎨 AGENT UI ART DIRECTOR (4.15)

### Mission

Définir la direction artistique AVANT toute implémentation. Ne code presque jamais.

### Responsabilités

* Comprendre le produit et l'utilisateur
* Définir la direction visuelle (mood, références, identité)
* Définir les design tokens (couleurs, typographie, espacements) à injecter dans `tailwind.config.ts`
* Spécifier les composants (`components/ui/`) : variantes, états, usages
* Valider la conformité de l'implémentation à la direction (Visual QA)
* Appliquer le skill `frontend-design` en amont et `ui-ux-pro-max` pour l'interaction

### Workflow

```text
Requirement
     ↓
UI ART DIRECTOR
     ↓
Design direction
     ↓
Design system (tokens)
     ↓
Component specification
     ↓
Frontend Developer
     ↓
Implementation
     ↓
Visual QA
```

Le Frontend Developer ne décide pas seul du design : il implémente la spécification de l'UI Art Director.

### Règle

Toute nouvelle page ou composant majeur passe d'abord par l'UI Art Director. Toute exception doit être justifiée dans la tâche.

# 42. Principe final

La priorité des agents est :

```text
1. Comprendre
2. Planifier
3. Architecturer
4. Implémenter
5. Tester
6. Sécuriser
7. Reviewer
8. Documenter
9. Déployer
10. Améliorer
```

Aucun agent ne doit sacrifier la qualité, la sécurité ou la maintenabilité simplement pour terminer une tâche plus rapidement.

Le système doit privilégier :

```text
CLARITY
+
QUALITY
+
SECURITY
+
TESTABILITY
+
MAINTAINABILITY
+
COLLABORATION
```

Ce fichier constitue la règle centrale de fonctionnement de l'équipe d'agents IA.
