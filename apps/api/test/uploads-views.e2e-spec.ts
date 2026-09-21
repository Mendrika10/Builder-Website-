import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { PrismaClient } from "../src/generated/prisma";
import { AppModule } from "../src/app.module";
import { existsSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const runId = Date.now();
const PASSWORD = "Secret123";

describe("Uploads, vues et thème (e2e, Sprint 05)", () => {
  let app: INestApplication;
  const prisma = new PrismaClient();
  let token: string;
  let siteId: string;
  let slug: string;
  let uploadedName: string | null = null;

  const verifiedUser = async (email: string): Promise<string> => {
    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ nom: "Sprint05 Runner", email, motDePasse: PASSWORD })
      .expect(201);
    const rows = await prisma.$queryRaw<{ code: string }[]>`
      SELECT ev.code FROM email_verification ev
      JOIN "user" u ON u.id = ev.id_utilisateur
      WHERE u.email = ${email} AND ev.is_validated = false
      ORDER BY ev.created_at DESC LIMIT 1`;
    await request(app.getHttpServer())
      .post("/auth/verify")
      .send({ email, code: rows[0].code })
      .expect(200);
    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email, motDePasse: PASSWORD })
      .expect(200);
    return login.body.accessToken as string;
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    await app.init();
    await prisma.$connect();
    token = await verifiedUser(`s05.${runId}@test.mg`);
    const site = await request(app.getHttpServer())
      .post("/sites")
      .set("Authorization", `Bearer ${token}`)
      .send({ nom: `Site Sprint05 ${runId}` })
      .expect(201);
    siteId = site.body.id;
    slug = site.body.slug;
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
    // Nettoyage du fichier uploadé par le run
    if (uploadedName) {
      const chemin = join(process.cwd(), "uploads", uploadedName);
      if (existsSync(chemin)) unlinkSync(chemin);
    }
  });

  it("IMG-001 : upload png → 201 avec URL relative /uploads/<uuid>.png", async () => {
    // PNG minimal valide (1x1 pixel)
    const png = Buffer.from(
      "89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4890000000D49444154789C626001000000FFFF03000006000557BFABD40000000049454E44AE426082",
      "hex",
    );
    const res = await request(app.getHttpServer())
      .post("/uploads")
      .set("Authorization", `Bearer ${token}`)
      .attach("fichier", png, { filename: "test.png", contentType: "image/png" })
      .expect(201);
    expect(res.body.url).toMatch(/^\/uploads\/[a-f0-9-]{36}\.png$/);
    uploadedName = (res.body.url as string).split("/").pop() ?? null;
  });

  it("IMG-001 : fichier servi en GET /uploads/:nom", async () => {
    const res = await request(app.getHttpServer()).get(`/uploads/${uploadedName}`).expect(200);
    expect(res.headers["content-type"]).toBe("image/png");
  });

  it("IMG-001 : traversal et nom invalide → 404", () => {
    return request(app.getHttpServer()).get("/uploads/..%2Fprisma%2Fschema.prisma").expect(404);
  });

  it("VIEW-001 : vues sur site non publié → 404", () => {
    return request(app.getHttpServer()).post(`/public/sites/${slug}/view`).expect(404);
  });

  it("VIEW-001 : publication puis 2 visites → compteur incrémenté à 2", async () => {
    await request(app.getHttpServer())
      .post(`/sites/${siteId}/publish`)
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(200);

    await request(app.getHttpServer()).post(`/public/sites/${slug}/view`).expect(201);
    const second = await request(app.getHttpServer()).post(`/public/sites/${slug}/view`).expect(201);
    expect(second.body.vues).toBe(2);

    const view = await request(app.getHttpServer()).get(`/public/sites/${slug}`).expect(200);
    expect(view.body.vues).toBe(2);
  });

  it("US-060 : thème inconnu → 400 ; thème valide → persisté et exposé en public", async () => {
    await request(app.getHttpServer())
      .patch(`/sites/${siteId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ theme: "violet-flash" })
      .expect(400);

    await request(app.getHttpServer())
      .patch(`/sites/${siteId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ theme: "emeraude" })
      .expect(200);

    const view = await request(app.getHttpServer()).get(`/public/sites/${slug}`).expect(200);
    expect(view.body.theme).toBe("emeraude");
  });
});
