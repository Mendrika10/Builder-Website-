import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import { IsIn, IsOptional } from "class-validator";
import { CurrentUser } from "../../auth/current-user.decorator";
import { Public } from "../../auth/public.decorator";
import { CreatePageDto, UpdatePageDto } from "./dto/page.dto";
import { PagesService } from "./pages.service";

class PublishDto {
  @IsOptional()
  @IsIn(["publie", "brouillon"], { message: "Action de publication inconnue." })
  action?: "publie" | "brouillon";
}

@Controller()
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  /** PAGE-002 — Créer une page d'un de mes sites. */
  @Post("sites/:siteId/pages")
  create(
    @CurrentUser("sub") userId: string,
    @Param("siteId", ParseUUIDPipe) siteId: string,
    @Body() dto: CreatePageDto,
  ) {
    return this.pagesService.create(userId, siteId, dto);
  }

  /** PAGE-002 — Lister les pages d'un de mes sites. */
  @Get("sites/:siteId/pages")
  listForSite(
    @CurrentUser("sub") userId: string,
    @Param("siteId", ParseUUIDPipe) siteId: string,
  ) {
    return this.pagesService.listForSite(userId, siteId);
  }

  /** PAGE-002 — Modifier une page (titre, contenu, ordre). */
  @Put("pages/:id")
  update(@CurrentUser("sub") userId: string, @Param("id", ParseUUIDPipe) pageId: string, @Body() dto: UpdatePageDto) {
    return this.pagesService.update(userId, pageId, dto);
  }

  /** PAGE-002 — Supprimer une page. */
  @Delete("pages/:id")
  remove(@CurrentUser("sub") userId: string, @Param("id", ParseUUIDPipe) pageId: string) {
    return this.pagesService.remove(userId, pageId);
  }

  /** PAGE-003 — Publier / dépublier un site. */
  @Post("sites/:siteId/publish")
  @HttpCode(200)
  publish(
    @CurrentUser("sub") userId: string,
    @Param("siteId", ParseUUIDPipe) siteId: string,
    @Body() dto: PublishDto,
  ) {
    return dto.action === "brouillon"
      ? this.pagesService.unpublish(userId, siteId)
      : this.pagesService.publish(userId, siteId);
  }

  /** PAGE-003 — Vue publique : site publié + ses pages (accessible sans JWT). */
  @Public()
  @Get("public/sites/:slug")
  getPublicSite(@Param("slug") slug: string) {
    return this.pagesService.getPublicSite(slug);
  }

  /** PAGE-013 — Vue publique d'une page précise du site publié. */
  @Public()
  @Get("public/sites/:slug/pages/:pageSlug")
  getPublicPage(@Param("slug") slug: string, @Param("pageSlug") pageSlug: string) {
    return this.pagesService.getPublicSite(slug, pageSlug);
  }
}
