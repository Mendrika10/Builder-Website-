import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { resoudrePlanEffectif } from "../subscription/plan-effectif";
import { slugify } from "../../common/slug";
import { CreateSiteDto } from "./dto/create-site.dto";

/** Site renvoyé par l'API — jamais les paramètres internes complets. */
export type PublicSite = {
  id: string;
  nom: string;
  slug: string;
  statut: string;
  theme: string;
  createdAt: Date;
  updatedAt: Date;
};

const SLUG_MAX_ATTEMPTS = 20;

@Injectable()
export class SitesService {
  private readonly logger = new Logger(SitesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * SITE-001 — Création avec quota du plan (max_sites).
   * Le slug est dérivé du nom (ou fourni), rendu unique par suffixe -2, -3…
   */
  async create(userId: string, dto: CreateSiteDto): Promise<PublicSite> {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable.");
    }

    const count = await this.prisma.site.count({
      where: { idUtilisateur: userId, statut: { not: "archive" } },
    });
    // PLAN-001 — le plan effectif suit l'abonnement actif (Sprint 06), sinon le plan du user
    const plan = (await resoudrePlanEffectif(this.prisma, userId)) ?? {
      nom: "Gratuit",
      maxSites: 1,
      maxPages: 5,
    };
    if (count >= plan.maxSites) {
      throw new ForbiddenException(
        `Votre plan ${plan.nom} autorise ${plan.maxSites} site${plan.maxSites > 1 ? "s" : ""}. Passez au plan supérieur pour en créer davantage.`,
      );
    }

    const baseSlug = slugify(dto.slug ?? dto.nom);
    const slug = await this.uniqueSlug(baseSlug);
    if (dto.slug && slug !== dto.slug) {
      throw new ConflictException("Ce slug est déjà utilisé. Choisissez-en un autre.");
    }

    const site = await this.prisma.site.create({
      data: { idUtilisateur: userId, nom: dto.nom.trim(), slug },
    });
    this.logger.log(`Site créé : ${site.slug} (par ${userId})`);
    return this.toPublicSite(site);
  }

  /** SITE-002 — Liste des sites de l'utilisateur (isolation par JWT). */
  async listMine(userId: string): Promise<PublicSite[]> {
    const sites = await this.prisma.site.findMany({
      where: { idUtilisateur: userId, statut: { not: "archive" } },
      orderBy: { createdAt: "desc" },
    });
    return sites.map((s) => this.toPublicSite(s));
  }

  /** SITE-003 — Renommage et/ou thème (le site doit appartenir à l'utilisateur). */
  async update(userId: string, siteId: string, dto: { nom?: string; theme?: string }): Promise<PublicSite> {
    const site = await this.findOwned(userId, siteId);
    const updated = await this.prisma.site.update({
      where: { id: site.id },
      data: {
        ...(dto.nom !== undefined ? { nom: dto.nom.trim() } : {}),
        ...(dto.theme !== undefined ? { theme: dto.theme } : {}),
      },
    });
    return this.toPublicSite(updated);
  }

  /** SITE-003 — Suppression (soft delete → statut archive). */
  async remove(userId: string, siteId: string): Promise<void> {
    const site = await this.findOwned(userId, siteId);
    await this.prisma.site.update({
      where: { id: site.id },
      data: { statut: "archive" },
    });
    this.logger.log(`Site archivé : ${site.slug}`);
  }

  private async findOwned(userId: string, siteId: string) {
    const site = await this.prisma.site.findUnique({ where: { id: siteId } });
    if (!site || site.idUtilisateur !== userId || site.statut === "archive") {
      throw new NotFoundException("Site introuvable.");
    }
    return site;
  }

  /** Garantit l'unicité du slug par suffixe numérique. */
  private async uniqueSlug(base: string): Promise<string> {
    for (let i = 1; i <= SLUG_MAX_ATTEMPTS; i++) {
      const candidate = i === 1 ? base : `${base}-${i}`;
      const exists = await this.prisma.site.findUnique({ where: { slug: candidate } });
      if (!exists) return candidate;
    }
    throw new ConflictException("Impossible de dériver un slug unique. Précisez-le manuellement.");
  }

  private toPublicSite(site: {
    id: string;
    nom: string;
    slug: string;
    statut: string;
    theme: string;
    createdAt: Date;
    updatedAt: Date;
  }): PublicSite {
    return {
      id: site.id,
      nom: site.nom,
      slug: site.slug,
      statut: site.statut,
      theme: site.theme,
      createdAt: site.createdAt,
      updatedAt: site.updatedAt,
    };
  }
}
