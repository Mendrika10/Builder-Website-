import { IsString, MinLength } from "class-validator";

/** AUTH-011 — Rafraîchissement de session. */
export class RefreshDto {
  @IsString()
  @MinLength(10, { message: "Refresh token manquant." })
  refreshToken!: string;
}
