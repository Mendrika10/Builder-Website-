import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET ?? "dev-secret-a-remplacer-en-prod";
const ACCESS_TOKEN_TTL = "15m";

@Module({
  imports: [
    JwtModule.register({
      secret: ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: ACCESS_TOKEN_TTL },
    }),
    ThrottlerModule.forRoot([
      { name: "default", ttl: 60_000, limit: 20 }, // garde-fou global : 20 req/min par IP
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // Rate limiting actif sur toute l'API (le @Throttle() des routes resserre la limite)
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    // AUTH-012 — Guard JWT actif sur toute l'API ; routes publiques via @Public()
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AuthModule {}
