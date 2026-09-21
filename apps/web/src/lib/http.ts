import { API_URL } from "./api";
import { getAccessToken } from "./auth";

/** En-tête d'authentification (JWT access). */
export function authHeaders(): HeadersInit {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Extrait le message d'erreur de l'API (chaîne ou tableau de validation). */
export async function parseError(res: Response): Promise<never> {
  const data: unknown = await res.json().catch(() => null);
  const raw = (data as { message?: string | string[] } | null)?.message;
  throw new Error(Array.isArray(raw) ? raw[0] : raw ?? "Une erreur est survenue.");
}

/** US-070 — État d'abonnement renvoyé par GET /subscription/me. */
export type EtatAbonnement = {
  plan: string;
  abonnement: {
    statut: string;
    periodicite: string;
    dateDebut: string;
    dateFin: string | null;
    stripeSubId: string | null;
  } | null;
  quotas: { maxSites: number; maxPages: number; stockageGo: number } | null;
};

/** STRIPE-002 — État de l'abonnement + plan effectif. */
export async function fetchSubscription(): Promise<EtatAbonnement> {
  const res = await fetch(`${API_URL}/subscription/me`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) await parseError(res);
  return (await res.json()) as EtatAbonnement;
}

/** STRIPE-003 — Crée la session Stripe Checkout et renvoie son URL. */
export async function creerCheckout(): Promise<string> {
  const res = await fetch(`${API_URL}/subscription/checkout`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) await parseError(res);
  const data = (await res.json()) as { url: string };
  return data.url;
}
