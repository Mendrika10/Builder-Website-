import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { PrismaClient } from "../src/generated/prisma";
import { AppModule } from "../src/app.module";

/**
 * STATS-007 — E2E analytics : collecte (view publique) et consultation
 * gated par le plan effectif (403 Gratuit / OK Pro).
 */
describe("Analytics (e2e, STATS-002/003)", () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  const runId = Date.now();
  const OWNER = { email: `stats.owner.${runId}@test.mg`, password: "Secret123", nom: "Stats Owner" };
  const OTHER = { email: `stats.other.${runId}@test.mg`, password: "Secret123", nom: "Stats Other" };

  let ownerToken: string;
  let siteId: string;
  let pageSlug: string;
  const siteSlug = `stats-${runId}`;

  async function compteVerifieEtToken(u: { email: string; password: string; nom: string }) {
    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ nom: u.nom, email: u.email, motDePasse: u.password })
      .expect(201);
    const rows = await prisma.$queryRaw<{ code: string }[]>`
      SELECT ev.code FROM email_verification ev
      JOIN "user" us ON us.id = ev.id_utilisateur
      WHERE us.email = ${u.email} AND ev.is_validated = false
      ORDER BY ev.created_at DESC LIMIT 1`;
    await request(app.getHttpServer())
      .post("/auth/verify")
      .send({ email: u.email, code: rows[0].code })
      .expect(200);
    return (
      await request(app.getHttpServer())
        .post("/auth/login")
        .send({ email: u.email, motDePasse: u.password })
        .expect(200)
    ).body.accessToken as string;
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    await app.init();
    await prisma.$connect();

    ownerToken = await compteVerifieEtToken(OWNER);
    siteId = (
      await request(app.getHttpServer())
        .post("/sites")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ nom: "Stats Site", slug: siteSlug })
        .expect(201)
    ).body.id;
    pageSlug = (
      await request(app.getHttpServer())
        .post(`/sites/${siteId}/pages`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ titre: "Accueil" })
        .expect(201)
    ).body.slug;
    // Publier (sinon la vue publique est refusée) — @HttpCode(200)
    await request(app.getHttpServer())
      .post(`/sites/${siteId}/publish`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it("STATS-002 : la vue publique incrémente site, page et le jour en cours", async () => {
    await request(app.getHttpServer())
      .post(`/public/sites/${siteSlug}/view?page=${pageSlug}`)
      .expect(201);
    await request(app.getHttpServer())
      .post(`/public/sites/${siteSlug}/view?page=${pageSlug}`)
      .expect(201);

    const aujourdhui = new Date();
    aujourdhui.setUTCHours(0, 0, 0, 0);
    const rows = await prisma.$queryRaw<{ compteur: number }[]>`
      SELECT compteur FROM page_view_daily
      WHERE id_site = ${siteId}::uuid AND date = ${aujourdhui}::date`;
    expect(rows[0]?.compteur).toBe(2);
    const page = await prisma.$queryRaw<{ vues: number }[]>`
      SELECT vues FROM page WHERE id = (SELECT id FROM page WHERE id_site = ${siteId}::uuid LIMIT 1)`;
    expect(page[0]?.vues).toBe(2);
  });

  it("STATS-003 : analytics → 403 avec upsell tant que le plan est Gratuit", async () => {
    const res = await request(app.getHttpServer())
      .get(`/sites/${siteId}/analytics`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .expect(403);
    expect(res.body.message).toMatch(/Pro|Business/i);
  });

  it("STATS-003 : analytics → série et top pages une fois le plan Pro actif", async () => {
    const plan = await prisma.$queryRaw<{ id: string }[]>`SELECT id FROM plan WHERE nom = 'Pro'`;
    await prisma.$executeRaw`
      INSERT INTO subscription (id, id_utilisateur, id_plan, statut, date_debut, periodicite, renouvellement_auto, created_at)
      VALUES (gen_random_uuid(), (SELECT id FROM "user" WHERE email = ${OWNER.email}), ${plan[0].id}::uuid, 'actif', CURRENT_DATE, 'mensuel', true, NOW())`;

    const res = await request(app.getHttpServer())
      .get(`/sites/${siteId}/analytics?days=7`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .expect(200);
    expect(res.body.totalVues).toBe(2);
    expect(res.body.serie).toHaveLength(7);
    expect(res.body.topPages[0]).toMatchObject({ slug: pageSlug, vues: 2 });
  });

  it("STATS-003 : 404 si le site appartient à un autre utilisateur", async () => {
    const otherToken = await compteVerifieEtToken(OTHER);
    await request(app.getHttpServer())
      .get(`/sites/${siteId}/analytics`)
      .set("Authorization", `Bearer ${otherToken}`)
      .expect(404);
  });
});
