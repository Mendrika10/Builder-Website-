"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { BlocEditor } from "@/components/builder/BlocEditor";
import { BlocList } from "@/components/builder/BlocView";
import { getSession } from "@/lib/auth";
import {
  createPage,
  deletePage,
  fetchOrCreateHomePage,
  fetchPages,
  publishSite,
  savePage,
  uploadImage,
  type Bloc,
  type PageData,
} from "@/lib/pages";
import { fetchSites, updateSite, type Site } from "@/lib/sites";
import { PALETTES, THEMES, paletteOf } from "@/lib/themes";

const LABELS_BLOC: Record<Bloc["type"], string> = {
  hero: "Bannière",
  texte: "Paragraphe",
  cta: "Appel à l'action",
  image: "Image",
  contact: "Contact",
  horaires: "Horaires",
};

const NOUVEAUX_BLOCS: Record<Bloc["type"], () => Bloc> = {
  hero: () => ({ type: "hero", titre: "Bienvenue !", sousTitre: "Le meilleur de notre savoir-faire", ctaLabel: "Nous contacter", ctaHref: "#" }),
  texte: () => ({ type: "texte", texte: "Écrivez votre texte ici." }),
  cta: () => ({ type: "cta", titre: "Un projet ?", texte: "Parlez-nous de votre idée.", ctaLabel: "Nous écrire", ctaHref: "#" }),
  image: () => ({ type: "image", url: "https://picsum.photos/seed/sitemg/1200/600", alt: "Description de l'image" }),
  contact: () => ({ type: "contact", titre: "Nous contacter", telephone: "+261 34 00 000 00", email: "bonjour@exemple.mg", adresse: "Antananarivo, Madagascar" }),
  horaires: () => ({ type: "horaires", titre: "Horaires d'ouverture", horaires: "Lundi – Vendredi : 9h – 18h\nSamedi : 9h – 13h\nDimanche : fermé" }),
};

