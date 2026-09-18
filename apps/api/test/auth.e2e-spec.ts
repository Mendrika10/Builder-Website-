import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { PrismaClient } from "../src/generated/prisma";
import { AppModule } from "../src/app.module";

/** Email unique par run — le parcours crée son propre utilisateur. */
const runId = Date.now();
const EMAIL = `e2e.${runId}@test.mg`;
const PASSWORD = "Secret123";
const CODE = /^\d{6}$/;

describe("Auth — parcours register→verify (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  it("AUTH-001 : register → 201, utilisateur non vérifié, réponse sans hash", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ nom: "E2E Runner", email: EMAIL, motDePasse: PASSWORD })
      .expect(201);
    expect(res.body.user.email).toBe(EMAIL);
    expect(res.body.user.emailVerifie).toBe(false);
    expect(JSON.stringify(res.body)).not.toContain("motDePasse");
  });

  it("AUTH-001 : register en doublon → 409", () => {
    return request(app.getHttpServer())
      .post("/auth/register")
      .send({ nom: "E2E Runner", email: EMAIL, motDePasse: PASSWORD })
      .expect(409);
  });

  it("AUTH-001 : payload invalide → 400", () => {
    return request(app.getHttpServer())
      .post("/auth/register")
      .send({ nom: "X", email: "pas-un-email", motDePasse: "court" })
      .expect(400);
  });

  it("AUTH-002 : mauvais code → 400 avec tentatives restantes", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/verify")
      .send({ email: EMAIL, code: "000000" })
      .expect(400);
    expect(String(res.body.message)).toContain("tentative");
  });

  it("AUTH-002 : bon code → 200, emailVerifie=true", async () => {
    const code = await readLatestCode();
    expect(code).toMatch(CODE);

    const res = await request(app.getHttpServer())
      .post("/auth/verify")
      .send({ email: EMAIL, code })
      .expect(200);
    expect(res.body.user.emailVerifie).toBe(true);
  });

  it("AUTH-002 : re-vérification → 409", () => {
    return request(app.getHttpServer())
      .post("/auth/verify")
      .send({ email: EMAIL, code: "123456" })
      .expect(409);
  });

  it("AUTH-003 : resend sur compte vérifié → réponse générique 200", () => {
    return request(app.getHttpServer())
      .post("/auth/resend-code")
      .send({ email: EMAIL })
      .expect(200)
      .expect({ message: "Si un compte non vérifié existe, un nouveau code vient d'être envoyé." });
  });

  afterAll(async () => {
    await app.close();
  });
});

/** Lit le code de vérification le plus récent directement en base (via Prisma). */
async function readLatestCode(): Promise<string> {
  const prisma = new PrismaClient();
  try {
    const rows = await prisma.$queryRaw<{ code: string }[]>`
      SELECT ev.code FROM email_verification ev
      JOIN "user" u ON u.id = ev.id_utilisateur
      WHERE u.email = ${EMAIL} AND ev.is_validated = false
      ORDER BY ev.created_at DESC LIMIT 1`;
    if (!rows[0]) throw new Error("Aucun code de vérification trouvé en base");
    return rows[0].code;
  } finally {
    await prisma.$disconnect();
  }
}
