import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET /api/sites/[siteId]/builder — récupère les sections du builder
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { siteId } = await params;

  const site = await prisma.site.findFirst({
    where: { id: siteId, idUtilisateur: session.user.id },
    select: { parametres: true },
  });

  if (!site)
    return NextResponse.json({ message: "Site introuvable" }, { status: 404 });

  const parametres = site.parametres as Record<string, unknown>;
  const sections = parametres?.builderSections ?? null;
  const pages = parametres?.builderPages ?? [];

  return NextResponse.json({ sections, pages });
}

const saveSchema = z.object({
  sections: z.array(z.any()),
  pages: z.array(z.any()).optional(),
});

// PUT /api/sites/[siteId]/builder — sauvegarde les sections du builder
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { siteId } = await params;

  // Vérifier que le site appartient à l'utilisateur
  const site = await prisma.site.findFirst({
    where: { id: siteId, idUtilisateur: session.user.id },
    select: { id: true, parametres: true },
  });

  if (!site)
    return NextResponse.json({ message: "Site introuvable" }, { status: 404 });

  const body = await req.json();
  const parsed = saveSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ message: "Données invalides" }, { status: 400 });

  const { sections, pages } = parsed.data;

  // Fusionner avec les paramètres existants (ne pas écraser les autres champs)
  const existingParams = (site.parametres ?? {}) as Record<string, unknown>;
  const updatedParams = {
    ...existingParams,
    builderSections: sections,
    builderPages: pages ?? [],
  };

  await prisma.site.update({
    where: { id: site.id },
    data: { parametres: updatedParams },
  });

  return NextResponse.json({ ok: true });
}
