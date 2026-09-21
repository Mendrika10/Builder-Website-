import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { SubscriptionController, StripeWebhookController } from "./subscription.controller";
import { SubscriptionService } from "./subscription.service";

/** US-070 — Abonnements Stripe (état, checkout, webhook). */
@Module({
  imports: [PrismaModule],
  controllers: [SubscriptionController, StripeWebhookController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
