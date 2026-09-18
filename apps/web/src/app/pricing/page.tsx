"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { fetchPlans, formatPrix, type Plan } from "@/lib/plans";

const FEATURE_LABELS: Record<string, (p: Plan) => string | null> = {
  sites: (p) => `${p.maxSites} site${p.maxSites > 1 ? "s" : ""}`,
  pages: (p) => `${p.maxPages} pages par site`,
  stockage: (p) => `${p.stockageGo} Go de stockage`,
  domaine: (p) => (p.domainePerso ? "Nom de domaine personnalisé" : null),
  ssl: (p) => (p.sslInclus ? "SSL inclus" : null),
  analytics: (p) => (p.analytics ? "Statistiques de visites" : null),
  branding: (p) => (p.removeBranding ? "Sans badge Site.mg" : null),
  support: (p) => {
    const labels: Record<string, string> = {
      email: "Support par email",
      chat: "Support par chat",
      prioritaire: "Support prioritaire",
    };
    return labels[p.supportNiveau] ?? null;
  },
};

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans()
      .then(setPlans)
      .catch(() => setError("Impossible de charger les plans. L'API est-elle démarrée ?"));
  }, []);

  return (
    <main className="min-h-screen bg-surface-page px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-center font-display text-display text-neutral-900">
          Des tarifs simples
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-body text-neutral-600">
          Commencez gratuitement, passez au niveau supérieur quand votre site grandit.
        </p>

        {error && (
          <p role="alert" className="mx-auto mt-8 max-w-md rounded-card border border-danger/30 bg-danger/5 px-4 py-3 text-center text-small text-danger">
            {error}
          </p>
        )}

        {!plans && !error && (
          <div className="mt-12 flex justify-center">
            <div className="size-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          </div>
        )}

        {plans && (
          <div className="mt-12 grid gap-6 md:grid-cols-3" data-testid="plans-grid">
            {plans.map((plan, index) => {
              const features = Object.values(FEATURE_LABELS)
                .map((label) => label(plan))
                .filter(Boolean);
              const highlighted = index === 1; // Pro mis en avant
              return (
                <Card
                  key={plan.id}
                  variant={highlighted ? "elevated" : "bordered"}
                  className={highlighted ? "relative border-2 border-primary-600 p-8" : "p-8"}
                >
                  {highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-1 text-small font-medium text-white">
                      Le plus populaire
                    </span>
                  )}
                  <h2 className="font-display text-h3 text-neutral-900">{plan.nom}</h2>
                  <p className="mt-3">
                    <span className="font-display text-h1 text-neutral-900">
                      {formatPrix(plan.prixMensuel)}
                    </span>
                    <span className="text-small text-neutral-500"> /mois</span>
                  </p>
                  {plan.prixAnnuel > 0 && (
                    <p className="text-small text-neutral-500">
                      ou {formatPrix(plan.prixAnnuel)} €/an — 2 mois offerts
                    </p>
                  )}
                  <ul className="mt-6 space-y-2.5 text-body text-neutral-600">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span aria-hidden className="mt-0.5 text-success">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/register?plan=${encodeURIComponent(plan.nom.toLowerCase())}`} className="mt-8 block">
                    <Button size="lg" variant={highlighted ? "primary" : "secondary"} className="w-full">
                      Choisir {plan.nom}
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
