import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import type { Prisma } from "../../generated/prisma";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePageDto, sanitizeContenu, UpdatePageDto } from "./dto/page.dto";
import { slugify } from "../../common/slug";

/** Page renvoyée par l'API (jamais les données internes du site). */
export type PublicPage = {
  id: string;
  titre: string;
  slug: string;
  contenu: unknown;
  ordre: number;
  updatedAt: Date;
};

@Injectable()
export class PagesService {
  private readonly logger = new Logger(PagesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Vérifie que le site existe et appartient à l'utilisateur (404 sinon, sans fuite d'info). */
  private async findOwnedSite(userId: string, siteId: string) {
    const site = await this.prisma.site.findUnique({ where: { id: siteId } });
    if (!site || site.idUtilisateur !== userId || site.statut === "archive") {
      throw new NotFoundException("Site introuvable.");
    }
    return site;
  }

  /** PAGE-002 — Création d'une page (slug unique par site, quota max_pages du plan). */
  async create(userId: string, siteId: string, dto: CreatePageDto): Promise<PublicPage> {
    await this.findOwnedSite(userId, siteId);

    // PAGE-011 — Quota de pages du plan (défaut Gratuit si sans plan)
    const user = await this.prisma.utilisateur.findUnique({
      where: { id: userId },
      include: { plan: true },
    });
    const count = await this.prisma.page.count({ where: { idSite: siteId } });
    const maxPages = user?.plan?.maxPages ?? 5;
    if (count >= maxPages) {
      throw new ForbiddenException(
        `Votre plan ${user?.plan?.nom ?? "Gratuit"} autorise ${maxPages} pages. Passez au plan supérieur pour en créer davantage.`,
      );
    }

    const baseSlug = slugify(dto.slug ?? dto.titre);
    const slug = await this.uniqueSlug(siteId, baseSlug);
    if (dto.slug && slug !== dto.slug) {
      throw new ConflictException("Ce slug de page est déjà utilisé sur ce site. Choisissez-en un autre.");
    }

    const page = await this.prisma.page.create({
      data: {
        idSite: siteId,
        titre: dto.titre.trim(),
        slug,
        contenu: sanitizeContenu(dto.contenu) as unknown as Prisma.InputJsonValue,
        ordre: dto.ordre ?? 0,
      },
    });
    this.logger.log(`Page créée : ${slug} (site ${siteId})`);
    return this.toPublic(page);
  }

  /** PAGE-002 — Liste des pages d'un site (ownership requis). */
  async listForSite(userId: string, siteId: string): Promise<PublicPage[]> {
    await this.findOwnedSite(userId, siteId);
    const pages = await this.prisma.page.findMany({
      where: { idSite: siteId },
      orderBy: [{ ordre: "asc" }, { createdAt: "asc" }],
    });
    return pages.map((p) => this.toPublic(p));
  }

  /** PAGE-002 — Mise à jour d'une page (titre, contenu, ordre). */
  async update(userId: string, pageId: string, dto: UpdatePageDto): Promise<PublicPage> {
    const page = await this.findOwnedPage(userId, pageId);
    const updated = await this.prisma.page.update({
      where: { id: page.id },
      data: {
        ...(dto.titre !== undefined ? { titre: dto.titre.trim() } : {}),
        ...(dto.contenu !== undefined
          ? { contenu: sanitizeContenu(dto.contenu) as unknown as Prisma.InputJsonValue }
          : {}),
        ...(dto.ordre !== undefined ? { ordre: dto.ordre } : {}),
      },
    });
    return this.toPublic(updated);
  }

  /** PAGE-002 — Suppression d'une page. */
  async remove(userId: string, pageId: string): Promise<void> {
    const page = await this.findOwnedPage(userId, pageId);
    await this.prisma.page.delete({ where: { id: page.id } });
    this.logger.log(`Page supprimée : ${page.slug}`);
  }

  /** PAGE-003 — Publication du site (statut `publie` + date). */
  async publish(userId: string, siteId: string): Promise<{ statut: string; datePublication: Date }> {
    const site = await this.findOwnedSite(userId, siteId);
    const updated = await this.prisma.site.update({
      where: { id: site.id },
      data: { statut: "publie", datePublication: new Date() },
    });
    this.logger.log(`Site publié : ${site.slug}`);
    return { statut: updated.statut, datePublication: updated.datePublication as Date };
  }

  /** PAGE-003 — Dépublication (retour en brouillon). */
  async unpublish(userId: string, siteId: string): Promise<{ statut: string }> {
    const site = await this.findOwnedSite(userId, siteId);
    await this.prisma.site.update({
      where: { id: site.id },
      data: { statut: "brouillon" },
    });
    this.logger.log(`Site dépublié : ${site.slug}`);
    return { statut: "brouillon" };
  }

  /** PAGE-003 — Vue publique : site publié + pages, sans aucune donnée privée. */
  async getPublicSite(slug: string, pageSlug?: string) {
    const site = await this.prisma.site.findUnique({
      where: { slug },
      include: { pages: { orderBy: [{ ordre: "asc" }, { createdAt: "asc" }] } },
    });
    if (!site || site.statut !== "publie") {
      throw new NotFoundException("Site introuvable.");
    }
    const pages = site.pages.map((p) => ({ titre: p.titre, slug: p.slug, contenu: p.contenu }));
    if (pageSlug !== undefined) {
      // PAGE-013 — Une page précise (404 si absente, sans fuite sur les non publiées : tout est public ici)
      const page = pages.find((p) => p.slug === pageSlug);
      if (!page) throw new NotFoundException("Page introuvable.");
      return { nom: site.nom, slug: site.slug, page };
    }
    return { nom: site.nom, slug: site.slug, pages };
  }

  private async findOwnedPage(userId: string, pageId: string) {
    const page = await this.prisma.page.findUnique({ where: { id: pageId }, include: { site: true } });
    if (!page || page.site.idUtilisateur !== userId || page.site.statut === "archive") {
      throw new NotFoundException("Page introuvable.");
    }
    return page;
  }

  /** Garantit l'unicité du slug de page au sein d'un site (suffixe -2, -3…). */
  private async uniqueSlug(siteId: string, base: string): Promise<string> {
    for (let i = 1; i <= 20; i++) {
      const candidate = i === 1 ? base : `${base}-${i}`;
      const exists = await this.prisma.page.findUnique({
        where: { idSite_slug: { idSite: siteId, slug: candidate } },
      });
      if (!exists) return candidate;
    }
    throw new ConflictException("Impossible de dériver un slug unique. Précisez-le manuellement.");
  }

  private toPublic(page: {
    id: string;
    titre: string;
    slug: string;
    contenu: Prisma.JsonValue;
    ordre: number;
    updatedAt: Date;
  }): PublicPage {
    return {
      id: page.id,
      titre: page.titre,
      slug: page.slug,
      contenu: page.contenu,
      ordre: page.ordre,
      updatedAt: page.updatedAt,
    };
  }
}
