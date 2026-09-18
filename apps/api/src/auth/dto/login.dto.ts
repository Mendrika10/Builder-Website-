import { IsEmail, IsString, MinLength } from "class-validator";

/** AUTH-010 — Connexion. */
export class LoginDto {
  @IsEmail({}, { message: "Adresse email invalide." })
  email!: string;

  @IsString()
  @MinLength(1, { message: "Le mot de passe est requis." })
  motDePasse!: string;
}
