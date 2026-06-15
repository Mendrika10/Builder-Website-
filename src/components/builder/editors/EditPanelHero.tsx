"use client";

import { SectionAccordion } from "../ui/SectionAccordion";
import { FieldText } from "../ui/FieldText";
import { FieldTextArea } from "../ui/FieldTextArea";
import { FieldStringArray } from "../ui/FieldStringArray";
import { BackgroundEditor } from "../ui/BackgroundEditor";
import { ButtonEditor } from "../ui/ButtonEditor";
import { BadgeEditor } from "../ui/BadgeEditor";
import { TitleEditor } from "../ui/TitleEditor";
import { BuilderSection, BuilderPage } from "../types"; // Import des types

export function EditPanelHero({
  data,
  onUpdate,
  siteId,
  sections, // <--- Ajouté
  pages, // <--- Ajouté
}: {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
  siteId: string;
  sections: BuilderSection[]; // <--- Ajouté
  pages: BuilderPage[]; // <--- Ajouté
}) {
  const set = (key: string, value: unknown) =>
    onUpdate({ ...data, [key]: value });

  // Transformation des sections en ancres (#section-label)
  const sectionAnchors = sections.map((s) => ({
    label: s.label,
    href: `#${s.label.toLowerCase().replace(/\s+/g, "-")}`,
  }));

  // Transformation des pages en options de lien (/slug)
  const pageOptions = pages.map((p) => ({
    label: p.name,
    href: `/${p.slug}`,
  }));

  return (
    <>
      <SectionAccordion title="Contenu" icon="bi bi-pencil-square">
        <BadgeEditor prefix="heroBadge" data={data} onUpdate={onUpdate} />

        <TitleEditor
          prefix="title"
          label="Titre principal"
          data={data}
          onUpdate={onUpdate}
          canToggle={false}
        />

        <TitleEditor
          prefix="subtitle"
          label="Sous-titre"
          data={data}
          onUpdate={onUpdate}
          canToggle={true}
          rows={3}
        />
      </SectionAccordion>

      <SectionAccordion title="Arrière-plan" icon="bi bi-palette">
        <BackgroundEditor
          prefix="heroBg"
          data={data}
          onUpdate={onUpdate}
          siteId={siteId}
        />
      </SectionAccordion>

      <SectionAccordion title="Boutons" icon="bi bi-cursor">
        <ButtonEditor
          data={data}
          onUpdate={onUpdate}
          sectionAnchors={sectionAnchors} // <--- Maintenant dynamique !
          pageOptions={pageOptions} // <--- Maintenant dynamique !
          buttons={[
            { key: "cta1", label: "CTA principal" },
            { key: "cta2", label: "CTA secondaire" },
          ]}
        />
      </SectionAccordion>

      <SectionAccordion title="Preuves sociales" icon="bi bi-star">
        <FieldText
          label="Note (ex: 4.9/5)"
          value={data.rating as string}
          onChange={(v) => set("rating", v)}
        />
        <FieldText
          label="Label note (ex: sur Google)"
          value={data.ratingLabel as string}
          onChange={(v) => set("ratingLabel", v)}
        />
        <FieldStringArray
          label="Statistiques (une par ligne)"
          value={data.stats as string[]}
          onChange={(v) => set("stats", v)}
        />
        <FieldStringArray
          label="Logos clients (un par ligne)"
          value={data.clients as string[]}
          onChange={(v) => set("clients", v)}
        />
      </SectionAccordion>
    </>
  );
}
