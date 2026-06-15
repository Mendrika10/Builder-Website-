import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "userId manquant." },
        { status: 400 },
      );
    }

    // Vérifier d'abord si l'utilisateur a déjà validé son email
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: userId },
    });

    if (utilisateur?.emailVerifie === true) {
      return NextResponse.json({
        isValidated: true,
        codeBlocked: false,
        blockedUntil: null,
        secondsLeftBlocked: 0,
        attemptsLeft: 5,
        expiresAt: null,
        secondsLeftExpires: 0,
      });
    }

    const record = await prisma.emailVerification.findFirst({
      where: { idUtilisateur: userId },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json(
        { message: "Aucun enregistrement trouvé." },
        { status: 404 },
      );
    }

    const now = new Date();
    let blockedUntil = record.blockedUntil ?? null;
    let codeBlocked = record.codeBlocked;
    let countAttempts = record.countAttempts;

    // Auto-reset block if expired
    if (codeBlocked && blockedUntil && blockedUntil <= now) {
      await prisma.emailVerification.update({
        where: { id: record.id },
        data: {
          codeBlocked: false,
          blockedUntil: null,
          countAttempts: 0,
        },
      });
      blockedUntil = null;
      codeBlocked = false;
      countAttempts = 0;
    }

    const secondsLeftBlocked =
      blockedUntil && blockedUntil > now
        ? Math.max(
            0,
            Math.floor((blockedUntil.getTime() - now.getTime()) / 1000),
          )
        : 0;
    const secondsLeftExpires =
      record.expiresAt && record.expiresAt > now
        ? Math.max(
            0,
            Math.floor((record.expiresAt.getTime() - now.getTime()) / 1000),
          )
        : 0;

    return NextResponse.json({
      isValidated: record.isValidated,
      codeBlocked,
      blockedUntil,
      secondsLeftBlocked,
      attemptsLeft: Math.max(0, 5 - countAttempts),
      expiresAt: record.expiresAt,
      secondsLeftExpires,
    });
  } catch (err) {
    console.error("[VERIFY/STATUS]", err);
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}
