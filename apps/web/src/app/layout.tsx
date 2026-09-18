import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Site.mg — Créez votre site web en minutes",
  description:
    "SaaS de création de sites web : choisissez un modèle, personnalisez chaque détail et publiez — le tout depuis un seul outil.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
