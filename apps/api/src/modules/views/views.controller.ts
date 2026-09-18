import { Controller, NotFoundException, Param, Post } from "@nestjs/common";
import { Public } from "../../auth/public.decorator";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("public/sites")
export class ViewsController {
  constructor(private readonly prisma: PrismaService) {}

  /** VIEW-001 — Incrémente le compteur de vues d'un site publié (atomique). */
  @Public()
  @Post(":slug/view")
  async addView(@Param("slug") slug: string): Promise<{ vues: number }> {
    const site = await this.prisma.site.findUnique({ where: { slug }, select: { id: true, statut: true } });
    if (!site || site.statut !== "publie") {
      throw new NotFoundException("Site introuvable.");
    }
    const updated = await this.prisma.site.update({
      where: { id: site.id },
      data: { vues: { increment: 1 } },
      select: { vues: true },
    });
    return { vues: updated.vues };
  }
}
