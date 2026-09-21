# Sprint 06 — Monétisation (Stripe)

> **Goal du sprint** : un utilisateur Gratuit peut **passer au plan Pro** et l'applique immédiatement à ses quotas.
> Workflow de livraison : charter [§9](../team/charter.md) — une branche `feature/<carte>` et une PR par carte, CI obligatoirement verte.

Owner des stories : voir tableaux. Dépendances : Sprint 05 ✔ DONE (thèmes, upload, vues).

---

### US-070 — Abonnement Stripe (backend) — `READY`

Owner: ⚙️ Backend · Dépend de: Sprint 05 (✅)

| Carte | Tâche | Owner |
|---|---|---|
| STRIPE-001 | Dépendance `stripe`, client Stripe paresseux, env `STRIPE_SECRET_KEY` (+ `.env.example`) | 🏗️ architect |
| STRIPE-002 | `GET /subscription/me` — état de l'abonnement + plan courant | ⚙️ backend |
| STRIPE-003 | `POST /subscription/checkout` — session Stripe Checkout (price configuré, Plan Pro lié par `STRIPE_PRICE_PRO`), renvoie l'URL de paiement | ⚙️ backend |
| STRIPE-004 | Webhook `POST /webhooks/stripe` (@Public, signature vérifiée) — `checkout.session.completed` active la souscription Pro | 🔐 security |

### US-071 — Application du plan (backend) — `READY`

Owner: 🗄️ Database/Backend · Dépend de: US-070

| Carte | Tâche | Owner |
|---|---|---|
| PLAN-001 | L'abonnement actif fait autorité sur les quotas : le service sites lit le plan de l'abonnement actif (fallback : plan du user) | 🗄️ database |
| PLAN-002 | Tests e2e : état initial Gratuit, checkout 402 sans Stripe configuré, webhook (signature invalide → 400) | 🧪 qa |

### US-072 — Upgrade depuis le quota (frontend) — `READY`

Owner: 💻 Frontend · Dépend de: US-070, US-071

| Carte | Tâche | Owner |
|---|---|---|
| BILL-001 | Message de quota : lien « Passer au plan Pro » quand le quota est atteint | 💻 frontend |
| BILL-002 | Page `/dashboard/billing` — plan courant, état d'abonnement, bouton Payer (redirige vers Stripe Checkout) | 💻 frontend |
| BILL-003 | Retour de paiement `/dashboard/billing?success=1` : rechargement du plan + bandeau de confirmation | 💻 frontend |

---

## Definition of Done (rappel charter §4.12)

```
[ ] Acceptance Criteria respectés       [ ] Responsive si frontend
[ ] TypeScript valide                   [ ] Code review terminé (sur PR)
[ ] Lint valide                         [ ] Documentation à jour
[ ] Tests passés                        [ ] CI verte sur la PR
```

---

## Bilan Sprint 06 — DONE

| Story | Livré |
|---|---|
| **US-070** ✅ | Module subscription : client Stripe paresseux, `GET /subscription/me`, `POST /subscription/checkout` (session Checkout, plan Pro via `STRIPE_PRICE_PRO`), webhook signé `checkout.session.completed` → souscription Pro active |
| **US-071** ✅ | Quotas suivent l'abonnement actif (fallback plan du user) · 4 tests e2e (état initial, 402 sans Stripe, webhook signature invalide → 400, site inconnu → 404) |
| **US-072** ✅ | Lien « Passer au plan Pro » dans le message de quota · page `/dashboard/billing` (plan courant, état, bouton Payer) · retour `?success=1` avec bandeau de confirmation et rafraîchissement |

**Gates** : 64/64 tests API PASS · CI verte (#24→#26) · QA réelle : message de quota cliquable, page billing rend le plan Gratuit, checkout sans Stripe configuré → message clair côté UI.
**Hors périmètre (prochain sprint)** : vraie carte bancaire en mode test Stripe (clés manquantes en local), webhooks de renouvellement/annulation, plan Business.

### Livraisons
- PR #24 planning · PR #25 backend + frontend Stripe · PR #26 bilan — release `preprod → main` #27
