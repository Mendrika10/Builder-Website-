import { Injectable, Logger, NotFoundException, ServiceUnavailableException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { stripeClient } from "./stripe-client";

/** Plan payable par Stripe Checkout (configuré par env, pas de crash sans). */
const PLAN_PAYANT = "Pro";

/**
 * STRIPE-002/003/004 — Abonnements Stripe.
 * L'abonnement actif fait autorité sur le plan effectif de l'utilisateur
 * (les quotas sont calculés dans le service sites à partir de ce plan).
 */
@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Abonnement actif de l'utilisateur (le plus récent s'il y en a plusieurs). */
  actif(idUtilisateur: string) {
    return this.prisma.abonnement.findFirst({
      where: { idUtilisateur, statut: "actif" },
      orderBy: { dateDebut: "desc" },
    });
  }

  /** STRIPE-002 — État de l'abonnement + plan effectif. */
  async etat(idUtilisateur: string) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id: idUtilisateur },
      include: { plan: true },
    });
    if (!user) throw new NotFoundException("Utilisateur introuvable.");

    const abonnement = await this.actif(idUtilisateur);
    let planEffectif = user.plan?.nom ?? "Gratuit";
    if (abonnement) {
      const plan = await this.prisma.plan.findUnique({ where: { id: abonnement.idPlan } });
      if (plan) planEffectif = plan.nom;
    }
    return {
      plan: planEffectif,
      abonnement: abonnement
        ? {
            statut: abonnement.statut,
            periodicite: abonnement.periodicite,
            dateDebut: abonnement.dateDebut,
            dateFin: abonnement.dateFin,
            stripeSubId: abonnement.stripeSubId,
          }
        : null,
    };
  }

  /** STRIPE-003 — Session Stripe Checkout vers le plan payant. */
  async creerCheckout(idUtilisateur: string) {
    const stripe = stripeClient(); // 503 explicite si pas de clé
    const priceId = process.env.STRIPE_PRICE_PRO;
    if (!priceId) {
      throw new ServiceUnavailableException(
        "Plan Pro non payable : STRIPE_PRICE_PRO n'est pas configuré.",
      );
    }
    const user = await this.prisma.utilisateur.findUnique({ where: { id: idUtilisateur } });
    if (!user) throw new NotFoundException("Utilisateur introuvable.");

    const successUrl = `${process.env.CORS_ORIGIN?.split(",")[0] ?? "http://localhost:3200"}/dashboard/billing?success=1`;
    const cancelUrl = `${process.env.CORS_ORIGIN?.split(",")[0] ?? "http://localhost:3200"}/dashboard/billing?annule=1`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: idUtilisateur,
      customer_email: user.email,
      metadata: { idUtilisateur },
    });

    this.logger.log(`Checkout Stripe créé pour ${user.email} : ${session.url}`);
    return { url: session.url };
  }

  /** STRIPE-004 — checkout.session.completed : active la souscription du plan. */
  async activerDepuisCheckout(session: {
    client_reference_id: string | null;
    subscription: string | null;
  }) {
    const idUtilisateur = session.client_reference_id;
    if (!idUtilisateur || !session.subscription) {
      this.logger.warn("Webhook checkout sans client_reference_id ou subscription — ignoré.");
      return;
    }
    const plan = await this.prisma.plan.findUnique({ where: { nom: PLAN_PAYANT } });
    if (!plan) {
      this.logger.error(`Plan « ${PLAN_PAYANT} » introuvable en base — souscription non créée.`);
      return;
    }
    // Clôture tout abonnement actif précédent avant d'activer le nouveau
    await this.prisma.abonnement.updateMany({
      where: { idUtilisateur, statut: "actif" },
      data: { statut: "annule", dateFin: new Date() },
    });
    await this.prisma.abonnement.create({
      data: {
        idUtilisateur,
        idPlan: plan.id,
        statut: "actif",
        stripeSubId: session.subscription,
        periodicite: "mensuel",
        renouvellementAuto: true,
      },
    });
    this.logger.log(`Souscription ${PLAN_PAYANT} activée pour ${idUtilisateur}.`);
  }
}
