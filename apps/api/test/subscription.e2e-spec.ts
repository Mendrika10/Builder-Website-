import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { PrismaClient } from "../src/generated/prisma";
import { AppModule } from "../src/app.module";

/**
 * PLAN-002 — E2E abonnement Stripe (sans clé configurée).
 * Tous les cas testent le comportement dégradé documenté :
 * checkout → 503, webhook sans/avec signature invalide → 400.
 */
describe("Subscription Stripe (e2e, STRIPE-002/003/004)", () => {
  let app: INestApplication;
  const prisma = new PrismaClient();
  let token: string;
  const runId = Date.now();
  const EMAIL = `stripe.${runId}@test.mg`;
  const PASSWORD = "Secret123";

  beforeAll(async () => {
    // Environnement sans Stripe : le comportement dégradé est celui documenté
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_PRICE_PRO;
    delete process.env.STRIPE_WEBHOOK_SECRET;

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    await app.init();
    await prisma.$connect();

    // Parcours standard : register → verify → login (compte neuf, unique par run)
    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ nom: "Stripe Runner", email: EMAIL, motDePasse: PASSWORD })
      .expect(201);
    const rows = await prisma.$queryRaw<{ code: string }[]>`
      SELECT ev.code FROM email_verification ev
      JOIN "user" u ON u.id = ev.id_utilisateur
      WHERE u.email = ${EMAIL} AND ev.is_validated = false
      ORDER BY ev.created_at DESC LIMIT 1`;
    await request(app.getHttpServer())
      .post("/auth/verify")
      .send({ email: EMAIL, code: rows[0].code })
      .expect(200);
    token = (
      await request(app.getHttpServer())
        .post("/auth/login")
        .send({ email: EMAIL, motDePasse: PASSWORD })
        .expect(200)
    ).body.accessToken;
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it("STRIPE-002 : GET /subscription/me → plan Gratuit sans abonnement", async () => {
    const res = await request(app.getHttpServer())
      .get("/subscription/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body.plan).toBe("Gratuit");
    expect(res.body.abonnement).toBeNull();
    expect(res.body.quotas.maxSites).toBe(1);
  });

  it("STRIPE-003 : POST /subscription/checkout → 503 sans clé Stripe", async () => {
    const res = await request(app.getHttpServer())
      .post("/subscription/checkout")
      .set("Authorization", `Bearer ${token}`)
      .expect(503);
    expect(JSON.stringify(res.body)).toMatch(/stripe/i);
  });

  it("STRIPE-004 : webhook sans signature → 400", async () => {
    await request(app.getHttpServer())
      .post("/webhooks/stripe")
      .send({ type: "checkout.session.completed" })
      .expect(400);
  });

  it("STRIPE-004 : webhook avec signature invalide → 400", async () => {
    await request(app.getHttpServer())
      .post("/webhooks/stripe")
      .set("stripe-signature", "t=1,v1=signature_invalide")
      .send({ type: "checkout.session.completed" })
      .expect(400);
  });
});
