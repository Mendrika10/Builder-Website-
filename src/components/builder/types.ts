export type SectionType =
  | "navbar"
  | "hero"
  | "expertises"
  | "temoignages"
  | "realisations"
  | "blog"
  | "faq"
  | "cta"
  | "contact"
  | "footer";

export interface BuilderSection {
  id: string;
  type: SectionType;
  visible: boolean;
  label: string;
  data: Record<string, unknown>;
}

export interface BuilderPage {
  id: string;
  name: string;
  slug: string;
  sections: BuilderSection[];
}

export interface BuilderEditorProps {
  siteId: string;
  siteSlug: string;
  siteNom: string;
  siteStatut: string;
  modeleNom: string | null;
}
