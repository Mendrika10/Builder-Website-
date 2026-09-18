// ============================================================
//  FOND-021 — Seed des 3 plans (Gratuit / Pro / Business)
//  Idempotent : upsert par `nom` unique — relancer ne duplique
//  rien. Quotas issus du référentiel v1 (prisma/seed.ts).
// ============================================================

import { PrismaClient, Prisma, SupportNiveau } from "../src/generated/prisma";

const prisma = new PrismaClient();

const PLANS: Prisma.PlanCreateInput[] = [
  {
    nom: "Gratuit",
    prixMensuel: 0,
    prixAnnuel: 0,
    maxSites: 1,
    maxPages: 5,
    stockageGo: 1,
    domainePerso: false,
    sslInclus: false,
    analytics: false,
    removeBranding: false,
    supportNiveau: SupportNiveau.email,
  },
  {
    nom: "Pro",
    prixMensuel: 12,
    prixAnnuel: 99,
    maxSites: 3,
    maxPages: 30,
    stockageGo: 10,
    domainePerso: true,
    sslInclus: true,
    analytics: true,
    removeBranding: true,
    supportNiveau: SupportNiveau.chat,
  },
  {
    nom: "Business",
    prixMensuel: 29,
    prixAnnuel: 249,
    maxSites: 10,
    maxPages: 100,
    stockageGo: 50,
    domainePerso: true,
    sslInclus: true,
    analytics: true,
    removeBranding: true,
    supportNiveau: SupportNiveau.prioritaire,
  },
];

async function main() {
  for (const plan of PLANS) {
    await prisma.plan.upsert({
      where: { nom: plan.nom },
      update: {},
      create: plan,
    });
    console.log(`  ✅ plan « ${plan.nom} »`);
  }
  console.log(`🎉 Seed terminé : ${PLANS.length} plans (Gratuit / Pro / Business)`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
