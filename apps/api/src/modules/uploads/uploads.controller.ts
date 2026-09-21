import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import type { Response } from "express";
import { join } from "node:path";
import { CurrentUser } from "../../auth/current-user.decorator";
import { Public } from "../../auth/public.decorator";

export const UPLOADS_DIR = join(process.cwd(), "uploads");

const EXT_PAR_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

@Controller()
export class UploadsController {
  /** IMG-001 — Upload d'une image (jpg/png/webp ≤ 2 Mo) → URL relative servie en statique. */
  @Post("uploads")
  @UseInterceptors(
    FileInterceptor("fichier", {
      storage: diskStorage({
        destination: UPLOADS_DIR,
        filename: (_req, file, cb) => {
          const ext = EXT_PAR_MIME[file.mimetype] ?? ".jpg";
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  upload(
    @CurrentUser("sub") userId: string,
    @UploadedFile() fichier: Express.Multer.File,
  ) {
    void userId;
    // Validation manuelle : mimetype réel (magic bytes via multer) + taille
    const MIMES = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!fichier || !MIMES.has(fichier.mimetype) || fichier.size > 2 * 1024 * 1024) {
      throw new BadRequestException("Image invalide : jpg, png ou webp de 2 Mo maximum.");
    }
    return { url: `/uploads/${fichier.filename}` };
  }

  /** IMG-001 — Sert les fichiers uploadés (public : les images des sites publiés y font référence). */
  @Public()
  @Get("uploads/:nom")
  serve(@Param("nom") nom: string, @Res() res: Response) {
    if (!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(nom)) {
      throw new NotFoundException("Fichier introuvable.");
    }
    const chemin = join(UPLOADS_DIR, nom);
    if (!existsSync(chemin)) throw new NotFoundException("Fichier introuvable.");
    const ext = nom.split(".").pop();
    const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    res.setHeader("Content-Type", mime);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.sendFile(chemin);
  }
}
