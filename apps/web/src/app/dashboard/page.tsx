"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getSession, logout, type SessionUser } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  // AUTH-014 — Protection côté client : sans session, retour au login
  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    setUser(session);
    setReady(true);
  }, [router]);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-page">
        <div className="size-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-page">
      <header className="border-b border-neutral-200 bg-surface-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="font-display text-h3 text-neutral-900">Site.mg</span>
          <div className="flex items-center gap-3">
            <span className="hidden text-small text-neutral-600 sm:inline">{user?.email}</span>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-h1 text-neutral-900">
          Bonjour {user?.nom.split(" ")[0]} 👋
        </h1>
        <p className="mt-2 text-body text-neutral-600">
          Votre compte est actif. La création de sites arrive dans quelques jours.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Card variant="bordered">
            <h2 className="font-display text-h4 text-neutral-900">Mon profil</h2>
            <dl className="mt-4 space-y-2 text-body text-neutral-600">
              <div className="flex justify-between gap-4">
                <dt>Nom</dt>
                <dd className="font-medium text-neutral-900">{user?.nom}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Email</dt>
                <dd className="font-medium text-neutral-900">{user?.email}</dd>
              </div>
            </dl>
          </Card>
          <Card variant="bordered" className="flex flex-col justify-between">
            <div>
              <h2 className="font-display text-h4 text-neutral-900">Mes sites</h2>
              <p className="mt-2 text-body text-neutral-600">
                Créez et gérez vos sites depuis votre espace.
              </p>
            </div>
            <Button className="mt-6 w-full" onClick={() => router.push("/dashboard/sites")}>
              Gérer mes sites
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
}
