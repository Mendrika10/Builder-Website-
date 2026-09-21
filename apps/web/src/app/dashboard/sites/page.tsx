"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { getSession, type SessionUser } from "@/lib/auth";
import { createSite, deleteSite, fetchSites, renameSite, type Site } from "@/lib/sites";

export default function DashboardSitesPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [sites, setSites] = useState<Site[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nom, setNom] = useState("");
  const [slug, setSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<{ id: string; nom: string } | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setSites(await fetchSites());
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

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      await createSite(nom, slug || undefined);
      setNom("");
      setSlug("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Création impossible.");
    } finally {
      setCreating(false);
    }
  }

  function startRename(site: Site) {
    setError(null);
    setConfirmingId(null);
    setRenaming({ id: site.id, nom: site.nom });
  }

  async function handleRenameSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!renaming) return;
    setBusyId(renaming.id);
    try {
      await renameSite(renaming.id, renaming.nom);
      setRenaming(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Renommage impossible.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(site: Site) {
    // Confirmation en deux clics (pas de window.confirm, rejeté en webview).
    if (confirmingId !== site.id) {
      setConfirmingId(site.id);
      setRenaming(null);
      return;
    }
    setConfirmingId(null);
    setBusyId(site.id);
    try {
      await deleteSite(site.id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="min-h-screen bg-surface-page">
      <header className="border-b border-neutral-200 bg-surface-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="/dashboard" className="font-display text-h3 text-neutral-900">
            Site.mg
          </a>
          <span className="hidden text-small text-neutral-600 sm:inline">{user?.email}</span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-h1 text-neutral-900">Mes sites</h1>
        <p className="mt-2 text-body text-neutral-600">
          Créez et gérez vos sites — éditez vos pages et publiez en un clic.
        </p>

        {error && (
          <p role="alert" className="mt-6 rounded-card border border-danger/30 bg-danger/5 px-4 py-3 text-small text-danger">
            {error}{" "}
            {/* BILL-001 — les messages de quota proposent l'upgrade */}
            {/plan/i.test(error) && (
              <Link href="/dashboard/billing" className="font-semibold underline hover:no-underline">
                Passer au plan Pro →
              </Link>
            )}
          </p>
        )}

        <Card variant="bordered" className="mt-8">
          <h2 className="font-display text-h4 text-neutral-900">Nouveau site</h2>
          <form onSubmit={handleCreate} className="mt-4 flex flex-wrap items-start gap-3" noValidate>
            <div className="min-w-48 flex-1">
              <Input
                label="Nom du site"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                maxLength={120}
              />
            </div>
            <div className="min-w-48 flex-1">
              <Input
                label="Slug (optionnel)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                hint="Laissez vide pour le dériver du nom."
              />
            </div>
            <Button type="submit" className="mt-6" loading={creating}>
              Créer
            </Button>
          </form>
        </Card>

        <div className="mt-8 space-y-4" data-testid="sites-list">
          {sites?.length === 0 && (
            <Card variant="flat" className="text-center text-body text-neutral-500">
              Aucun site pour le moment — créez le premier ci-dessus.
            </Card>
          )}
          {sites?.map((site) => (
            <Card key={site.id} variant="bordered" className="flex flex-wrap items-center justify-between gap-4">
              {renaming?.id === site.id ? (
                <form onSubmit={handleRenameSubmit} className="flex flex-1 flex-wrap items-end gap-3" noValidate>
                  <div className="min-w-48 flex-1">
                    <Input
                      label="Nouveau nom"
                      value={renaming.nom}
                      onChange={(e) => setRenaming({ ...renaming, nom: e.target.value })}
                      required
                      maxLength={120}
                      autoFocus
                    />
                  </div>
                  <Button type="submit" size="sm" loading={busyId === site.id}>
                    Enregistrer
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setRenaming(null)}
                  >
                    Annuler
                  </Button>
                </form>
              ) : (
                <>
                  <div>
                    <p className="font-display text-h4 text-neutral-900">{site.nom}</p>
                    <p className="text-small text-neutral-500">
                      {site.slug} · créé le {new Date(site.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/sites/${site.id}`}
                      className="inline-flex items-center rounded-md bg-primary-600 px-3 py-1.5 text-small font-medium text-white hover:bg-primary-700"
                    >
                      Éditer
                    </Link>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={busyId === site.id}
                      onClick={() => startRename(site)}
                    >
                      Renommer
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      loading={busyId === site.id}
                      onClick={() => handleDelete(site)}
                    >
                      {confirmingId === site.id ? "Confirmer ?" : "Supprimer"}
                    </Button>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
