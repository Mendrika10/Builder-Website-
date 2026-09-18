# Skills Frontend — Référentiels de qualité

> Ces skills proviennent de l'écosystème Codex/Claude Code. Dans ce projet, ils sont intégrés comme **référentiels de qualité** appliqués par nos agents via [AGENTS.md](../../AGENTS.md) — aucune installation externe n'est requise. Ils sont framework-agnostiques : nos règles de stack (Tailwind, [ADR-003](../adr/ADR-003.md)) priment sur leurs exemples.

## Les 4 skills

### 1. `frontend-design` — direction artistique

Produire des interfaces distinctives, production-grade et non génériques : direction artistique, typographie, layouts, détails visuels.

**Chaîne de réflexion imposée avant tout code UI :**

```text
Purpose → Audience → Visual direction → Typography
       → Layout → Components → Implementation
```

**Utilisé par** : UI Art Director (en amont), Frontend Developer (pour implémenter la direction définie).

### 2. `ui-ux-pro-max` — UX & interaction

Accessibilité, interaction, responsive, animation, formulaires, navigation, couleurs, data visualization, états UI.

**Utilisé par** : UI Art Director (interaction), Frontend Developer (implémentation), QA Engineer (checklist états).

Complémentaire de `frontend-design` : l'un porte l'identité visuelle, l'autre la qualité interactionnelle.

### 3. `ux-writing` — microcopy

Textes d'interface : boutons, labels, erreurs, empty states, onboarding, notifications. Standards : *purposeful, concise, conversational, clear* + accessibilité.

```text
❌ Générique                    ✅ Professionnel
Submit                          Enregistrer les modifications
Cancel                          Annuler
Something went wrong            Impossible d'enregistrer vos modifications.
No data                         Aucun projet n'est encore disponible.
```

**Utilisé par** : Frontend Developer (chaque écran), Documentation Agent.

### 4. `img-to-frontend` — référence visuelle → code

Quand une capture d'écran ou référence visuelle est fournie : analyse visuelle → layout → typographie → spacing → composants → responsive → implémentation, avec itération par captures d'écran jusqu'à conformité.

**Utilisé par** : UI Art Director (analyse), Frontend Developer (implémentation), QA (conformité visuelle).

## Routage (résumé AGENTS.md)

| Situation | Skill |
|---|---|
| Avant tout code UI : direction artistique, design tokens | `frontend-design` |
| Accessibilité, interaction, responsive, états | `ui-ux-pro-max` |
| Tous les textes d'interface | `ux-writing` |
| Référence visuelle fournie | `img-to-frontend` |

## Si installation externe souhaitée plus tard (Codex/Claude Code)

Pour information — pas requis dans ce projet :

```bash
npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max
npx skills add content-designer/ux-writing-skill --skill ux-writing
npx skills add am-will/codex-skills --skill img-to-frontend
# frontend-design : packaging Codex du skill officiel Anthropic → tarikfp/frontend-design
```
