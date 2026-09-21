import { ServiceUnavailableException } from "@nestjs/common";
import Stripe from "stripe";

/** Message unique quand Stripe n'est pas configuré sur l'environnement. */
export const MESSAGE_STRIPE_ABSENT =
  "Paiement par carte indisponible : Stripe n'est pas configuré sur cet environnement.";

let client: Stripe | null = null;

/**
 * Client Stripe créé à la demande — aucune instance (ni crash au boot)
 * tant que STRIPE_SECRET_KEY n'est pas configurée.
 */
export function stripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new ServiceUnavailableException(MESSAGE_STRIPE_ABSENT);
  client ??= new Stripe(key);
  return client;
}
