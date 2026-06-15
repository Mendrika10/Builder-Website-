import TemplateEntreprise from "@/components/templates/TemplateEntreprise";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aperçu — Template Entreprise",
  description: "Prévisualisation du modèle Entreprise",
};

export default function EntreprisePreviewPage() {
  return <TemplateEntreprise />;
}
