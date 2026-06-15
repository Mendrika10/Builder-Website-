import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ siteId: string }>;
}

// ── GET /api/sites/[siteId] ──────────────────────────────────
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { siteId } = await params;

  const site = await prisma.site.findFirst({
    where: { id: siteId, idUtilisateur: session.user.id },
    select: {
      id: true,
      nom: true,
      slug: true,
      statut: true,
      langueDefaut: true,
      domainePerso: true,
      metaSeo: true,
      createdAt: true,
      updatedAt: true,
      modele: { select: { nom: true } },
    },
  });

  if (!site)
    return NextResponse.json({ error: "Site introuvable" }, { status: 404 });

  return NextResponse.json(site);
}

// ── PATCH /api/sites/[siteId] ────────────────────────────────
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { siteId } = await params;

  const site = await prisma.site.findFirst({
    where: { id: siteId, idUtilisateur: session.user.id },
    select: { id: true },
  });

  if (!site)
    return NextResponse.json({ error: "Site introuvable" }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const { nom, slug, statut, langueDefaut, domainePerso, metaSeo } = body as {
    nom?: string;
    slug?: string;
    statut?: string;
    langueDefaut?: string;
    domainePerso?: string | null;
    metaSeo?: Record<string, unknown>;
  };

  // Vérifier l'unicité du slug si modifié
  if (slug) {
    const existing = await prisma.site.findFirst({
      where: { slug, NOT: { id: siteId } },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Ce slug est déjà utilisé" },
        { status: 409 },
      );
    }
  }

  const updated = await prisma.site.update({
    where: { id: siteId },
    data: {
      ...(nom !== undefined && { nom }),
      ...(slug !== undefined && { slug }),
      ...(statut !== undefined && {
        statut: statut as "brouillon" | "publie" | "suspendu" | "archive",
      }),
      ...(langueDefaut !== undefined && { langueDefaut }),
      ...(domainePerso !== undefined && { domainePerso: domainePerso || null }),
      ...(metaSeo !== undefined && { metaSeo }),
    },
    select: { id: true, nom: true, slug: true, statut: true },
  });

  return NextResponse.json(updated);
}

// ── DELETE /api/sites/[siteId] ───────────────────────────────
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { siteId } = await params;

  const site = await prisma.site.findFirst({
    where: { id: siteId, idUtilisateur: session.user.id },
    select: { id: true },
  });

  if (!site)
    return NextResponse.json({ error: "Site introuvable" }, { status: 404 });

  await prisma.site.delete({ where: { id: siteId } });

  return NextResponse.json({ success: true });
}
