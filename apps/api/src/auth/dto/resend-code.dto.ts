import { IsEmail } from "class-validator";

/** AUTH-003 — Renvoi du code de vérification. */
export class ResendCodeDto {
  @IsEmail({}, { message: "Adresse email invalide." })
  email!: string;
}
