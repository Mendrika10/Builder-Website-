"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BlocEditor } from "@/components/builder/BlocEditor";
import { BlocList } from "@/components/builder/BlocView";
import { getSession } from "@/lib/auth";
import { fetchOrCreateHomePage, publishSite, savePage, type Bloc, type PageData } from "@/lib/pages";
import { fetchSites, type Site } from "@/lib/sites";

const NOUVEAUX_BLOCS: Record<Bloc["type"], () => Bloc> = {
  hero: () => ({ type: "hero", titre: "Bienvenue !", sousTitre: "Le meilleur de notre savoir-faire", ctaLabel: "Nous contacter", ctaHref: "#" }),
  texte: () => ({ type: "texte", texte: "Écrivez votre texte ici." }),
  cta: () => ({ type: "cta", titre: "Un projet ?", texte: "Parlez-nous de votre idée.", ctaLabel: "Nous écrire", ctaHref: "#" }),
};

export default function SiteEditorPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const siteId = params.id;

  const [site, setSite] = useState<Site | null>(null);
  const [page, setPage] = useState<PageData | null>(null);
  const [blocs, setBlocs] = useState<Bloc[]>([]);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const load = useCallback(async () => {
    try {
      const sites = await fetchSites();
      const found = sites.find((s) => s.id === siteId);
      if (!found) {
        setError("Site introuvable.");
        return;
      }
      setSite(found);
      const home = await fetchOrCreateHomePage(siteId);
      setPage(home);
      setBlocs(home.contenu ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chargement impossible.");
    }
  }, [siteId]);

  useEffect(() => {
    if (!getSession()) {
      router.replace("/login");
      return;
    }
    void load();
  }, [router, load]);

  function update(blocsSuivants: Bloc[]) {
    setBlocs(blocsSuivants);
    setDirty(true);
    setSaved(false);
  }

  async function handleSave() {
    if (!page) return;
    setSaving(true);
    setError(null);
    try {
      const maj = await savePage(page.id, { contenu: blocs });
      setPage(maj);
      setBlocs(maj.contenu ?? []);
      setDirty(false);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sauvegarde impossible.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish(publier: boolean) {
    if (!site) return;
    setPublishing(true);
    setError(null);
    try {
      const res = await publishSite(site.id, publier);
      setSite({ ...site, statut: res.statut });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publication impossible.");
    } finally {
      setPublishing(false);
    }
  }

  const publie = site?.statut === "publie";

  if (!site || !page) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-page">
        {error ? (
          <p role="alert" className="text-body text-danger">{error}</p>
        ) : (
          <div className="size-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-page">
      <header className="border-b border-neutral-200 bg-surface-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <Link href="/dashboard/sites" className="text-small text-neutral-500 hover:underline">
              ← Mes sites
            </Link>
            <h1 className="font-display text-h3 text-neutral-900">{site.nom}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => handlePublish(!publie)} loading={publishing}>
              {publie ? "Dépublier" : "Publier"}
            </Button>
            <Button size="sm" onClick={handleSave} loading={saving} disabled={!dirty}>
              {dirty ? "Enregistrer" : saved ? "Enregistré ✓" : "Enregistrer"}
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {error && (
          <p role="alert" className="mb-6 rounded-card border border-danger/30 bg-danger/5 px-4 py-3 text-small text-danger">
            {error}
          </p>
        )}
        {publie && (
          <p className="mb-6 rounded-card border border-success/30 bg-success/5 px-4 py-3 text-small text-success">
            Site publié — visible sur{" "}
            <a href={`/s/${site.slug}`} target="_blank" rel="noopener noreferrer" className="font-medium underline">
              /s/{site.slug}
            </a>
          </p>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Édition */}
          <section>
            <h2 className="font-display text-h4 text-neutral-900">Contenu de la page « {page.titre} »</h2>
            <div className="mt-4 space-y-4">
              {blocs.map((bloc, i) => (
                <BlocEditor
                  key={i}
                  bloc={bloc}
                  index={i}
                  total={blocs.length}
                  onChange={(b) => update(blocs.map((x, j) => (j === i ? b : x)))}
                  onMove={(dir) => update([...blocs].map((x, j) => (j === i ? blocs[i + dir] : j === i + dir ? blocs[i] : x)))}
                  onRemove={() => update(blocs.filter((_, j) => j !== i))}
                />
              ))}
              {blocs.length === 0 && (
                <Card variant="flat" className="text-center text-body text-neutral-500">
                  Aucun bloc — ajoutez votre premier contenu ci-dessous.
                </Card>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.keys(NOUVEAUX_BLOCS) as Bloc["type"][]).map((type) => (
                <Button
                  key={type}
                  variant="secondary"
                  size="sm"
                  onClick={() => update([...blocs, NOUVEAUX_BLOCS[type]()])}
                >
                  + {type === "hero" ? "Bannière" : type === "texte" ? "Paragraphe" : "Appel à l'action"}
                </Button>
              ))}
            </div>
          </section>

          {/* Prévisualisation live */}
          <section aria-label="Prévisualisation">
            <h2 className="font-display text-h4 text-neutral-900">Aperçu en direct</h2>
            <div className="mt-4 overflow-hidden rounded-card border border-neutral-200 bg-surface-card shadow-resting">
              <BlocList blocs={blocs} />
              {blocs.length === 0 && (
                <p className="px-6 py-16 text-center text-body text-neutral-400">L&apos;aperçu apparaîtra ici.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
