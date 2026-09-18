import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { CurrentUser } from "../../auth/current-user.decorator";
import { SitesService } from "./sites.service";
import { CreateSiteDto, UpdateSiteDto } from "./dto/create-site.dto";

@Controller("sites")
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  /** SITE-001 — Créer un site (protégé : utilisateur du JWT). */
  @Post()
  create(@CurrentUser("sub") userId: string, @Body() dto: CreateSiteDto) {
    return this.sitesService.create(userId, dto);
  }

  /** SITE-002 — Lister mes sites. */
  @Get()
  listMine(@CurrentUser("sub") userId: string) {
    return this.sitesService.listMine(userId);
  }

  /** SITE-003 — Renommer mon site. */
  @Patch(":id")
  rename(
    @CurrentUser("sub") userId: string,
    @Param("id", ParseUUIDPipe) siteId: string,
    @Body() dto: UpdateSiteDto,
  ) {
    return this.sitesService.rename(userId, siteId, dto.nom);
  }

  /** SITE-003 — Supprimer (archive) mon site. */
  @Delete(":id")
  remove(
    @CurrentUser("sub") userId: string,
    @Param("id", ParseUUIDPipe) siteId: string,
  ) {
    return this.sitesService.remove(userId, siteId);
  }
}
