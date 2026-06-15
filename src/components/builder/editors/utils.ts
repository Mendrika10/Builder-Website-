export type NavLink = { label: string; type: "section" | "page"; href: string };

export function normalizeNavLinks(raw: unknown[]): NavLink[] {
  return raw.map((l) =>
    typeof l === "string"
      ? { label: l, href: "#", type: "section" as const }
      : (l as NavLink),
  );
}