export default function SiteEditorPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const siteId = params.id;

  const [site, setSite] = useState<Site | null>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const [pageActive, setPageActive] = useState<PageData | null>(null);
  const [blocs, setBlocs] = useState<Bloc[]>([]);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [nouvellePage, setNouvellePage] = useState("");
  const [creatingPage, setCreatingPage] = useState(false);
  const [deletingPageId, setDeletingPageId] = useState<string | null>(null);
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const sites = await fetchSites();
      const found = sites.find((s) => s.id === siteId);
      if (!found) {
        setError("Site introuvable.");
        return;
      }
      setSite(found);
      await fetchOrCreateHomePage(siteId); // garantit qu'il existe au moins une page
      const list = await fetchPages(siteId);
      setPages(list);
      setPageActive(list[0] ?? null);
      setBlocs(list[0]?.contenu ?? []);
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

  function switchPage(page: PageData) {
    setPageActive(page);
    setBlocs(page.contenu ?? []);
    setDirty(false);
    setSaved(false);
    setError(null);
  }

  function update(blocsSuivants: Bloc[]) {
    setBlocs(blocsSuivants);
    setDirty(true);
    setSaved(false);
  }

  async function handleSave() {
    if (!pageActive) return;
    setSaving(true);
    setError(null);
    try {
      const maj = await savePage(pageActive.id, { contenu: blocs });
      setPages((prev) => prev.map((p) => (p.id === maj.id ? maj : p)));
      setPageActive(maj);
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

  async function handleCreatePage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!nouvellePage.trim()) return;
    setCreatingPage(true);
    setError(null);
    try {
      const page = await createPage(siteId, nouvellePage.trim());
      setPages((prev) => [...prev, page]);
      setNouvellePage("");
      switchPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Création de page impossible.");
    } finally {
      setCreatingPage(false);
    }
  }

  async function handleDeletePage(page: PageData) {
    // Confirmation en deux clics (pas de window.confirm, rejeté en webview)
    if (deletingPageId !== page.id) {
      setDeletingPageId(page.id);
      return;
    }
    setDeletingPageId(null);
    setError(null);
    try {
      await deletePage(page.id);
      const restantes = pages.filter((p) => p.id !== page.id);
      setPages(restantes);
      if (pageActive?.id === page.id) switchPage(restantes[0] ?? null as unknown as PageData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible.");
    }
  }

  const publie = site?.statut === "publie";
  const palette = paletteOf(site?.theme);

  /** US-060 — Change le thème (persisté immédiatement). */
  async function handleTheme(theme: string) {
    if (!site) return;
    setError(null);
    try {
      const maj = await updateSite(site.id, { theme });
      setSite(maj);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Changement de thème impossible.");
    }
  }

  /** US-061 — Upload une image dans le bloc image d'index i. */
  async function handleUpload(i: number, file: File) {
    setUploadingFor(i);
    setError(null);
    try {
      const url = await uploadImage(file);
      update(blocs.map((x, j) => (j === i ? { ...x, url } : x)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload impossible.");
    } finally {
      setUploadingFor(null);
    }
  }

  if (!site || !pageActive) {
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
            {" · "}
            <Link href={`/dashboard/sites/${siteId}/analytics`} className="font-medium underline">
              Statistiques
            </Link>
          </p>
        )}

        {/* PAGE-012 — Gestionnaire de pages */}
        <Card variant="bordered" className="mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {pages.map((p) => (
              <span key={p.id} className="flex items-center gap-1">
                <Button
                  variant={pageActive.id === p.id ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => switchPage(p)}
                >
                  {p.titre}
                </Button>
                {pages.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePage(p)}
                    aria-label={`Supprimer la page ${p.titre}`}
                  >
                    {deletingPageId === p.id ? "Confirmer ?" : "×"}
                  </Button>
                )}
              </span>
            ))}
            <form onSubmit={handleCreatePage} className="ml-auto flex items-end gap-2" noValidate>
              <div className="w-44">
                <Input
                  label="Nouvelle page"
                  value={nouvellePage}
                  onChange={(e) => setNouvellePage(e.target.value)}
                  placeholder="Ex. Menu, Contact…"
                  maxLength={120}
                />
              </div>
              <Button type="submit" variant="secondary" size="sm" loading={creatingPage}>
                Ajouter
              </Button>
            </form>
          </div>
        </Card>

        {/* US-060 — Sélecteur de thème */}
        <Card variant="bordered" className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-small font-medium text-neutral-700">Thème du site :</span>
            {THEMES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTheme(t)}
                className={"flex items-center gap-2 rounded-input border px-3 py-1.5 text-small transition-colors " +
                  (site?.theme === t
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-surface-card text-neutral-700 hover:bg-surface-sunken")}
                aria-pressed={site?.theme === t}
              >
                <span aria-hidden className={"size-3 rounded-full " + PALETTES[t].swatch} />
                {PALETTES[t].label}
              </button>
            ))}
          </div>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Édition */}
          <section>
            <h2 className="font-display text-h4 text-neutral-900">Contenu de la page « {pageActive.titre} »</h2>
            <div className="mt-4 space-y-4">
              {blocs.map((bloc, i) => (
                <div key={i}>
                  <BlocEditor
                    bloc={bloc}
                    index={i}
                    total={blocs.length}
                    onChange={(b) => update(blocs.map((x, j) => (j === i ? b : x)))}
                    onMove={(dir) => update([...blocs].map((x, j) => (j === i ? blocs[i + dir] : j === i + dir ? blocs[i] : x)))}
                    onRemove={() => update(blocs.filter((_, j) => j !== i))}
                  />
                  {bloc.type === "image" && (
                    <div className="mt-2 flex items-center gap-3 rounded-input border border-dashed border-neutral-300 px-3 py-2">
                      <label className="cursor-pointer text-small font-medium text-primary-600 hover:underline">
                        {uploadingFor === i ? "Envoi…" : "Téléverser une image"}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="sr-only"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) void handleUpload(i, f);
                            e.target.value = "";
                          }}
                        />
                      </label>
                      <span className="text-small text-neutral-400">jpg, png ou webp — 2 Mo max</span>
                    </div>
                  )}
                </div>
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
                  + {LABELS_BLOC[type]}
                </Button>
              ))}
            </div>
          </section>

          {/* Prévisualisation live */}
          <section aria-label="Prévisualisation">
            <h2 className="font-display text-h4 text-neutral-900">Aperçu en direct</h2>
            <div className="mt-4 overflow-hidden rounded-card border border-neutral-200 bg-surface-card shadow-resting">
              <BlocList blocs={blocs} theme={site?.theme} />
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
