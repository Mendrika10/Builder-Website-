import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

/** Plan exposé par l'API — champs publics uniquement. */
export type PublicPlan = {
  id: string;
  nom: string;
  prixMensuel: number;
  prixAnnuel: number;
  maxSites: number;
  maxPages: number;
  stockageGo: number;
  domainePerso: boolean;
  sslInclus: boolean;
  analytics: boolean;
  removeBranding: boolean;
  supportNiveau: string;
};

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  /** US-010 — Catalogue des plans actifs, trié par prix croissant. */
  async listActive(): Promise<PublicPlan[]> {
    const plans = await this.prisma.plan.findMany({
      where: { estActif: true },
      orderBy: { prixMensuel: "asc" },
    });
    return plans.map((p) => ({
      id: p.id,
      nom: p.nom,
      prixMensuel: Number(p.prixMensuel),
      prixAnnuel: Number(p.prixAnnuel),
      maxSites: p.maxSites,
      maxPages: p.maxPages,
      stockageGo: p.stockageGo,
      domainePerso: p.domainePerso,
      sslInclus: p.sslInclus,
      analytics: p.analytics,
      removeBranding: p.removeBranding,
      supportNiveau: p.supportNiveau,
    }));
  }
}
