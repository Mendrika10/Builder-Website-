import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.idPlan = (user as { idPlan?: string }).idPlan;
        token.emailVerifie = (user as { emailVerifie?: boolean }).emailVerifie;
        token.emailVerifieAt = (
          user as { emailVerifieAt?: Date | null }
        ).emailVerifieAt;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.idPlan = token.idPlan as string;
        session.user.emailVerifie = token.emailVerifie as boolean;
        session.user.emailVerifieAt = token.emailVerifieAt as Date | null;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const utilisateur = await prisma.utilisateur.findUnique({
          where: { email },
        });

        if (!utilisateur) return null;

        const passwordValid = await bcrypt.compare(
          password,
          utilisateur.motDePasse,
        );
        if (!passwordValid) return null;

        return {
          id: utilisateur.id,
          email: utilisateur.email,
          name: utilisateur.nom,
          role: utilisateur.role,
          idPlan: utilisateur.idPlan,
          emailVerifie: utilisateur.emailVerifie,
          emailVerifieAt: utilisateur.emailVerifieAt,
        };
      },
    }),
  ],
});
