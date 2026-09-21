"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

/**
 * VIEW-002 — Incrémente les vues du site une fois au montage
 * et affiche le compteur (valeur renvoyée par l'API).
 */
export function ViewCounter({ slug }: { slug: string }) {
  const [vues, setVues] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/public/sites/${slug}/view`, { method: "POST", signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { vues: number } | null) => {
        if (data) setVues(data.vues);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [slug]);

  if (vues === null) return null;
  return (
    <span className="text-neutral-400">
      {vues.toLocaleString("fr-FR")} vue{vues > 1 ? "s" : ""}
    </span>
  );
}
