import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const verifySchema = z.object({
  userId: z.string().uuid(),
  code: z.string().length(6),
});

const MAX_ATTEMPTS = 5;

const BLOCK_SECONDS = Number(process.env.VERIFICATION_BLOCK_SECONDS ?? 3600);

function durationText(seconds: number) {
  if (seconds >= 60 && seconds % 60 === 0) return `${seconds / 60} minute(s)`;
  if (seconds >= 60) return `${Math.ceil(seconds / 60)} minute(s)`;
  return `${seconds} seconde(s)`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Paramètres invalides." },
        { status: 400 },
      );
    }

    const { userId, code } = parsed.data;
    const record = await prisma.emailVerification.findFirst({
      where: { idUtilisateur: userId },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json(
        { message: "Aucun code de vérification trouvé." },
        { status: 404 },
      );
    }

    const now = new Date();

    if (record.isValidated) {
      return NextResponse.json(
        { message: "Ce code a déjà été validé." },
        { status: 409 },
      );
    }

    if (record.codeBlocked) {
      if (record.blockedUntil && record.blockedUntil > now) {
        const remainingSeconds = Math.max(
          0,
          Math.floor((record.blockedUntil.getTime() - now.getTime()) / 1000),
        );
        return NextResponse.json(
          {
            message: "Code bloqué. Réessayez plus tard.",
            blockedUntil: record.blockedUntil,
            secondsLeft: remainingSeconds,
            minutesLeft: Math.ceil(remainingSeconds / 60),
          },
          { status: 429 },
        );
      }

      await prisma.emailVerification.update({
        where: { id: record.id },
        data: {
          codeBlocked: false,
          blockedUntil: null,
          countAttempts: 0,
        },
      });
    }

    if (record.expiresAt <= now) {
      return NextResponse.json(
        { message: "Code expiré. Demandez un nouveau code." },
        { status: 410 },
      );
    }

    if (record.code !== code) {
      const attempts = record.countAttempts + 1;
      const updateData: any = { countAttempts: attempts };
      const triesRemaining = Math.max(0, MAX_ATTEMPTS - attempts);

      if (attempts >= MAX_ATTEMPTS) {
        const blockedUntil = new Date(Date.now() + BLOCK_SECONDS * 1000);
        updateData.codeBlocked = true;
        updateData.blockedUntil = blockedUntil;
      }

      await prisma.emailVerification.update({
        where: { id: record.id },
        data: updateData,
      });

      if (attempts >= MAX_ATTEMPTS) {
        return NextResponse.json(
          {
            message: `Trop de tentatives. Le code est bloqué pendant ${durationText(
              BLOCK_SECONDS,
            )}.`,
            blockedUntil: updateData.blockedUntil,
            secondsLeft: BLOCK_SECONDS,
            attemptsLeft: 0,
          },
          { status: 429 },
        );
      }

      return NextResponse.json(
        {
          message: `Code incorrect. ${triesRemaining} tentative(s) restante(s).`,
          triesRemaining,
          attemptsLeft: triesRemaining,
          countAttempts: attempts,
        },
        { status: 400 },
      );
    }

    await prisma.$transaction([
      prisma.utilisateur.update({
        where: { id: userId },
        data: { emailVerifie: true, emailVerifieAt: new Date() },
      }),
      prisma.emailVerification.update({
        where: { id: record.id },
        data: {
          isValidated: true,
          countAttempts: 0,
          codeBlocked: false,
          blockedUntil: null,
        },
      }),
    ]);

    return NextResponse.json({ message: "Compte activé." });
  } catch (error) {
    console.error("[VERIFY]", error);
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}
