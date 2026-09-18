import { IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

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
}

/** SITE-003 — Renommage d'un site. */
export class UpdateSiteDto {
  @IsString()
  @MinLength(2, { message: "Le nom du site doit contenir au moins 2 caractères." })
  @MaxLength(120, { message: "Le nom du site ne peut pas dépasser 120 caractères." })
  nom!: string;
}
