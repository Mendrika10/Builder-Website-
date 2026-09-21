import type { PrismaService } from "../../prisma/prisma.service";

/** Quotas et fonctionnalités requis pour appliquer un plan. */
export type PlanEffectif = {
  nom: string;
  maxSites: number;
  maxPages: number;
  analytics: boolean;
};

/** Repli quand le user est sans plan (ou inconnu en aval). */
export const PLAN_GRATUIT_DEFAUT: PlanEffectif = {
  nom: "Gratuit",
  maxSites: 1,
  maxPages: 5,
  analytics: false,
};

/**
 * PLAN-001 — Plan effectif de l'utilisateur : l'abonnement actif fait autorité
 * (Sprint 06), sinon repli sur le plan attaché au user.
 * Renvoie null si l'utilisateur n'existe pas.
 */
export async function resoudrePlanEffectif(
  prisma: PrismaService,
  idUtilisateur: string,
): Promise<PlanEffectif | null> {
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
      analytics: abonnement.plan.analytics,
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
    analytics: user.plan?.analytics ?? false,
  };
}
