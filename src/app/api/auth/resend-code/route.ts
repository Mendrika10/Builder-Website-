import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createTransporter } from "@/lib/mailer";

const resendSchema = z.object({
  userId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Paramètres invalides." },
        { status: 400 },
      );
    }

    const { userId } = parsed.data;
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: userId },
      select: { email: true, nom: true },
    });

    if (!utilisateur) {
      return NextResponse.json(
        { message: "Utilisateur introuvable." },
        { status: 404 },
      );
    }

    const record = await prisma.emailVerification.findFirst({
      where: { idUtilisateur: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        code: true,
        expiresAt: true,
        isValidated: true,
        countAttempts: true,
        codeBlocked: true,
        blockedUntil: true,
      },
    });

    const now = new Date();
    const blockedUntil = (record as any)?.blockedUntil as Date | null;

    if (record?.isValidated) {
      return NextResponse.json(
        { message: "Adresse déjà vérifiée." },
        { status: 409 },
      );
    }

    // Auto-reset block if expired
    if (record && record.codeBlocked && blockedUntil && blockedUntil <= now) {
      await prisma.emailVerification.update({
        where: { id: record.id },
        data: {
          codeBlocked: false,
          blockedUntil: null,
          countAttempts: 0,
        },
      });
    }

    if (record && record.codeBlocked && blockedUntil && blockedUntil > now) {
      const remainingSeconds = Math.max(
        0,
        Math.floor((blockedUntil.getTime() - now.getTime()) / 1000),
      );
      return NextResponse.json(
        {
          message: "Code bloqué. Réessayez plus tard.",
          blockedUntil,
          secondsLeft: remainingSeconds,
          minutesLeft: Math.ceil(remainingSeconds / 60),
        },
        { status: 429 },
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    if (record) {
      await prisma.emailVerification.update({
        where: { id: record.id },
        data: {
          code,
          expiresAt,
          isValidated: false,
          countAttempts: 0,
          codeBlocked: false,
          blockedUntil: null,
        },
      });
    } else {
      await prisma.emailVerification.create({
        data: {
          idUtilisateur: userId,
          code,
          expiresAt,
          isValidated: false,
          countAttempts: 0,
          codeBlocked: false,
          blockedUntil: null,
        },
      });
    }

    const transporter = createTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || "no-reply@builder.local",
          to: utilisateur.email,
          subject: "Votre nouveau code de vérification",
          text: `Bonjour ${utilisateur.nom ?? "client"},\n\nVotre nouveau code de vérification est : ${code} (valide 2 minutes).\n\nMerci.`,
        });
      } catch (mailErr) {
        console.error("[RESEND-CODE][MAIL]", mailErr);
      }
    } else {
      console.log("[RESEND-CODE] SMTP non configuré — code:", code);
    }

    return NextResponse.json({ message: "Code de vérification renvoyé." });
  } catch (error) {
    console.error("[RESEND-CODE]", error);
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}
