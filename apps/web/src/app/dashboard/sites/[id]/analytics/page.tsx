"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getSession } from "@/lib/auth";
import { fetchAnalytics, type Statistiques } from "@/lib/analytics";

/** STATS-005 — Site sans aucune donnée : message vide au lieu d'un chart plat. */
function EtatVide() {
  return (
    <Card variant="bordered" className="mt-8">
      <h2 className="font-display text-h4 text-neutral-900">Pas encore de visites</h2>
      <p className="mt-2 text-body text-neutral-600">
        Les visites apparaissent ici dès que quelqu&apos;un consulte votre site publié.
      </p>
    </Card>
  );
}

/** STATS-005 — Plan Gratuit : upsell au lieu des statistiques. */
function UpsellPro() {
  return (
    <Card variant="bordered" className="mt-8">
      <h2 className="font-display text-h4 text-neutral-900">Les statistiques sont réservées aux plans payants</h2>
      <p className="mt-2 text-body text-neutral-600">
        Passez au plan Pro pour suivre vos vues par jour, vos pages les plus vues et la croissance de votre audience.
      </p>
      <Link href="/dashboard/billing" className="mt-4 inline-block">
        <Button>Passer au plan Pro — 12 €/mois</Button>
      </Link>
    </Card>
  );
}

/** STATS-004 — Graphique en barres des vues par jour (SVG, sans dépendance). */
function ChartVues({ serie }: { serie: { date: string; vues: number }[] }) {
  const max = Math.max(...serie.map((j) => j.vues), 1);
  const H = 120;
  const LARGEUR = 100 / serie.length;
  return (
    <svg viewBox={`0 0 100 ${H}`} className="h-36 w-full" preserveAspectRatio="none" role="img" aria-label="Vues par jour">
      {serie.map((jour, i) => {
        const h = (jour.vues / max) * (H - 8);
        return (
          <rect
            key={jour.date}
            x={i * LARGEUR + LARGEUR * 0.15}
            y={H - h}
            width={LARGEUR * 0.7}
            height={h}
            rx="0.8"
            className={jour.vues > 0 ? "fill-primary-500" : "fill-neutral-200"}
          >
            <title>{`${jour.date} — ${jour.vues} vue${jour.vues > 1 ? "s" : ""}`}</title>
          </rect>
        );
      })}
    </svg>
  );
}

export default function AnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getSession>>(null);
  const [stats, setStats] = useState<Statistiques | null>(null);
  const [gate, setGate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    setUser(session);
    fetchAnalytics(id)
      .then(setStats)
      .catch((err: unknown) => {
        if (err instanceof Error && /plan/i.test(err.message)) setGate(true);
        else setError(err instanceof Error ? err.message : "Chargement impossible.");
      });
  }, [id, router]);

  return (
    <main className="min-h-screen bg-surface-page">
      <header className="border-b border-neutral-200 bg-surface-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href={`/dashboard/sites/${id}`} className="text-body text-neutral-600 hover:text-neutral-900">
            ← Retour à l&apos;éditeur
          </Link>
          <span className="hidden text-small text-neutral-600 sm:inline">{user?.email}</span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-h1 text-neutral-900">
          Statistiques{stats ? ` — ${stats.site.nom}` : ""}
        </h1>
        <p className="mt-2 text-body text-neutral-600">Vos 30 derniers jours de visites.</p>

        {error && (
          <p role="alert" className="mt-6 rounded-card border border-danger/30 bg-danger/5 px-4 py-3 text-small text-danger">
            {error}
          </p>
        )}
        {gate && <UpsellPro />}
        {stats && stats.totalVues === 0 && <EtatVide />}
        {stats && stats.totalVues > 0 && (
          <>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card variant="bordered">
                <p className="text-small uppercase tracking-wide text-neutral-500">Vues (30 jours)</p>
                <p className="font-display text-h2 text-neutral-900">{stats.totalVues.toLocaleString("fr-FR")}</p>
              </Card>
              <Card variant="bordered">
                <p className="text-small uppercase tracking-wide text-neutral-500">Aujourd&apos;hui</p>
                <p className="font-display text-h2 text-neutral-900">{stats.vuesAujourdHui.toLocaleString("fr-FR")}</p>
              </Card>
              <Card variant="bordered">
                <p className="text-small uppercase tracking-wide text-neutral-500">Pages suivies</p>
                <p className="font-display text-h2 text-neutral-900">{stats.topPages.length}</p>
              </Card>
            </div>

            <Card variant="bordered" className="mt-6">
              <h2 className="font-display text-h4 text-neutral-900">Vues par jour</h2>
              <div className="mt-4">
                <ChartVues serie={stats.serie} />
                <div className="mt-2 flex justify-between text-small text-neutral-500">
                  <span>{stats.periode.depuis}</span>
                  <span>aujourd&apos;hui</span>
                </div>
              </div>
            </Card>

            {stats.topPages.length > 0 && (
              <Card variant="bordered" className="mt-6">
                <h2 className="font-display text-h4 text-neutral-900">Pages les plus vues</h2>
                <ul className="mt-4 divide-y divide-neutral-200">
                  {stats.topPages.map((page) => (
                    <li key={page.slug} className="flex items-center justify-between py-3">
                      <Link href={`/s/${stats.site.slug}/${page.slug}`} className="text-body text-neutral-900 hover:underline">
                        {page.titre}
                      </Link>
                      <span className="text-small text-neutral-500">
                        {page.vues.toLocaleString("fr-FR")} vue{page.vues > 1 ? "s" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </>
        )}
      </div>
    </main>
  );
}
