export const SLUG_MAX_LENGTH = 100;

/**
 * Dérive un slug URL-safe : accents supprimés, minuscules, séparateurs en tirets.
 * Retourne "mon-site" si le résultat est vide (entrée sans caractère valide).
 */
export function slugify(input: string): string {
  return (
    input
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, SLUG_MAX_LENGTH) || "mon-site"
  );
}
