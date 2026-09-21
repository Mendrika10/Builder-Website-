"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getSession } from "@/lib/auth";
import { creerCheckout, fetchSubscription, type EtatAbonnement } from "@/lib/http";

function BillingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [user, setUser] = useState<ReturnType<typeof getSession>>(null);
  const [etat, setEtat] = useState<EtatAbonnement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [payant, setPayant] = useState(false);
  const success = params.get("success") === "1";
  const annule = params.get("annule") === "1";

  const refresh = useCallback(async () => {
    try {
      setEtat(await fetchSubscription());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chargement impossible.");
    }
  }, []);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    setUser(session);
    void refresh();
  }, [router, refresh]);

  /** BILL-003 — après un retour Stripe réussi, on recharge l'état (le webhook a activé la souscription). */
  useEffect(() => {
    if (success) void refresh();
  }, [success, refresh]);

  async function handlePayer() {
    setError(null);
    setPayant(true);
    try {
      window.location.href = await creerCheckout();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Paiement indisponible.");
      setPayant(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface-page">
      <header className="border-b border-neutral-200 bg-surface-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/dashboard" className="font-display text-h3 text-neutral-900">
            Site.mg
          </Link>
          <span className="hidden text-small text-neutral-600 sm:inline">{user?.email}</span>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-h1 text-neutral-900">Facturation</h1>
        <p className="mt-2 text-body text-neutral-600">
          Votre plan et votre abonnement — passez au niveau supérieur quand vous voulez.
        </p>

        {success && (
          <p role="status" className="mt-6 rounded-card border border-success/30 bg-success/5 px-4 py-3 text-small text-success">
            Paiement confirmé — votre abonnement est en cours d&apos;activation. Rechargez la page dans un instant si le plan n&apos;est pas encore à jour.
          </p>
        )}
        {annule && (
          <p role="status" className="mt-6 rounded-card border border-neutral-300 bg-surface-card px-4 py-3 text-small text-neutral-600">
            Paiement annulé — aucun prélèvement n&apos;a été effectué.
          </p>
        )}
        {error && (
          <p role="alert" className="mt-6 rounded-card border border-danger/30 bg-danger/5 px-4 py-3 text-small text-danger">
            {error}
          </p>
        )}

        {!etat ? (
          <p className="mt-8 text-body text-neutral-500">Chargement…</p>
        ) : (
          <Card variant="bordered" className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-small uppercase tracking-wide text-neutral-500">Plan actuel</p>
                <p className="font-display text-h2 text-neutral-900">{etat.plan}</p>
                {etat.quotas && (
                  <p className="mt-1 text-small text-neutral-500">
                    {etat.quotas.maxSites} site{etat.quotas.maxSites > 1 ? "s" : ""} · {etat.quotas.maxPages} pages par site · {etat.quotas.stockageGo} Go de stockage
                  </p>
                )}
              </div>
              {etat.plan === "Gratuit" ? (
                <Button onClick={handlePayer} loading={payant}>
                  Passer au plan Pro — 12 €/mois
                </Button>
              ) : (
                <span className="rounded-full bg-success/10 px-3 py-1 text-small font-medium text-success">
                  {etat.abonnement ? `Abonnement ${etat.abonnement.statut}` : "Actif"}
                </span>
              )}
            </div>

            {etat.abonnement && (
              <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-neutral-200 pt-6 sm:grid-cols-3">
                <div>
                  <dt className="text-small text-neutral-500">Périodicité</dt>
                  <dd className="text-body text-neutral-900">{etat.abonnement.periodicite}</dd>
                </div>
                <div>
                  <dt className="text-small text-neutral-500">Début</dt>
                  <dd className="text-body text-neutral-900">
                    {new Date(etat.abonnement.dateDebut).toLocaleDateString("fr-FR")}
                  </dd>
                </div>
                <div>
                  <dt className="text-small text-neutral-500">Fin</dt>
                  <dd className="text-body text-neutral-900">
                    {etat.abonnement.dateFin
                      ? new Date(etat.abonnement.dateFin).toLocaleDateString("fr-FR")
                      : "—"}
                  </dd>
                </div>
              </dl>
            )}
          </Card>
        )}

        <p className="mt-8 text-small text-neutral-500">
          Comparer les plans sur la <Link href="/pricing" className="underline">page tarifs</Link>.
        </p>
      </div>
    </main>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={null}>
      <BillingContent />
    </Suspense>
  );
}
