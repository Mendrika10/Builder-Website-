import { cn } from "@/lib/cn";
import type { Bloc } from "@/lib/pages";

/** Rend un bloc du builder. Partagé par la preview de l'éditeur et la page publique. */
export function BlocView({ bloc }: { bloc: Bloc }) {
  switch (bloc.type) {
    case "hero":
      return (
        <section className="bg-primary-900 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 px-6 py-16 text-center text-white sm:py-24">
          <h1 className="mx-auto max-w-3xl font-display text-h1 text-white">{bloc.titre ?? "Votre titre"}</h1>
          {bloc.sousTitre && <p className="mx-auto mt-4 max-w-2xl text-body-lg opacity-90">{bloc.sousTitre}</p>}
          {bloc.ctaLabel && (
            <a
              href={bloc.ctaHref || "#"}
              className="mt-8 inline-flex h-12 items-center rounded-input bg-white px-6 font-medium text-primary-700 transition-colors hover:bg-primary-50"
            >
              {bloc.ctaLabel}
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
        <section className="bg-primary-50 px-6 py-12 text-center">
          <p className="font-display text-h3 text-neutral-900">{bloc.titre ?? "Un projet ?"}</p>
          {bloc.texte && <p className="mt-2 text-body text-neutral-600">{bloc.texte}</p>}
          <a
            href={bloc.ctaHref || "#"}
            className="mt-6 inline-flex h-12 items-center rounded-input bg-primary-600 px-6 font-medium text-white transition-colors hover:bg-primary-700"
          >
            {bloc.ctaLabel ?? "Nous écrire"}
          </a>
        </section>
      );
    default:
      return null;
  }
}

/** Liste des blocs — un seul point d'entrée pour preview et rendu public. */
export function BlocList({ blocs, className }: { blocs: Bloc[]; className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      {blocs.map((bloc, i) => (
        <BlocView key={i} bloc={bloc} />
      ))}
    </div>
  );
}
