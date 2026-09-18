# Direction artistique & Design tokens — Site.mg

> **Rôle** : UI Art Director ([AGENTS.md §4.15](../../AGENTS.md#415--agent-ui-art-director-415))
> **Skill appliqué** : `frontend-design` (chaîne Purpose → Audience → Visual direction → Typography → Layout → Components)
> **Destinataires** : Frontend Developer (implémentation), DevOps (setup FOND-002b), QA (conformité visuelle)
> **Statut** : ✅ Spécification prête pour FOND-002b

---

## 1. Purpose (le produit)

Site.mg permet à un entrepreneur non technique de créer et publier un site web professionnel en quelques minutes. L'interface porte **deux promesses simultanées** :

1. **Le pouvoir** : « ce que tu construis ici est aussi beau que ce qu'une agence ferait »
2. **La simplicité** : « tu n'as jamais besoin d'aide pour y arriver »

## 2. Audience

* **Primaire** : entrepreneurs, indépendants, TPE francophones (Madagascar + diaspora francophone) — souvent sur mobile, sensibles au prix, méfiants envers le « trop technique ».
* **Secondaire** : créatifs (photographes, artisans) qui jugent d'abord l'esthétique — si l'éditeur est laid, ils partent.
* **Conséquence design** : confiance par la clarté (pas par l'effet) ; lisibilité mobile-first ; un français impeccable (skill `ux-writing`).

## 3. Visual direction (le parti pris)

> **« L'atelier calme »** — la confiance d'un outil professionnel, la chaleur d'un studio créatif.

| Principe | Application |
|---|---|
| **Calme, pas tiède** | Grandes zones de blanc/ivoire, UNE couleur vive (indigo) utilisée avec parcimonie ; rien qui crie, tout est intentionnel |
| **Typographie comme identité** | La titraison (Sora) porte le caractère ; le texte (Inter) assure l'efficacité — contraste de personnalités assumé |
| **Structure visible** | Grille sentie : bordures fines `1px` eau-forte plutôt que shadows partout ; les radius racontent (10px contenu / 14px cartes / 999px pills) |
| **Chaleur maîtrisée** | Accents ambre réfléchi et corail action — jamais décoratifs, toujours sémantiques |
| **Profondeur minimale** | Ombres douces et basses uniquement au repos ; le focus et le hover soulèvent, jamais l'inverse |

**Anti-patterns interdits** (rappel [UI QUALITY STANDARD](../../AGENTS.md#415-ui-quality-standard--skills-frontend)) : gradients paresseux, glassmorphism gratuit, cards arrondies en boucle, bleu Tailwind par défaut, titres géants sans hiérarchie.

**Références d'exigence** (sans les copier) : Linear (discipline), Stripe (typo), Framer (mouvement), Notion (clarté), Webflow (densité maîtrisée).

## 4. Design tokens

> ⚠️ **Source de vérité = `tailwind.config.ts`** (à créer en FOND-002b). Ce document en est la spécification ; aucune valeur arbitraire dans le code ([ADR-003](../adr/ADR-003.md)).

### 4.1 Couleurs — palette « Ivoire & Indigo »

```text
primaire (indigo — actions, liens, focus)
  50  #EEF2FF    100 #E0E7FF    200 #C7D2FE    300 #A5B4FC
  400 #818CF8    500 #6366F1  ← 600 #4F46E5 (main)    700 #4338CA
  800 #3730A3    900 #312E81

neutres (ivoire → encre — fonds, textes, bordures)
  50  #FAFAF9  ← fond application (ivoire, jamais #fff brut sauf surfaces)
  100 #F5F5F4    200 #E7E5E4    300 #D6D3D1
  400 #A8A29E    500 #78716C
  600 #57534E    700 #44403C
  800 #292524  ← texte principal
  900 #1C1917  ← titres

sémantiques
  success  #16A34A    warning (ambre réfléchi) #D97706
  danger   (corail action) #E11D48    info  #0284C7

surfaces
  page    neutral-50    card   #FFFFFF    sunken  neutral-100
  dark    #1C1917 (hero/CTA d'exception, texte neutral-50)
```

Règles d'usage : `primary-600` = couleur d'action unique du produit ; le corail `danger` porte les actions destructrices ET la marque chaleureuse (badges, moments clés) — jamais les deux dans la même zone ; neutral-50 en fond global est ce qui distingue Site.mg des outils « blanc clinique ».

### 4.2 Typographie — duo Sora / Inter

| Rôle | Fonte | Graisses | Notes |
|---|---|---|---|
| **Titres** | **Sora** (Google Fonts) | 600, 700 | géométrique, caractère technique-chaleureux ; `tracking-tight` à partir de `text-3xl` |
| **Texte courant + UI** | **Inter** | 400, 500, 600 | standard de lisibilité ; `tracking-normal` |
| **Code / tokens** | **JetBrains Mono** (fallback) | 400, 500 | builder, exports |

Échelle (`leading` intégré) :

```text
display   4.5rem/1   (hero marketing, ≥ xl seulement)
h1        3rem/1.1   h2   2.25rem/1.15   h3   1.5rem/1.3
body-lg   1.125rem/1.6   body   1rem/1.6   small  0.875rem/1.5
```

Mobile : `display → 3rem`, `h1 → 2.25rem` (jamais de titre qui déborde).

### 4.3 Espacements & grille

* **Base 4px** — échelle Tailwind standard (`1`=4px … `16`=64px).
* **Rythme de section** : `py-16` mobile / `py-24` desktop (jamais moins pour une section pleine).
* **Gouttières page** : `px-4 / px-6 / px-8` selon breakpoint ; conteneur `max-w-7xl`.
* **Card padding** : `p-6` standard, `p-8` mise en avant.
* **Espacement Titre↔contenu** : `mt-2` (sous-titre), `mt-8` (blocs).

### 4.4 Rayons, ombres, mouvement

```text
radius   input/button  10px    card  14px    pill  999px
shadow   resting  0 1px 2px rgb(0 0 0 / 0.05)
         raised   0 4px 12px rgb(0 0 0 / 0.08)     (hover/focus/menu uniquement)
motion   durées 150ms (états) / 250ms (entrées) / 400ms (page)
         easing  cubic-bezier(0.4, 0, 0.2, 1) ; respecter prefers-reduced-motion
```

## 5. Spécification des composants (`components/ui/`)

> Contrat pour FOND-002b (squelette) et les stories suivantes. Chaque composant déclare ses variantes via `cn()` ([ADR-003](../adr/ADR-003.md)).

| Composant | Variantes | États obligatoires |
|---|---|---|
| `Button` | `primary` (indigo 600) · `secondary` (bordure neutral-200, fond card) · `ghost` · `danger` (corail) · `link` | hover · focus-visible ring indigo · disabled · loading (spinner inline) |
| `Input` / `Textarea` | default · error (bordure danger + message) | focus ring · disabled · readOnly + hint, erreur accessibles (aria-describedby) |
| `Card` | flat · bordered (eau-forte 1px) · elevated | — |
| `Badge` | neutral · success · warning · danger · primary | — |
| `Alert` | info · success · warning · danger | rôle ARIA + icône |
| `Spinner` | sm · md · lg | — |
| `Modal` | — | focus trap, Escape, overlay |

**Microcopy** : les textes de ces composants (ex. boutons « Enregistrer les modifications », jamais « Submit ») suivent le skill `ux-writing`.

## 6. Layout — architecture visuelle des zones

| Zone | Traitement |
|---|---|
| Marketing | généreux, `display` + sections `py-16/24`, preuves chiffrées en `h2` Sora |
| Auth | centré, card 480px `radius-14`, fond ivoire, logo sobre |
| Dashboard | sidebar neutral-100, contenu card sur fond ivoire, densité moyenne |
| Builder | chrome réduit, canvas clair au centre, panneaux bordés eau-forte |
| Site publié | **neutre** : le thème du client prime, nos tokens ne s'imposent pas |

## 7. Critères de conformité (checklist QA visuelle)

```text
[ ] Aucune couleur hors tokens (grep bg-[#/text-[# interdit)
[ ] Aucune typo hors Sora/Inter (fallback system OK)
[ ] Radius/shadows conformes (pas de shadow-lg décoratif)
[ ] États hover/focus/disabled/loading présents sur tous les interactifs
[ ] Contrastes AA (4.5:1 texte, 3:1 large) — palette validée par construction
[ ] prefers-reduced-motion respecté
[ ] Mobile ≥ 360px sans débordement
```

---

### Handoff

```text
FROM: ui-art-director
TO: devops + frontend-developer
SUBJECT: Design tokens prêts pour FOND-002b
CONTEXT: Sprint 01 — le setup Tailwind peut démarrer
REQUIRED: tailwind.config.ts conforme à la section 4 + Button/Input/Card de démo (section 5)
DEPENDENCY: FOND-001 (scaffold) doit être terminé avant
STATUS: READY
```
