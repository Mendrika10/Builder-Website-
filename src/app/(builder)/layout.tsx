import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Éditeur | Site.mg",
};

// Le builder a son propre layout complet (pas de sidebar dashboard)
export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
