import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

/**
 * AUTH-004 — Emails transactionnels (Nodemailer).
 * Sans SMTP configuré (dev) : le transport journalise le message au lieu de l'envoyer,
 * le code de vérification reste visible dans la console de l'API.
 * SMTP de test (ex. Ethereal) : SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly transporter: Transporter;

  constructor() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    this.transporter = SMTP_HOST
      ? nodemailer.createTransport({
          host: SMTP_HOST,
          port: Number(SMTP_PORT) || 587,
          secure: Number(SMTP_PORT) === 465,
          auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
        })
      : nodemailer.createTransport({ jsonTransport: true });
  }

  async sendVerificationCode(to: string, code: string): Promise<void> {
    await this.sendMail({
      to,
      subject: "Votre code de vérification Site.mg",
      text: `Bonjour,\n\nVotre code de vérification est : ${code}\n\nIl expire dans 15 minutes.\n\nL'équipe Site.mg`,
      html: `<p>Bonjour,</p><p>Votre code de vérification est : <strong style="font-size:1.4em">${code}</strong></p><p>Il expire dans 15 minutes.</p><p>L'équipe Site.mg</p>`,
    });
  }

  private async sendMail(options: nodemailer.SendMailOptions): Promise<void> {
    try {
      const info = await this.transporter.sendMail(options);
      // jsonTransport : le message complet est dans info.message — le code y est lisible en dev
      this.logger.log(`Email → ${options.to} : ${String(info.message).slice(0, 200)}`);
    } catch (error) {
      // L'email ne doit jamais faire échouer l'inscription : on journalise et on continue
      this.logger.error(`Échec envoi email → ${options.to}`, error instanceof Error ? error.stack : String(error));
    }
  }
}
