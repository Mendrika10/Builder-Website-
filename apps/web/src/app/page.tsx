import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 lg:py-24">
      {/* Hero — tokens typo display/h1, boutons variants */}
      <section className="text-center">
        <p className="text-small font-medium uppercase tracking-wide text-primary-600">
          Sprint 01 · Fondations
        </p>
        <h1 className="mt-3 text-h1 sm:text-display">
          Design tokens <span className="text-primary-600">en action</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-body-lg text-neutral-600">
          Page de démonstration de la carte FOND-002b : palette « Ivoire &
          Indigo », duo Sora / Inter, composants <code className="font-mono text-small">components/ui</code>{" "}
          conformes à <span className="font-medium">docs/design/art-direction.md</span>.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg">Démarrer gratuitement</Button>
          <Button size="lg" variant="secondary">
            Voir la documentation
          </Button>
          <Button size="lg" variant="ghost">
            En savoir plus
          </Button>
        </div>
      </section>

      {/* Composants — Card bordered, Input états, Button loading/danger */}
      <section className="mt-24 grid gap-6 md:grid-cols-2">
        <Card variant="bordered">
          <h2 className="text-h3">Formulaire (états)</h2>
          <p className="mt-1 text-small text-neutral-500">
            Input avec label, hint, erreur — accessibles (aria-describedby).
          </p>
          <div className="mt-6 space-y-4">
            <Input label="Nom du site" placeholder="Mon portfolio" hint="Visible dans le dashboard." />
            <Input label="Slug" placeholder="mon-portfolio" error="Ce slug est déjà utilisé." />
            <div className="flex flex-wrap gap-3 pt-2">
              <Button>Enregistrer les modifications</Button>
              <Button variant="secondary" loading>
                Chargement
              </Button>
              <Button variant="danger">Supprimer</Button>
            </div>
          </div>
        </Card>

        <Card variant="elevated">
          <h2 className="text-h3">Surfaces & radius</h2>
          <p className="mt-1 text-small text-neutral-500">
            Card elevated (ombre raised), radius 14px, ombre minimale.
          </p>
          <div className="mt-6 space-y-4">
            <div className="rounded-card border border-neutral-200 bg-surface-sunken p-6">
              <p className="text-body font-medium text-neutral-800">Surface sunken</p>
              <p className="mt-1 text-small text-neutral-500">Fond neutral-100, bordure eau-forte 1px.</p>
            </div>
            <div className="rounded-card bg-surface-dark p-6">
              <p className="text-body font-medium text-neutral-50">Surface dark</p>
              <p className="mt-1 text-small text-neutral-300">Hero / CTA d&apos;exception.</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Typographie — échelle complète */}
      <section className="mt-24">
        <h2 className="text-h2">Échelle typographique</h2>
        <div className="mt-8 space-y-6 border-t border-neutral-200 pt-8">
          <p className="text-display font-display text-neutral-900">Display — Sora 700</p>
          <p className="text-h1 font-display text-neutral-900">Heading 1 — Sora 700</p>
          <p className="text-h2 font-display text-neutral-900">Heading 2 — Sora 700</p>
          <p className="text-h3 font-display text-neutral-900">Heading 3 — Sora 600</p>
          <p className="text-body-lg text-neutral-700">Body large — Inter 400, ligne 1.6.</p>
          <p className="text-body text-neutral-700">Body — Inter 400.</p>
          <p className="text-small text-neutral-500">Small — Inter 400, neutral-500.</p>
        </div>
      </section>
    </main>
  );
}
