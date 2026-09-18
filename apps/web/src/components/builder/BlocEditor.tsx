"use client";

import type { Bloc, BlocType } from "@/lib/pages";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type FieldDef = { key: keyof Omit<Bloc, "type">; label: string };

const LABELS: Record<BlocType, string> = {
  hero: "Bannière (hero)",
  texte: "Paragraphe",
  cta: "Appel à l'action",
};

const FIELDS: Record<BlocType, FieldDef[]> = {
  hero: [
    { key: "titre", label: "Titre" },
    { key: "sousTitre", label: "Sous-titre" },
    { key: "ctaLabel", label: "Libellé du bouton" },
    { key: "ctaHref", label: "Lien du bouton" },
  ],
  texte: [{ key: "texte", label: "Texte" }],
  cta: [
    { key: "titre", label: "Titre" },
    { key: "texte", label: "Texte" },
    { key: "ctaLabel", label: "Libellé du bouton" },
    { key: "ctaHref", label: "Lien du bouton" },
  ],
};

const BADGES: Record<BlocType, string> = {
  hero: "bg-primary-100 text-primary-700",
  texte: "bg-neutral-100 text-neutral-700",
  cta: "bg-primary-100 text-primary-700",
};

export function BlocEditor(props: {
  bloc: Bloc;
  index: number;
  total: number;
  onChange: (bloc: Bloc) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  const { bloc, index, total, onChange, onMove, onRemove } = props;
  const fields = FIELDS[bloc.type];
  return (
    <div className="rounded-card border border-neutral-200 bg-surface-card p-4">
      <div className="flex items-center justify-between gap-2">
        <span className={"rounded-full px-2 py-0.5 text-small font-medium " + BADGES[bloc.type]}>
          {LABELS[bloc.type]}
        </span>
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" disabled={index === 0} onClick={() => onMove(-1)} aria-label="Monter">
            ↑
          </Button>
          <Button type="button" variant="ghost" size="sm" disabled={index === total - 1} onClick={() => onMove(1)} aria-label="Descendre">
            ↓
          </Button>
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {fields.map((f) => (
          <Input
            key={f.key}
            label={f.label}
            value={bloc[f.key] ?? ""}
            onChange={(e) => onChange({ ...bloc, [f.key]: e.target.value })}
            maxLength={500}
          />
        ))}
      </div>
      <div className="mt-3 flex justify-end">
        <Button type="button" variant="danger" size="sm" onClick={onRemove}>
          Supprimer ce bloc
        </Button>
      </div>
    </div>
  );
}
