import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { randomInt } from "crypto";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import type { RegisterDto } from "./dto/register.dto";

const BCRYPT_COST = 12;
const CODE_EXPIRY_MINUTES = 15;
const MAX_ATTEMPTS = 3;
const BLOCK_MINUTES = 15;
const RESEND_COOLDOWN_SECONDS = 60;

/** Réponse 429 — trop de tentatives ou de demandes de code. */
export class TooManyRequestsException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}

/** Utilisateur renvoyé par l'API — jamais de hash de mot de passe. */
export type PublicUser = {
  id: string;
  nom: string;
  email: string;
  emailVerifie: boolean;
  createdAt: Date;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  /**
   * AUTH-001 — Inscription.
   * Crée l'utilisateur (emailVerifie=false), génère un code à 6 chiffres
   * valable 15 minutes et envoie l'email de vérification.
   */
  async register(dto: RegisterDto): Promise<{ user: PublicUser }> {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.prisma.utilisateur.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException("Un compte existe déjà avec cette adresse email.");
    }

    const motDePasse = await bcrypt.hash(dto.motDePasse, BCRYPT_COST);
    let user;
    try {
      user = await this.prisma.utilisateur.create({
        data: { nom: dto.nom.trim(), email, motDePasse },
      });
    } catch (error) {
      // Deux inscriptions concurrentes : le create perdant viole l'unicité (P2002)
      if (this.isUniqueViolation(error)) {
        throw new ConflictException("Un compte existe déjà avec cette adresse email.");
      }
      throw error;
    }

    await this.createAndSendCode(user.id, user.email);

    this.logger.log(`Inscription : ${user.email}`);
    return { user: this.toPublicUser(user) };
  }

  /**
   * AUTH-002 — Vérification du code.
   * Code correct → emailVerifie=true (réponse sans données sensibles).
   * 3 codes erronés → blocage temporaire de 15 minutes.
   */
  async verify(email: string, code: string): Promise<{ user: PublicUser }> {
    const normalized = email.trim().toLowerCase();
    const user = await this.prisma.utilisateur.findUnique({ where: { email: normalized } });
    if (!user) {
      throw new NotFoundException("Aucun compte n'existe avec cette adresse email.");
    }
    if (user.emailVerifie) {
      throw new ConflictException("Ce compte est déjà vérifié.");
    }

    const verification = await this.prisma.emailVerification.findFirst({
      where: { idUtilisateur: user.id, isValidated: false },
      orderBy: { createdAt: "desc" },
    });
    if (!verification) {
      throw new BadRequestException(
        "Aucun code actif. Demandez un nouveau code de vérification.",
      );
    }
    if (verification.blockedUntil && verification.blockedUntil > new Date()) {
      const minutes = Math.ceil((verification.blockedUntil.getTime() - Date.now()) / 60_000);
      throw new TooManyRequestsException(
        `Trop de tentatives. Réessayez dans ${minutes} minute(s).`,
      );
    }

    const isExpired = verification.expiresAt <= new Date();
    const isCorrect = code === verification.code;

    if (!isCorrect) {
      const countAttempts = verification.countAttempts + 1;
      const blocked = countAttempts >= MAX_ATTEMPTS;
      await this.prisma.emailVerification.update({
        where: { id: verification.id },
        data: {
          countAttempts,
          codeBlocked: blocked,
          blockedUntil: blocked ? new Date(Date.now() + BLOCK_MINUTES * 60_000) : null,
        },
      });
      if (blocked) {
        this.logger.warn(`Compte bloqué 15 min (3 codes erronés) : ${user.email}`);
        throw new TooManyRequestsException(
          `Trop de tentatives. Votre compte est temporairement bloqué (${BLOCK_MINUTES} minutes).`,
        );
      }
      throw new BadRequestException(
        `Code incorrect. Il vous reste ${MAX_ATTEMPTS - countAttempts} tentative(s).`,
      );
    }

    if (isExpired) {
      throw new BadRequestException(
        "Ce code a expiré. Demandez un nouveau code de vérification.",
      );
    }

    const [updatedUser] = await this.prisma.$transaction([
      this.prisma.utilisateur.update({
        where: { id: user.id },
        data: { emailVerifie: true, emailVerifieAt: new Date() },
      }),
      this.prisma.emailVerification.update({
        where: { id: verification.id },
        data: { isValidated: true },
      }),
    ]);

    this.logger.log(`Email vérifié : ${updatedUser.email}`);
    return { user: this.toPublicUser(updatedUser) };
  }

  /**
   * AUTH-003 — Renvoi du code.
   * Anti-abus : cooldown de 60 s, et un compte bloqué ne peut pas réclamer un code.
   */
  async resendCode(email: string): Promise<{ message: string }> {
    const normalized = email.trim().toLowerCase();
    const user = await this.prisma.utilisateur.findUnique({ where: { email: normalized } });
    // Réponse identique que le compte existe ou non : pas d'énumération d'emails
    const message =
      "Si un compte non vérifié existe, un nouveau code vient d'être envoyé.";
    if (!user || user.emailVerifie) {
      return { message };
    }

    const last = await this.prisma.emailVerification.findFirst({
      where: { idUtilisateur: user.id },
      orderBy: { createdAt: "desc" },
    });
    if (last) {
      if (last.blockedUntil && last.blockedUntil > new Date()) {
        const minutes = Math.ceil((last.blockedUntil.getTime() - Date.now()) / 60_000);
        throw new TooManyRequestsException(
          `Compte temporairement bloqué. Réessayez dans ${minutes} minute(s).`,
        );
      }
      const elapsed = (Date.now() - last.createdAt.getTime()) / 1000;
      if (elapsed < RESEND_COOLDOWN_SECONDS) {
        const remaining = Math.ceil(RESEND_COOLDOWN_SECONDS - elapsed);
        throw new TooManyRequestsException(
          `Un code a déjà été envoyé récemment. Réessayez dans ${remaining} s.`,
        );
      }
    }

    await this.createAndSendCode(user.id, user.email);
    this.logger.log(`Code renvoyé : ${user.email}`);
    return { message };
  }

  /** Génère un code à 6 chiffres, le persiste avec expiration et envoie l'email. */
  private async createAndSendCode(userId: string, email: string): Promise<void> {
    const code = String(randomInt(100000, 1000000));
    await this.prisma.emailVerification.create({
      data: {
        idUtilisateur: userId,
        code,
        expiresAt: new Date(Date.now() + CODE_EXPIRY_MINUTES * 60_000),
      },
    });
    await this.notifications.sendVerificationCode(email, code);
  }

  /** P2002 = violation d'unicité PostgreSQL (deux creates concurrents, même email). */
  private isUniqueViolation(error: unknown): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    );
  }

  private toPublicUser(user: {
    id: string;
    nom: string;
    email: string;
    emailVerifie: boolean;
    createdAt: Date;
  }): PublicUser {
    return {
      id: user.id,
      nom: user.nom,
      email: user.email,
      emailVerifie: user.emailVerifie,
      createdAt: user.createdAt,
    };
  }
}
