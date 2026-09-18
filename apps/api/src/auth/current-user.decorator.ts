import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { JwtPayload } from "./auth.service";

/** Injecte le payload JWT de l'utilisateur authentifié dans un handler. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as JwtPayload;
  },
);
