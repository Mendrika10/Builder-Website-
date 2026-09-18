import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { PrismaClient } from "../src/generated/prisma";
import { AppModule } from "../src/app.module";

/** Données uniques par run — le parcours crée son propre utilisateur vérifié. */
const runId = Date.now();
const PASSWORD = "Secret123";

describe("Pages + publication (e2e, PAGE-004)", () => {
  let app: INestApplication;
  const prisma = new PrismaClient();
  let tokenA: string;
  let tokenB: string;
  let siteId: string;
  let pageId: string;

  /** Inscrit + vérifie un utilisateur, retourne son access token. */
  const verifiedUser = async (email: string): Promise<string> => {
    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ nom: "Pages Runner", email, motDePasse: PASSWORD })
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
    tokenA = await verifiedUser(`pages.a.${runId}@test.mg`);
    tokenB = await verifiedUser(`pages.b.${runId}@test.mg`);

    const site = await request(app.getHttpServer())
      .post("/sites")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ nom: `Site Pages ${runId}` })
      .expect(201);
    siteId = site.body.id;
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it("PAGE-002 : création de page → 201, slug dérivé du titre", async () => {
    const res = await request(app.getHttpServer())
      .post(`/sites/${siteId}/pages`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({
        titre: `Accueil`,
        contenu: [
          { type: "hero", titre: "Bienvenue", sousTitre: "Le meilleur restaurant", ctaLabel: "Réserver", ctaHref: "#contact" },
          { type: "texte", texte: "Une cuisine familiale depuis 1998." },
          { type: "type-inconnu", texte: "doit être filtré" },
        ],
      })
      .expect(201);
    expect(res.body.slug).toBe("accueil");
    // Le bloc inconnu a été filtré par la sanitization
    expect(res.body.contenu).toHaveLength(2);
    pageId = res.body.id;
  });

  it("PAGE-002 : slug imposé déjà pris → 409", async () => {
    await request(app.getHttpServer())
      .post(`/sites/${siteId}/pages`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ titre: "Autre page", slug: "accueil" })
      .expect(409);
  });

  it("PAGE-002 : PUT contenu + titre → 200", async () => {
    const res = await request(app.getHttpServer())
      .put(`/pages/${pageId}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({
        titre: "Accueil modifié",
        contenu: [{ type: "hero", titre: "Nouveau hero" }],
      })
      .expect(200);
    expect(res.body.titre).toBe("Accueil modifié");
    expect(res.body.contenu).toHaveLength(1);
  });

  it("PAGE-002 : ownership — un autre utilisateur → 404 (site et page)", async () => {
    await request(app.getHttpServer())
      .post(`/sites/${siteId}/pages`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ titre: "Piraté" })
      .expect(404);
    await request(app.getHttpServer())
      .put(`/pages/${pageId}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ titre: "Piraté" })
      .expect(404);
  });

  it("PAGE-002 : sans JWT → 401", () => {
    return request(app.getHttpServer()).get(`/sites/${siteId}/pages`).expect(401);
  });

  it("PAGE-003 : site non publié → vue publique 404", () => {
    return request(app.getHttpServer())
      .get(`/public/sites/site-pages-${runId}`)
      .expect(404);
  });

  it("PAGE-003 : publication → statut publie, vue publique 200 avec les pages", async () => {
    const pub = await request(app.getHttpServer())
      .post(`/sites/${siteId}/publish`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({})
      .expect(200);
    expect(pub.body.statut).toBe("publie");

    const view = await request(app.getHttpServer())
      .get(`/public/sites/site-pages-${runId}`)
      .expect(200);
    expect(view.body.nom).toBe(`Site Pages ${runId}`);
    expect(view.body.pages).toHaveLength(1);
    expect(view.body.pages[0].titre).toBe("Accueil modifié");
    // Aucune donnée privée ne fuit dans la vue publique
    expect(view.body.pages[0].id).toBeUndefined();
    expect(view.body.slug).toBeDefined();
  });

  it("PAGE-003 : dépublication → vue publique 404 à nouveau", async () => {
    await request(app.getHttpServer())
      .post(`/sites/${siteId}/publish`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ action: "brouillon" })
      .expect(200);
    await request(app.getHttpServer()).get(`/public/sites/site-pages-${runId}`).expect(404);
  });

  it("PAGE-002 : suppression de page → 200, liste vide", async () => {
    await request(app.getHttpServer())
      .delete(`/pages/${pageId}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .expect(200);
    const list = await request(app.getHttpServer())
      .get(`/sites/${siteId}/pages`)
      .set("Authorization", `Bearer ${tokenA}`)
      .expect(200);
    expect(list.body).toHaveLength(0);
  });
});
