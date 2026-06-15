import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const modeles = await prisma.modele.findMany({
    include: { categorie: { select: { nom: true, icone: true } } },
    orderBy: [{ estPremium: "asc" }, { nbUtilisations: "desc" }],
  });

  return NextResponse.json(modeles);
}
