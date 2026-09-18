import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("Plans (e2e, PLAN-004)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /plans → 3 plans actifs triés par prix (seed FOND-021)", async () => {
    const res = await request(app.getHttpServer())
      .get("/plans")
      .expect(200);

    const plans = res.body as Array<Record<string, unknown>>;
    expect(plans).toHaveLength(3);
    expect(plans.map((p) => p.nom)).toEqual(["Gratuit", "Pro", "Business"]);
    expect(plans.map((p) => p.prixMensuel)).toEqual([0, 12, 29]);
    expect(plans[0].maxSites).toBe(1);
    expect(plans[1].maxSites).toBe(3);
    expect(plans[2].maxSites).toBe(10);
  });

  it("GET /plans → réponse sans champs internes", async () => {
    const res = await request(app.getHttpServer())
      .get("/plans")
      .expect(200);

    const plans = res.body as Array<Record<string, unknown>>;
    for (const plan of plans) {
      expect(plan.estActif).toBeUndefined();
      expect(plan.createdAt).toBeUndefined();
    }
  });
});
