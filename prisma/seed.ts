import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seed...");

  // ============================================================
  //  Plans
  // ============================================================
  const plans = await Promise.all([
    prisma.plan.upsert({
      where: { nom: "Gratuit" },
      update: {},
      create: {
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
        supportNiveau: "email",
      },
    }),
    prisma.plan.upsert({
      where: { nom: "Pro" },
      update: {},
      create: {
        nom: "Pro",
        prixMensuel: 12.0,
        prixAnnuel: 99.0,
        maxSites: 3,
        maxPages: 30,
        stockageGo: 10,
        domainePerso: true,
        sslInclus: true,
        analytics: true,
        removeBranding: true,
        supportNiveau: "chat",
      },
    }),
    prisma.plan.upsert({
      where: { nom: "Business" },
      update: {},
      create: {
        nom: "Business",
        prixMensuel: 29.0,
        prixAnnuel: 249.0,
        maxSites: 10,
        maxPages: 100,
        stockageGo: 50,
        domainePerso: true,
        sslInclus: true,
        analytics: true,
        removeBranding: true,
        supportNiveau: "prioritaire",
      },
    }),
  ]);
  console.log(`✅ ${plans.length} plans créés`);

  // ============================================================
  //  Catégories de modèles
  // ============================================================
  const categories = await Promise.all([
    prisma.categorieModele.upsert({
      where: { nom: "Portfolio" },
      update: {},
      create: { nom: "Portfolio", icone: "bi-briefcase", ordre: 1 },
    }),
    prisma.categorieModele.upsert({
      where: { nom: "Restaurant" },
      update: {},
      create: { nom: "Restaurant", icone: "bi-cup-hot", ordre: 2 },
    }),
    prisma.categorieModele.upsert({
      where: { nom: "E-commerce" },
      update: {},
      create: { nom: "E-commerce", icone: "bi-cart3", ordre: 3 },
    }),
    prisma.categorieModele.upsert({
      where: { nom: "Blog" },
      update: {},
      create: { nom: "Blog", icone: "bi-pencil", ordre: 4 },
    }),
    prisma.categorieModele.upsert({
      where: { nom: "Entreprise" },
      update: {},
      create: { nom: "Entreprise", icone: "bi-building", ordre: 5 },
    }),
    prisma.categorieModele.upsert({
      where: { nom: "Événementiel" },
      update: {},
      create: { nom: "Événementiel", icone: "bi-calendar-event", ordre: 6 },
    }),
  ]);
  console.log(`✅ ${categories.length} catégories créées`);

  // ============================================================
  //  Blocs de base
  // ============================================================
  const blocsData = [
    { nom: "Hero", type: "hero", categorie: "contenu", estPremium: false },
    { nom: "Galerie", type: "galerie", categorie: "media", estPremium: false },
    {
      nom: "Témoignages",
      type: "temoignage",
      categorie: "contenu",
      estPremium: false,
    },
    {
      nom: "Call to Action",
      type: "cta",
      categorie: "contenu",
      estPremium: false,
    },
    {
      nom: "Fonctionnalités",
      type: "features",
      categorie: "contenu",
      estPremium: false,
    },
    { nom: "À propos", type: "about", categorie: "contenu", estPremium: false },
    { nom: "Tarifs", type: "pricing", categorie: "contenu", estPremium: true },
    {
      nom: "Formulaire de contact",
      type: "contact_form",
      categorie: "formulaire",
      estPremium: false,
    },
    {
      nom: "Navigation",
      type: "navbar",
      categorie: "navigation",
      estPremium: false,
    },
    {
      nom: "Pied de page",
      type: "footer",
      categorie: "navigation",
      estPremium: false,
    },
    { nom: "Carte / Map", type: "map", categorie: "media", estPremium: true },
    { nom: "Vidéo", type: "video", categorie: "media", estPremium: true },
    { nom: "FAQ", type: "faq", categorie: "contenu", estPremium: false },
    { nom: "Équipe", type: "team", categorie: "contenu", estPremium: true },
    {
      nom: "Blog récent",
      type: "blog_recent",
      categorie: "contenu",
      estPremium: true,
    },
  ];

  for (const bloc of blocsData) {
    await prisma.bloc
      .upsert({
        where: { id: bloc.type }, // simplification pour seed
        update: {},
        create: bloc,
      })
      .catch(() => prisma.bloc.create({ data: bloc }));
  }
  console.log(`✅ ${blocsData.length} blocs créés`);

  // ============================================================
  //  Modèles de sites
  // ============================================================
  const catEntreprise = categories.find((c) => c.nom === "Entreprise")!;
  const catPortfolio = categories.find((c) => c.nom === "Portfolio")!;
  const catRestaurant = categories.find((c) => c.nom === "Restaurant")!;
  const catBlog = categories.find((c) => c.nom === "Blog")!;
  const catEcommerce = categories.find((c) => c.nom === "E-commerce")!;

  const modelesData = [
    {
      nom: "Agence / Entreprise",
      description: "Site vitrine professionnel avec hero percutant, services, témoignages, réalisations, FAQ et footer complet.",
      secteur: "Agence & Services",
      estPremium: false,
      apercuUrl: "/templates/entreprise",
      idCategorie: catEntreprise.id,
    },
    {
      nom: "Portfolio Créatif",
      description: "Mettez en valeur vos projets avec un design épuré et élégant.",
      secteur: "Créatif & Design",
      estPremium: false,
      apercuUrl: null,
      idCategorie: catPortfolio.id,
    },
    {
      nom: "Restaurant & Café",
      description: "Carte en ligne, réservations et ambiance pour séduire vos clients.",
      secteur: "Restauration",
      estPremium: false,
      apercuUrl: null,
      idCategorie: catRestaurant.id,
    },
    {
      nom: "Blog Personnel",
      description: "Partagez vos articles et créez une communauté autour de vos passions.",
      secteur: "Blogging",
      estPremium: false,
      apercuUrl: null,
      idCategorie: catBlog.id,
    },
    {
      nom: "Boutique E-commerce",
      description: "Vendez vos produits en ligne avec une boutique moderne et performante.",
      secteur: "Commerce",
      estPremium: true,
      apercuUrl: null,
      idCategorie: catEcommerce.id,
    },
  ];

  for (const m of modelesData) {
    const existing = await prisma.modele.findFirst({ where: { nom: m.nom } });
    if (existing) {
      await prisma.modele.update({ where: { id: existing.id }, data: { description: m.description, apercuUrl: m.apercuUrl } });
    } else {
      await prisma.modele.create({ data: m });
    }
  }
  console.log(`✅ ${modelesData.length} modèles créés`);

  // ============================================================
  //  Compte admin par défaut
  // ============================================================
  const planGratuit = plans[0];
  const hashPassword = await bcrypt.hash("Admin@1234!", 12);

  await prisma.utilisateur.upsert({
    where: { email: "admin@sitebuilder.dev" },
    update: {},
    create: {
      nom: "Admin",
      email: "admin@sitebuilder.dev",
      motDePasse: hashPassword,
      role: "admin",
      emailVerifie: true,
      emailVerifieAt: new Date(),
      idPlan: planGratuit.id,
    },
  });
  console.log("✅ Compte admin créé (admin@sitebuilder.dev / Admin@1234!)");

  console.log("🎉 Seed terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
