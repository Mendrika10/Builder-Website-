import { Controller, Get, Logger, Post, RawBodyRequest, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { CurrentUser } from "../../auth/current-user.decorator";
import { Public } from "../../auth/public.decorator";
import { PrismaService } from "../../prisma/prisma.service";
import { SubscriptionService } from "./subscription.service";
import { stripeClient } from "./stripe-client";

/**
 * STRIPE-002/003 — Endpoints authentifiés de l'abonnement.
 * Le guard JWT est global (APP_GUARD) : pas de décorateur supplémentaire ici.
 */
@Controller("subscription")
export class SubscriptionController {
  constructor(
    private readonly subscription: SubscriptionService,
    private readonly prisma: PrismaService,
  ) {}

  @Get("me")
  async me(@CurrentUser("sub") userId: string) {
    const etat = await this.subscription.etat(userId);
    // Plan complet pour afficher les quotas à l'écran de facturation
    const plan = await this.prisma.plan.findUnique({ where: { nom: etat.plan } });
    return {
      ...etat,
      quotas: plan
        ? { maxSites: plan.maxSites, maxPages: plan.maxPages, stockageGo: plan.stockageGo }
        : null,
    };
  }

  @Post("checkout")
  async checkout(@CurrentUser("sub") userId: string) {
    return this.subscription.creerCheckout(userId);
  }
}

/**
 * STRIPE-004 — Webhook Stripe (public, signature vérifiée).
 * Le raw body est indispensable : la signature Stripe couvre les octets exacts.
 */
@Controller("webhooks")
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(private readonly subscription: SubscriptionService) {}

  @Public()
  @Post("stripe")
  async stripe(@Req() req: RawBodyRequest<Request>, @Res() res: Response) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    const signature = req.headers["stripe-signature"];
    if (!secret || !signature) {
      this.logger.warn("Webhook Stripe sans secret ou signature configurés.");
      return res.status(400).send("Webhook non configuré");
    }
    if (!req.rawBody) {
      return res.status(400).send("Raw body indisponible");
    }
    let event: {
      type: string;
      data: { object: { client_reference_id: string | null; subscription: string | null } };
    };
    try {
      event = stripeClient().webhooks.constructEvent(
        req.rawBody,
        signature,
        secret,
      ) as typeof event;
    } catch {
      this.logger.warn("Webhook Stripe : signature invalide.");
      return res.status(400).send("Signature Stripe invalide");
    }

    if (event.type === "checkout.session.completed") {
      await this.subscription.activerDepuisCheckout(event.data.object);
    } else {
      this.logger.log(`Webhook Stripe ignoré : ${event.type}`);
    }
    return res.json({ received: true });
  }
}
