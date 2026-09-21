import { Module } from "@nestjs/common";
import { AnalyticsController, PublicViewsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";

/** US-080 — Collecte et consultation des vues par site. */
@Module({
  controllers: [PublicViewsController, AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
