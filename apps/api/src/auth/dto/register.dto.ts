import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

/** AUTH-001 — Inscription : nom, email, mot de passe. */
export class RegisterDto {
  @IsString()
  @MinLength(2, { message: "Le nom doit contenir au moins 2 caractères." })
  @MaxLength(100, { message: "Le nom ne peut pas dépasser 100 caractères." })
  nom!: string;

  @IsEmail({}, { message: "Adresse email invalide." })
  @MaxLength(255, { message: "Adresse email trop longue." })
  email!: string;

  @IsString()
  @MinLength(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
  @MaxLength(72, { message: "Le mot de passe ne peut pas dépasser 72 caractères." })
  @Matches(/[A-Za-z]/, { message: "Le mot de passe doit contenir au moins une lettre." })
  @Matches(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre." })
  motDePasse!: string;
}
