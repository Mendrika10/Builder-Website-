import type { PrismaService } from "../../prisma/prisma.service";

/** Quotas minimal requis pour appliquer un plan. */
export type PlanQuotas = { nom: string; maxSites: number; maxPages: number };

/**
 * PLAN-001 — Plan effectif de l'utilisateur : l'abonnement actif fait autorité
 * (Sprint 06), sinon repli sur le plan attaché au user.
 * Renvoie null si l'utilisateur n'existe pas.
 */
export async function resoudrePlanEffectif(
  prisma: PrismaService,
  idUtilisateur: string,
): Promise<PlanQuotas | null> {
  const abonnement = await prisma.abonnement.findFirst({
    where: { idUtilisateur, statut: "actif" },
    orderBy: { dateDebut: "desc" },
    include: { plan: true },
  });
  if (abonnement?.plan) {
    return {
      nom: abonnement.plan.nom,
      maxSites: abonnement.plan.maxSites,
      maxPages: abonnement.plan.maxPages,
    };
  }
  const user = await prisma.utilisateur.findUnique({
    where: { id: idUtilisateur },
    include: { plan: true },
  });
  if (!user) return null;
  return {
    nom: user.plan?.nom ?? "Gratuit",
    maxSites: user.plan?.maxSites ?? 1,
    maxPages: user.plan?.maxPages ?? 5,
  };
}
