import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "./public.decorator";
import type { JwtPayload } from "./auth.service";

export type RequestWithUser = Request & { user: JwtPayload };

/**
 * AUTH-012 — Guard JWT activé globalement (voir AuthModule).
 * Les routes publiques (register/verify/resend/login/refresh/logout/health/plans)
 * sont marquées @Public().
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException("Authentification requise.");
    }

    try {
      request.user = await this.jwt.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException("Session expirée ou invalide. Reconnectez-vous.");
    }
    return true;
  }

  /** JWT par header Authorization: Bearer, ou cookie httpOnly `access_token`. */
  private extractToken(request: Request): string | null {
    const header = request.headers.authorization;
    if (header?.startsWith("Bearer ")) return header.slice(7);
    const cookies = request.headers.cookie;
    if (cookies) {
      const match = cookies.match(/(?:^|;\s*)access_token=([^;]+)/);
      if (match) return decodeURIComponent(match[1]);
    }
    return null;
  }
}
