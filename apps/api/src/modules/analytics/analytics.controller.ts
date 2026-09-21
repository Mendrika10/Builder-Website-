import { Controller, Get, NotFoundException, Param, Post, Query } from "@nestjs/common";
import { CurrentUser } from "../../auth/current-user.decorator";
import { Public } from "../../auth/public.decorator";
import { AnalyticsService } from "./analytics.service";

/**
 * STATS-002 — Vue publique : incrémente le compteur du site, la vue du jour
 * et celle de la page visitée (`?page=<slug>`).
 * Remplace l'endpoint minimal du Sprint 05 (même route, enrichi).
 */
@Controller("public/sites")
export class PublicViewsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Public()
  @Post(":slug/view")
  async addView(@Param("slug") slug: string, @Query("page") page?: string) {
    return this.analytics.enregistrerVue(slug, page || undefined);
  }
}

/** STATS-003 — Statistiques du site (propriétaire, plan payant requis). */
@Controller("sites")
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get(":siteId/analytics")
  async statistiques(
    @CurrentUser("sub") userId: string,
    @Param("siteId") siteId: string,
    @Query("days") days?: string,
  ) {
    const jours = Number.parseInt(days ?? "30", 10);
    return this.analytics.statistiques(userId, siteId, Number.isNaN(jours) ? 30 : jours);
  }
}
