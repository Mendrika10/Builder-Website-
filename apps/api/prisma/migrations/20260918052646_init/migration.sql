-- CreateEnum
CREATE TYPE "Role" AS ENUM ('client', 'admin', 'support');

-- CreateEnum
CREATE TYPE "SupportNiveau" AS ENUM ('email', 'chat', 'prioritaire');

-- CreateEnum
CREATE TYPE "StatutAbonnement" AS ENUM ('essai', 'actif', 'suspendu', 'annule', 'expire');

-- CreateEnum
CREATE TYPE "Periodicite" AS ENUM ('mensuel', 'annuel');

-- CreateEnum
CREATE TYPE "StatutSite" AS ENUM ('brouillon', 'publie', 'suspendu', 'archive');

-- CreateTable
CREATE TABLE "plan" (
    "id" UUID NOT NULL,
    "nom" VARCHAR(50) NOT NULL,
    "prix_mensuel" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "prix_annuel" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "max_sites" SMALLINT NOT NULL DEFAULT 1,
    "max_pages" SMALLINT NOT NULL DEFAULT 5,
    "stockage_go" SMALLINT NOT NULL DEFAULT 1,
    "domaine_perso" BOOLEAN NOT NULL DEFAULT false,
    "ssl_inclus" BOOLEAN NOT NULL DEFAULT false,
    "analytics" BOOLEAN NOT NULL DEFAULT false,
    "remove_branding" BOOLEAN NOT NULL DEFAULT false,
    "support_niveau" "SupportNiveau" NOT NULL DEFAULT 'email',
    "est_actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "id_plan" UUID,
    "nom" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'client',
    "langue" VARCHAR(10) NOT NULL DEFAULT 'fr',
    "email_verifie" BOOLEAN NOT NULL DEFAULT false,
    "email_verifie_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verification" (
    "id" UUID NOT NULL,
    "id_utilisateur" UUID NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_validated" BOOLEAN NOT NULL DEFAULT false,
    "count_attempts" INTEGER NOT NULL DEFAULT 0,
    "code_blocked" BOOLEAN NOT NULL DEFAULT false,
    "blocked_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" UUID NOT NULL,
    "id_utilisateur" UUID NOT NULL,
    "id_plan" UUID NOT NULL,
    "statut" "StatutAbonnement" NOT NULL DEFAULT 'actif',
    "stripe_sub_id" VARCHAR(100),
    "date_debut" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_fin" DATE,
    "periodicite" "Periodicite" NOT NULL DEFAULT 'mensuel',
    "renouvellement_auto" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site" (
    "id" UUID NOT NULL,
    "id_utilisateur" UUID NOT NULL,
    "nom" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "domaine_perso" VARCHAR(253),
    "ssl_actif" BOOLEAN NOT NULL DEFAULT false,
    "statut" "StatutSite" NOT NULL DEFAULT 'brouillon',
    "langue_defaut" VARCHAR(10) NOT NULL DEFAULT 'fr',
    "meta_seo" JSONB NOT NULL DEFAULT '{}',
    "parametres" JSONB NOT NULL DEFAULT '{}',
    "date_publication" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plan_nom_key" ON "plan"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_id_plan_idx" ON "user"("id_plan");

-- CreateIndex
CREATE INDEX "email_verification_id_utilisateur_idx" ON "email_verification"("id_utilisateur");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_stripe_sub_id_key" ON "subscription"("stripe_sub_id");

-- CreateIndex
CREATE INDEX "subscription_id_utilisateur_idx" ON "subscription"("id_utilisateur");

-- CreateIndex
CREATE INDEX "subscription_id_plan_idx" ON "subscription"("id_plan");

-- CreateIndex
CREATE INDEX "subscription_statut_idx" ON "subscription"("statut");

-- CreateIndex
CREATE INDEX "subscription_date_fin_idx" ON "subscription"("date_fin");

-- CreateIndex
CREATE UNIQUE INDEX "site_slug_key" ON "site"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "site_domaine_perso_key" ON "site"("domaine_perso");

-- CreateIndex
CREATE INDEX "site_id_utilisateur_idx" ON "site"("id_utilisateur");

-- CreateIndex
CREATE INDEX "site_statut_idx" ON "site"("statut");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_id_plan_fkey" FOREIGN KEY ("id_plan") REFERENCES "plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verification" ADD CONSTRAINT "email_verification_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_id_plan_fkey" FOREIGN KEY ("id_plan") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site" ADD CONSTRAINT "site_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
