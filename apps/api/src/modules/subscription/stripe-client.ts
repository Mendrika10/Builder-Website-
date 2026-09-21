import { ServiceUnavailableException } from "@nestjs/common";
import type Stripe from "stripe";
// Stripe v22 : le module CJS EST le constructeur (pas d'export default) —
// on le récupère donc tel quel, typé comme le constructeur du package.
const StripeCtor = require("stripe") as typeof import("stripe");

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
  client ??= new StripeCtor(key);
  return client;
}
