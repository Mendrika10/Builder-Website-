"use client";

import { BuilderSection, BuilderPage } from "../types";
import { EditPanelNavbar } from "./EditPanelNavbar";
import { EditPanelHero } from "./EditPanelHero";
import { EditPanelExpertises } from "./EditPanelExpertises";
import { EditPanelTemoignages } from "./EditPanelTemoignages";
import { EditPanelRealisations } from "./EditPanelRealisations";
import { EditPanelBlog } from "./EditPanelBlog";
import { EditPanelFaq } from "./EditPanelFaq";
import { EditPanelCta } from "./EditPanelCta";
import { EditPanelContact } from "./EditPanelContact";
import { EditPanelFooter } from "./EditPanelFooter";

export function EditPanel({
  section,
  onUpdate,
  sections,
  pages,
  siteSlug,
  siteId,
}: {
  section: BuilderSection;
  onUpdate: (data: Record<string, unknown>) => void;
  sections: BuilderSection[];
  pages: BuilderPage[];
  siteSlug: string;
  siteId: string;
}) {
  switch (section.type) {
    case "navbar":
      return (
        <EditPanelNavbar
          data={section.data}
          onUpdate={onUpdate}
          sections={sections}
          pages={pages}
          siteSlug={siteSlug}
          siteId={siteId}
        />
      );
    case "hero":
      return (
        <EditPanelHero
          data={section.data}
          onUpdate={onUpdate}
          siteId={siteId}
          sections={sections}
          pages={pages}
        />
      );
    case "expertises":
      return <EditPanelExpertises data={section.data} onUpdate={onUpdate} />;
    case "temoignages":
      return <EditPanelTemoignages data={section.data} onUpdate={onUpdate} />;
    case "realisations":
      return <EditPanelRealisations data={section.data} onUpdate={onUpdate} />;
    case "blog":
      return <EditPanelBlog data={section.data} onUpdate={onUpdate} />;
    case "faq":
      return <EditPanelFaq data={section.data} onUpdate={onUpdate} />;
    case "cta":
      return <EditPanelCta data={section.data} onUpdate={onUpdate} />;
    case "contact":
      return <EditPanelContact data={section.data} onUpdate={onUpdate} />;
    case "footer":
      return <EditPanelFooter data={section.data} onUpdate={onUpdate} />;
    default:
      return null;
  }
}
