import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { ResendCodeDto } from "./dto/resend-code.dto";
import { VerifyDto } from "./dto/verify.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** AUTH-001 — Inscription d'un nouvel utilisateur. */
  @Post("register")
  async register(@Body() dto: RegisterDto) {
    const { user } = await this.authService.register(dto);
    return {
      user,
      message: "Compte créé. Un code de vérification vient d'être envoyé par email.",
    };
  }

  /** AUTH-002 — Vérification du code à 6 chiffres. */
  @Post("verify")
  @HttpCode(200)
  async verify(@Body() dto: VerifyDto) {
    const { user } = await this.authService.verify(dto.email, dto.code);
    return { user, message: "Email vérifié. Votre compte est actif." };
  }

  /** AUTH-003 — Renvoi du code de vérification (rate limited). */
  @Post("resend-code")
  @HttpCode(200)
  async resendCode(@Body() dto: ResendCodeDto) {
    return this.authService.resendCode(dto.email);
  }
}
