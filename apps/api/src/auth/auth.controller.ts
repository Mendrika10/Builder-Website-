import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { Public } from "./public.decorator";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResendCodeDto } from "./dto/resend-code.dto";
import { VerifyDto } from "./dto/verify.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** AUTH-001 — Inscription d'un nouvel utilisateur. */
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post("register")
  async register(@Body() dto: RegisterDto) {
    const { user } = await this.authService.register(dto);
    return {
      user,
      message: "Compte créé. Un code de vérification vient d'être envoyé par email.",
    };
  }

  /** AUTH-002 — Vérification du code à 6 chiffres. */
  @Public()
  @Post("verify")
  @HttpCode(200)
  async verify(@Body() dto: VerifyDto) {
    const { user } = await this.authService.verify(dto.email, dto.code);
    return { user, message: "Email vérifié. Votre compte est actif." };
  }

  /** AUTH-003 — Renvoi du code de vérification (rate limited). */
  @Public()
  @Post("resend-code")
  @HttpCode(200)
  async resendCode(@Body() dto: ResendCodeDto) {
    return this.authService.resendCode(dto.email);
  }

  /** AUTH-010 — Connexion (rate limited anti brute-force). */
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post("login")
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /** AUTH-011 — Rotation du refresh token. */
  @Public()
  @Post("refresh")
  @HttpCode(200)
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  /** AUTH-011 — Déconnexion : révocation du refresh token. */
  @Public()
  @Post("logout")
  @HttpCode(200)
  async logout(@Body() dto: RefreshDto) {
    await this.authService.logout(dto.refreshToken);
    return { message: "Déconnecté." };
  }
}
