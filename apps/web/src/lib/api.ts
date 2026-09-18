export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3201";

/** POST JSON vers l'API — lève une Error avec le message renvoyé par le backend. */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const raw = (data as { message?: string | string[] } | null)?.message;
    const message = Array.isArray(raw) ? raw[0] : raw;
    throw new Error(message ?? "Une erreur est survenue. Réessayez.");
  }
  return data as T;
}
