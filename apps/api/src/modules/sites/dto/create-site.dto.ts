import { IsOptional, IsString, IsIn, Matches, MaxLength, MinLength } from "class-validator";

/** Thèmes de couleur proposés (v1 : cohérence design, pas de couleur libre). */
export const THEMES = ["indigo", "emeraude", "orange", "rose", "ocean"] as const;
export type Theme = (typeof THEMES)[number];

/** SITE-001 — Création d'un site. */
export class CreateSiteDto {
  @IsString()
  @MinLength(2, { message: "Le nom du site doit contenir au moins 2 caractères." })
  @MaxLength(120, { message: "Le nom du site ne peut pas dépasser 120 caractères." })
  nom!: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Le slug doit contenir au moins 3 caractères." })
  @MaxLength(120, { message: "Le slug ne peut pas dépasser 120 caractères." })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets.",
  })
  slug?: string;

  @IsOptional()
  @IsIn(THEMES as unknown as string[], { message: "Thème inconnu." })
  theme?: Theme;
}

/** SITE-003 — Renommage et/ou thème d'un site. */
export class UpdateSiteDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: "Le nom du site doit contenir au moins 2 caractères." })
  @MaxLength(120, { message: "Le nom du site ne peut pas dépasser 120 caractères." })
  nom?: string;

  @IsOptional()
  @IsIn(THEMES as unknown as string[], { message: "Thème inconnu." })
  theme?: Theme;
}
