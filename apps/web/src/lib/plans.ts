import { API_URL } from "./api";

export type Plan = {
  id: string;
  nom: string;
  prixMensuel: number;
  prixAnnuel: number;
  maxSites: number;
  maxPages: number;
  stockageGo: number;
  domainePerso: boolean;
  sslInclus: boolean;
  analytics: boolean;
  removeBranding: boolean;
  supportNiveau: string;
};

/** GET /plans — catalogue public. */
export async function fetchPlans(): Promise<Plan[]> {
  const res = await fetch(`${API_URL}/plans`, { cache: "no-store" });
  if (!res.ok) throw new Error("Impossible de charger les plans.");
  return (await res.json()) as Plan[];
}

export function formatPrix(prix: number): string {
  return prix === 0 ? "0 €" : `${prix} €`;
}
