import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import slugify from "slugify";
import { entrepriseTemplate } from "@/lib/templates/entreprise-template";

const createSiteSchema = z.object({
  nom: z.string().min(2).max(120),
  langueDefaut: z.string().default("fr"),
  idModele: z.string().uuid().optional().nullable(),
});

export async function GET() {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const sites = await prisma.site.findMany({
    where: { idUtilisateur: session.user.id },
    include: { modele: true, _count: { select: { pages: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(sites);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = createSiteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Données invalides.", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { nom, langueDefaut, idModele } = parsed.data;

    // Vérifier la limite du plan
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: session.user.id },
      include: {
        plan: true,
        _count: { select: { sites: true } },
      },
    });

    if (!utilisateur) {
      return NextResponse.json(
        { message: "Utilisateur introuvable." },
        { status: 404 },
      );
    }

    const maxSites = utilisateur.plan?.maxSites ?? 1;
    if (utilisateur._count.sites >= maxSites) {
      return NextResponse.json(
        { message: `Limite de ${maxSites} site(s) atteinte pour votre plan.` },
        { status: 403 },
      );
    }

    // Générer un slug unique
    let slug = slugify(nom, { lower: true, strict: true });
    const existing = await prisma.site.count({ where: { slug } });
    if (existing > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    // Récupérer config par défaut du modèle si sélectionné
    let configDefaut: Record<string, unknown> = {};
    if (idModele) {
      const modele = await prisma.modele.findUnique({
        where: { id: idModele },
        select: { configDefaut: true, nom: true },
      });
      if (modele) {
        configDefaut = modele.configDefaut as Record<string, unknown>;
        // Pré-charger les sections du builder selon le modèle
        if (modele.nom === "Agence / Entreprise") {
          configDefaut = {
            ...configDefaut,
            builderSections: entrepriseTemplate,
          };
        }
        // Incrémenter nb_utilisations
        await prisma.modele.update({
          where: { id: idModele },
          data: { nbUtilisations: { increment: 1 } },
        });
      }
    }

    const site = await prisma.site.create({
      data: {
        idUtilisateur: session.user.id,
        idModele: idModele ?? null,
        nom,
        slug,
        langueDefaut,
        statut: "brouillon",
        parametres: configDefaut,
      },
    });

    // Créer une page d'accueil par défaut
    await prisma.page.create({
      data: {
        idSite: site.id,
        titre: "Accueil",
        slug: "accueil",
        type: "accueil",
        estAccueil: true,
        ordre: 0,
      },
    });

    // Créer un thème par défaut
    await prisma.theme.create({
      data: {
        idSite: site.id,
        nom: "Thème par défaut",
        paletteCouleurs: {
          primary: "#6366f1",
          secondary: "#8b5cf6",
          accent: "#06b6d4",
          background: "#ffffff",
          text: "#111827",
        },
        typographie: {
          fontFamily: "Inter, sans-serif",
          headingSize: "2rem",
          bodySize: "1rem",
        },
        estActif: true,
      },
    });

    return NextResponse.json({ site }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/sites]", error);
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}
