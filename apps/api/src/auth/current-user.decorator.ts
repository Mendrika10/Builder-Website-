import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { JwtPayload } from "./auth.service";

/** Injecte le payload JWT — ou une seule propriété via @CurrentUser("sub"). */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): JwtPayload | JwtPayload[keyof JwtPayload] => {
    const user = ctx.switchToHttp().getRequest().user as JwtPayload;
    return data ? user[data] : user;
  },
);
