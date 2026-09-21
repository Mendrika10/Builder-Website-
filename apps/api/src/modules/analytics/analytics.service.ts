import { ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { resoudrePlanEffectif, PLAN_GRATUIT_DEFAUT } from "../subscription/plan-effectif";

/** Fenêtre d'une série quotidienne (bornée pour protéger l'API). */
const JOURS_MAX = 90;

/** Date du jour tronquée à minuit (UTC), pour les buckets quotidiens. */
function aujourdhui(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * STATS-002/003 — Analytics par site.
 * Les vues sont agrégées par jour (et par page) dans page_view_daily :
 * un upsert atomique par visite, des agrégations simples à la lecture.
 */
@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** STATS-002 — Incrémente la vue du jour (site + page optionnelle), atomiquement. */
  async enregistrerVue(slug: string, pageSlug?: string) {
    const site = await this.prisma.site.findUnique({
      where: { slug },
      select: { id: true, statut: true },
    });
    if (!site || site.statut !== "publie") {
      throw new NotFoundException("Site introuvable.");
    }

    // Toute visite tombe sur une page : idPage est requis (upsert sans NULL).
    if (!pageSlug) throw new NotFoundException("Page introuvable.");
    const page = await this.prisma.page.findFirst({
      where: { idSite: site.id, slug: pageSlug },
      select: { id: true },
    });
    if (!page) throw new NotFoundException("Page introuvable.");
    await this.prisma.page.update({ where: { id: page.id }, data: { vues: { increment: 1 } } });

    const [siteMisAJour] = await this.prisma.$transaction([
      this.prisma.site.update({ where: { id: site.id }, data: { vues: { increment: 1 } }, select: { vues: true } }),
      this.prisma.vueJournaliere.upsert({
        where: { idSite_idPage_date: { idSite: site.id, idPage: page.id, date: aujourdhui() } },
        create: { idSite: site.id, idPage: page.id, date: aujourdhui(), compteur: 1 },
        update: { compteur: { increment: 1 } },
      }),
    ]);
    // Le total à jour sert à l'affichage du compteur sur le site public.
    return { vues: siteMisAJour.vues };
  }

  /** STATS-003 — Total, série quotidienne et top pages (réservé aux plans payants). */
  async statistiques(idUtilisateur: string, siteId: string, jours: number) {
    const site = await this.prisma.site.findFirst({
      where: { id: siteId, idUtilisateur, statut: { not: "archive" } },
      include: { pages: { orderBy: { vues: "desc" }, take: 5, select: { id: true, titre: true, slug: true, vues: true } } },
    });
    if (!site) throw new NotFoundException("Site introuvable.");

    const plan = (await resoudrePlanEffectif(this.prisma, idUtilisateur)) ?? PLAN_GRATUIT_DEFAUT;
    if (!plan.analytics) {
      throw new ForbiddenException(
        `Les statistiques détaillées sont incluses dans les plans Pro et Business. Passez au plan supérieur pour y accéder.`,
      );
    }

    const nJours = Math.min(Math.max(jours || 30, 1), JOURS_MAX);
    const depuis = new Date(aujourdhui());
    depuis.setUTCDate(depuis.getUTCDate() - (nJours - 1));

    const rows = await this.prisma.vueJournaliere.groupBy({
      by: ["date"],
      where: { idSite: site.id, date: { gte: depuis } },
      _sum: { compteur: true },
      orderBy: { date: "asc" },
    });
    const parJour = new Map(rows.map((r) => [r.date.toISOString().slice(0, 10), r._sum.compteur ?? 0]));
    const serie = Array.from({ length: nJours }, (_, i) => {
      const d = new Date(depuis);
      d.setUTCDate(d.getUTCDate() + i);
      const iso = d.toISOString().slice(0, 10);
      return { date: iso, vues: parJour.get(iso) ?? 0 };
    });

    const total = serie.reduce((s, j) => s + j.vues, 0);
    const topPages = site.pages.filter((p) => p.vues > 0);

    return {
      site: { nom: site.nom, slug: site.slug },
      periode: { jours: nJours, depuis: depuis.toISOString().slice(0, 10) },
      totalVues: total,
      vuesAujourdHui: serie[serie.length - 1]?.vues ?? 0,
      serie,
      topPages: topPages.map((p) => ({ titre: p.titre, slug: p.slug, vues: p.vues })),
    };
  }
}
