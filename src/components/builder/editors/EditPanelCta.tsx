"use client";

import { SectionLabel } from "../ui/SectionLabel";
import { FieldText } from "../ui/FieldText";
import { FieldTextArea } from "../ui/FieldTextArea";
import { FieldColor } from "../ui/FieldColor";

export function EditPanelCta({
  data,
  onUpdate,
}: {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}) {
  const set = (key: string, value: unknown) =>
    onUpdate({ ...data, [key]: value });
  return (
    <>
      <SectionLabel>Contenu</SectionLabel>
      <FieldText
        label="Label de section"
        value={data.sectionLabel as string}
        onChange={(v) => set("sectionLabel", v)}
      />
      <FieldTextArea
        label="Titre"
        value={data.title as string}
        onChange={(v) => set("title", v)}
        rows={2}
        hint="Utilisez Entrée pour un saut de ligne"
      />
      <FieldTextArea
        label="Sous-titre"
        value={data.subtitle as string}
        onChange={(v) => set("subtitle", v)}
        rows={2}
      />
      <SectionLabel>Couleur</SectionLabel>
      <FieldColor
        label="Couleur de fond"
        value={(data.bgColor as string) || "#0F172A"}
        onChange={(v) => set("bgColor", v)}
      />
      <FieldColor
        label="Couleur bouton principal"
        value={(data.cta1Color as string) || "#2563EB"}
        onChange={(v) => set("cta1Color", v)}
      />
      <SectionLabel>Boutons</SectionLabel>
      <FieldText
        label="CTA principal texte"
        value={data.cta1Text as string}
        onChange={(v) => set("cta1Text", v)}
      />
      <FieldText
        label="CTA principal URL"
        value={data.cta1Url as string}
        onChange={(v) => set("cta1Url", v)}
      />
      <FieldText
        label="CTA secondaire texte"
        value={data.cta2Text as string}
        onChange={(v) => set("cta2Text", v)}
      />
      <FieldText
        label="CTA secondaire URL"
        value={data.cta2Url as string}
        onChange={(v) => set("cta2Url", v)}
      />
    </>
  );
}
