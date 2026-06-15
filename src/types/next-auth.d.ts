import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
      idPlan: string | null;
      emailVerifie: boolean;
      emailVerifieAt: Date | null;
    };
  }
}
