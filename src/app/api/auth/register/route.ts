import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createTransporter } from "@/lib/mailer";

const registerSchema = z.object({
  nom: z.string().min(2).max(100),
  email: z.string().email().max(255),
  password: z.string().min(8).max(100),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Données invalides.", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { nom, email, password } = parsed.data;

    // 1. Vérification de l'utilisateur existant
    const existingUser = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (existingUser) {
      // CAS A : L'utilisateur est déjà vérifié -> Erreur 409
      if (existingUser.emailVerifie) {
        return NextResponse.json(
          { message: "Cet email est déjà utilisé et vérifié." },
          { status: 409 },
        );
      }

      // CAS B : L'utilisateur existe mais n'est pas vérifié -> On vérifie s'il est bloqué
      const blockRecord = await prisma.emailVerification.findFirst({
        where: { idUtilisateur: existingUser.id, codeBlocked: true },
        orderBy: { createdAt: "desc" },
      });

      const now = new Date();
      if (blockRecord?.blockedUntil && blockRecord.blockedUntil > now) {
        return NextResponse.json(
          {
            message:
              "Votre compte est temporairement bloqué. Veuillez patienter.",
            blockedUntil: blockRecord.blockedUntil,
            userId: existingUser.id,
          },
          { status: 429 },
        );
      }

      // L'utilisateur n'est pas vérifié et pas bloqué -> On va mettre à jour ses infos et renvoyer un code
      console.log(
        `[REGISTER] Mise à jour d'un utilisateur non vérifié : ${email}`,
      );
    }

    // 2. Préparation des données
    const planGratuit = await prisma.plan.findFirst({
      where: { nom: "Gratuit" },
      select: { id: true },
    });

    const hashedPassword = await bcrypt.hash(password, 12);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    try {
      // 3. TRANSACTION ATOMIQUE : Création ou Mise à jour
      const result = await prisma.$transaction(async (tx) => {
        let user;
        if (existingUser) {
          // Mise à jour de l'utilisateur non vérifié
          user = await tx.utilisateur.update({
            where: { id: existingUser.id },
            data: { nom, motDePasse: hashedPassword },
          });
        } else {
          // Création d'un nouvel utilisateur
          user = await tx.utilisateur.create({
            data: {
              nom,
              email,
              motDePasse: hashedPassword,
              role: "client",
              idPlan: planGratuit?.id ?? null,
            },
          });

          // Création de l'abonnement essai uniquement pour les nouveaux
          if (planGratuit) {
            await tx.abonnement.create({
              data: {
                idUtilisateur: user.id,
                idPlan: planGratuit.id,
                statut: "essai",
                periodicite: "mensuel",
              },
            });
          }
        }

        // Mise à jour ou création du code de vérification (Reset total)
        // On cherche le dernier enregistrement pour cet utilisateur pour le mettre à jour
        const lastVerification = await tx.emailVerification.findFirst({
          where: { idUtilisateur: user.id },
          orderBy: { createdAt: "desc" },
        });

        if (lastVerification) {
          await tx.emailVerification.update({
            where: { id: lastVerification.id },
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
          await tx.emailVerification.create({
            data: { idUtilisateur: user.id, code, expiresAt },
          });
        }

        return user;
      });

      // 4. Envoi de l'email (hors transaction pour ne pas bloquer la DB)
      const transporter = createTransporter();
      if (transporter) {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM || "no-reply@builder.local",
            to: email,
            subject: "Votre code de vérification",
            text: `Votre code : ${code} (valide 5 minutes)`,
          });
        } catch (mailErr) {
          console.error("[REGISTER][MAIL]", mailErr);
        }
      }

      return NextResponse.json(
        {
          message: existingUser
            ? "Vos informations ont été mises à jour. Un nouveau code a été envoyé."
            : "Compte créé. Code envoyé.",
          user: { id: result.id, email: result.email, nom: result.nom },
          userId: result.id,
        },
        { status: existingUser ? 200 : 201 },
      );
    } catch (txError) {
      console.error("[REGISTER][TRANSACTION]", txError);
      throw txError;
    }
  } catch (error) {
    console.error("[REGISTER]", error);
    return NextResponse.json(
      { message: "Erreur serveur. Veuillez réessayer." },
      { status: 500 },
    );
  }
}
