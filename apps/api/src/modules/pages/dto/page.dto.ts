import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

/** Blocs de contenu supportés par le builder (v1 : hero, texte, cta). */
export type BlocType = "hero" | "texte" | "cta";
export type Bloc = { type: BlocType } & Partial<Record<"titre" | "sousTitre" | "texte" | "ctaLabel" | "ctaHref", string>>;

const BLOC_FIELDS: readonly (keyof Omit<Bloc, "type">)[] = ["titre", "sousTitre", "texte", "ctaLabel", "ctaHref"];

/** Ne garde que les blocs connus, avec leurs champs texte uniquement (limite la taille/injection). */
export function sanitizeContenu(input: unknown): Bloc[] {
  if (!Array.isArray(input)) return [];
  const out: Bloc[] = [];
  for (const raw of input.slice(0, 30)) {
    if (typeof raw !== "object" || raw === null) continue;
    const type = (raw as Record<string, unknown>).type;
    if (type !== "hero" && type !== "texte" && type !== "cta") continue;
    const bloc: Bloc = { type };
    for (const field of BLOC_FIELDS) {
      const value = (raw as Record<string, unknown>)[field];
      if (typeof value === "string" && value.trim()) {
        bloc[field] = value.trim().slice(0, 500);
      }
    }
    out.push(bloc);
  }
  return out;
}

export class CreatePageDto {
  @IsString({ message: "Le titre est obligatoire." })
  @MinLength(2, { message: "Le titre doit contenir au moins 2 caractères." })
  @MaxLength(120, { message: "Le titre ne doit pas dépasser 120 caractères." })
  titre!: string;

  @IsOptional()
  @IsString({ message: "Le slug doit être une chaîne de caractères." })
  slug?: string;

  @IsOptional()
  contenu?: unknown;

  @IsOptional()
  @IsInt({ message: "L'ordre doit être un entier." })
  @Min(0, { message: "L'ordre doit être positif." })
  ordre?: number;
}

export class UpdatePageDto {
  @IsOptional()
  @IsString({ message: "Le titre doit être une chaîne de caractères." })
  @MinLength(2, { message: "Le titre doit contenir au moins 2 caractères." })
  @MaxLength(120, { message: "Le titre ne doit pas dépasser 120 caractères." })
  titre?: string;

  @IsOptional()
  contenu?: unknown;

  @IsOptional()
  @IsInt({ message: "L'ordre doit être un entier." })
  @Min(0, { message: "L'ordre doit être positif." })
  ordre?: number;
}
