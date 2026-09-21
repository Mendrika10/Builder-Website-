"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

/**
 * STATS-002 — Incrémente les vues (site + page visitée) une fois au montage
 * et affiche le compteur global du site (total renvoyé par l'API).
 */
export function ViewCounter({ slug, pageSlug }: { slug: string; pageSlug?: string }) {
  const [vues, setVues] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const query = pageSlug ? `?page=${encodeURIComponent(pageSlug)}` : "";
    fetch(`${API_URL}/public/sites/${slug}/view${query}`, { method: "POST", signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { vues: number } | null) => {
        if (data) setVues(data.vues);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [slug, pageSlug]);

  if (vues === null) return null;
  return (
    <span className="text-neutral-400">
      {vues.toLocaleString("fr-FR")} vue{vues > 1 ? "s" : ""}
    </span>
  );
}
