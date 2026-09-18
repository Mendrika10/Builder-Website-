import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { PrismaClient } from "../src/generated/prisma";
import { AppModule } from "../src/app.module";

/** Données uniques par run — le parcours crée son propre utilisateur vérifié. */
const runId = Date.now();
const EMAIL = `session.${runId}@test.mg`;
const PASSWORD = "Secret123";

describe("Auth — parcours login→refresh→logout (e2e, AUTH-015)", () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    await app.init();
    await prisma.$connect();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it("prépare un utilisateur vérifié (register → verify)", async () => {
    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ nom: "Session Runner", email: EMAIL, motDePasse: PASSWORD })
      .expect(201);

    const rows = await prisma.$queryRaw<{ code: string }[]>`
      SELECT ev.code FROM email_verification ev
      JOIN "user" u ON u.id = ev.id_utilisateur
      WHERE u.email = ${EMAIL} AND ev.is_validated = false
      ORDER BY ev.created_at DESC LIMIT 1`;
    expect(rows[0]?.code).toMatch(/^\d{6}$/);

    await request(app.getHttpServer())
      .post("/auth/verify")
      .send({ email: EMAIL, code: rows[0].code })
      .expect(200);
  });

  it("AUTH-010 : login → tokens (access + refresh)", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: EMAIL, motDePasse: PASSWORD })
      .expect(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    expect(res.body.user.emailVerifie).toBe(true);
  });

  it("AUTH-011 : refresh → rotation (ancien token révoqué, réutilisation → 401)", async () => {
    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: EMAIL, motDePasse: PASSWORD })
      .expect(200);
    const firstRefresh = login.body.refreshToken as string;

    const refreshed = await request(app.getHttpServer())
      .post("/auth/refresh")
      .send({ refreshToken: firstRefresh })
      .expect(200);
    expect(refreshed.body.refreshToken).toBeDefined();
    expect(refreshed.body.refreshToken).not.toBe(firstRefresh);

    // Réutilisation du token d'origine → détecté comme révoqué
    await request(app.getHttpServer())
      .post("/auth/refresh")
      .send({ refreshToken: firstRefresh })
      .expect(401);
  });

  it("AUTH-011 : logout → le refresh token devient inutilisable", async () => {
    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: EMAIL, motDePasse: PASSWORD })
      .expect(200);
    const refreshToken = login.body.refreshToken as string;

    await request(app.getHttpServer())
      .post("/auth/logout")
      .send({ refreshToken })
      .expect(200);

    await request(app.getHttpServer())
      .post("/auth/refresh")
      .send({ refreshToken })
      .expect(401);
  });

  it("AUTH-010 : mauvais mot de passe → 401 sans indication sur l'email", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: EMAIL, motDePasse: "TotallyWrong1" })
      .expect(401);
    expect(res.body.message).toBe("Email ou mot de passe incorrect.");
  });
});
