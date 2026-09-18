import { IsEmail, IsString, Length } from "class-validator";

/** AUTH-002 — Vérification : email + code à 6 chiffres. */
export class VerifyDto {
  @IsEmail({}, { message: "Adresse email invalide." })
  email!: string;

  @IsString()
  @Length(6, 6, { message: "Le code doit contenir exactement 6 chiffres." })
  code!: string;
}
