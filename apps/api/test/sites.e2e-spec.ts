import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { PrismaClient } from "../src/generated/prisma";
import { AppModule } from "../src/app.module";

/** Données uniques par run — chaque utilisateur crée son propre compte vérifié. */
const runId = Date.now();
const PASSWORD = "Secret123";

describe("Sites — CRUD + quotas (e2e, SITE-005)", () => {
  let app: INestApplication;
  const prisma = new PrismaClient();
  let tokenA: string;
  let tokenB: string;
  let siteIdA: string;

  /** Inscrit + vérifie un utilisateur, retourne son access token. */
  const verifiedUser = async (email: string): Promise<string> => {
    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ nom: "Sites Runner", email, motDePasse: PASSWORD })
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
    tokenA = await verifiedUser(`sites.a.${runId}@test.mg`);
    tokenB = await verifiedUser(`sites.b.${runId}@test.mg`);
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it("SITE-001 : création → 201, slug dérivé du nom (accents gérés)", async () => {
    const res = await request(app.getHttpServer())
      .post("/sites")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ nom: `Café de l'Hotel ${runId}` })
      .expect(201);
    expect(res.body.slug).toBe(`cafe-de-l-hotel-${runId}`);
    siteIdA = res.body.id;
  });

  it("SITE-001 : quota Gratuit (1 site) → 2e site 403 avec message plan", async () => {
    const res = await request(app.getHttpServer())
      .post("/sites")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ nom: "Deuxième site" })
      .expect(403);
    expect(String(res.body.message)).toContain("Gratuit");
  });

  it("SITE-001 : slug fourni déjà pris → 409 explicite (pas 500)", async () => {
    await request(app.getHttpServer())
      .post("/sites")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ nom: "Autre site", slug: `cafe-de-l-hotel-${runId}` })
      .expect(409);
  });

  it("SITE-002 : liste isolée — B voit 0 site, A en voit 1", async () => {
    const listB = await request(app.getHttpServer())
      .get("/sites")
      .set("Authorization", `Bearer ${tokenB}`)
      .expect(200);
    expect(listB.body).toHaveLength(0);

    const listA = await request(app.getHttpServer())
      .get("/sites")
      .set("Authorization", `Bearer ${tokenA}`)
      .expect(200);
    expect(listA.body).toHaveLength(1);
  });

  it("SITE-002 : sans JWT → 401", () => {
    return request(app.getHttpServer()).get("/sites").expect(401);
  });

  it("SITE-003 : renommage → 200", async () => {
    const res = await request(app.getHttpServer())
      .patch(`/sites/${siteIdA}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ nom: "Café Renommé" })
      .expect(200);
    expect(res.body.nom).toBe("Café Renommé");
  });

  it("SITE-003 : renommage du site d'un autre utilisateur → 404", () => {
    return request(app.getHttpServer())
      .patch(`/sites/${siteIdA}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ nom: "Piraté" })
      .expect(404);
  });

  it("SITE-003 : suppression → liste vide ensuite", async () => {
    await request(app.getHttpServer())
      .delete(`/sites/${siteIdA}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .expect(200);

    const list = await request(app.getHttpServer())
      .get("/sites")
      .set("Authorization", `Bearer ${tokenA}`)
      .expect(200);
    expect(list.body).toHaveLength(0);
  });
});
