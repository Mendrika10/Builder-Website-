import { cn } from "@/lib/cn";
import type { Bloc } from "@/lib/pages";
import { paletteOf } from "@/lib/themes";

/** Rend un bloc du builder avec la palette du thème. Partagé par la preview et la page publique. */
export function BlocView({ bloc, theme }: { bloc: Bloc; theme?: string | null }) {
  const p = paletteOf(theme);
  switch (bloc.type) {
    case "hero":
      return (
        <section className={cn("bg-gradient-to-br px-6 py-16 text-center text-white sm:py-24", p.heroBg)}>
          <h1 className="mx-auto max-w-3xl font-display text-h1 text-white">{bloc.titre ?? "Votre titre"}</h1>
          {bloc.sousTitre && <p className="mx-auto mt-4 max-w-2xl text-body-lg opacity-90">{bloc.sousTitre}</p>}
          {bloc.ctaLabel && (
            <a
              href={bloc.ctaHref || "#"}
              className="mt-8 inline-flex h-12 items-center rounded-input bg-white px-6 font-medium transition-colors hover:opacity-90"
              style={{ color: undefined }}
            >
              <span className={p.accentText}>{bloc.ctaLabel}</span>
            </a>
          )}
        </section>
      );
    case "texte":
      return (
        <section className="px-6 py-10">
          <p className="mx-auto max-w-2xl whitespace-pre-line text-body-lg text-neutral-700">{bloc.texte ?? ""}</p>
        </section>
      );
    case "cta":
      return (
        <section className={cn("px-6 py-12 text-center", p.accentSoftBg)}>
          <p className="font-display text-h3 text-neutral-900">{bloc.titre ?? "Un projet ?"}</p>
          {bloc.texte && <p className="mt-2 text-body text-neutral-600">{bloc.texte}</p>}
          <a
            href={bloc.ctaHref || "#"}
            className={cn("mt-6 inline-flex h-12 items-center rounded-input px-6 font-medium text-white transition-colors", p.accentBg)}
          >
            {bloc.ctaLabel ?? "Nous écrire"}
          </a>
        </section>
      );
    case "image":
      return (
        <section className="px-6 py-10">
          {/* eslint-disable-next-line @next/next/no-img-element -- URL externe ou upload servie par l'API (v1) */}
          <img
            src={bloc.url}
            alt={bloc.alt ?? ""}
            className="mx-auto max-h-96 w-full max-w-3xl rounded-card object-cover shadow-resting"
          />
          {bloc.alt && <p className="mt-2 text-center text-small text-neutral-500">{bloc.alt}</p>}
        </section>
      );
    case "contact":
      return (
        <section className="px-6 py-10">
          <div className="mx-auto max-w-2xl rounded-card border border-neutral-200 bg-surface-card p-6">
            <h2 className="font-display text-h3 text-neutral-900">{bloc.titre ?? "Nous contacter"}</h2>
            <ul className="mt-4 space-y-2 text-body text-neutral-700">
              {bloc.telephone && (
                <li>
                  📞{" "}
                  <a href={`tel:${bloc.telephone.replace(/\s+/g, "")}`} className="hover:underline">
                    {bloc.telephone}
                  </a>
                </li>
              )}
              {bloc.email && (
                <li>
                  ✉️{" "}
                  <a href={`mailto:${bloc.email}`} className="hover:underline">
                    {bloc.email}
                  </a>
                </li>
              )}
              {bloc.adresse && <li>📍 {bloc.adresse}</li>}
            </ul>
          </div>
        </section>
      );
    case "horaires":
      return (
        <section className="px-6 py-10">
          <div className={cn("mx-auto max-w-2xl rounded-card p-6", p.accentSoftBg)}>
            <h2 className="font-display text-h3 text-neutral-900">{bloc.titre ?? "Horaires d'ouverture"}</h2>
            {bloc.horaires && (
              <p className="mt-3 whitespace-pre-line text-body text-neutral-700">{bloc.horaires}</p>
            )}
          </div>
        </section>
      );
    default:
      return null;
  }
}

/** Liste des blocs — un seul point d'entrée pour preview et rendu public. */
export function BlocList({ blocs, theme, className }: { blocs: Bloc[]; theme?: string | null; className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      {blocs.map((bloc, i) => (
        <BlocView key={i} bloc={bloc} theme={theme} />
      ))}
    </div>
  );
}
