-- CreateTable
CREATE TABLE "page" (
    "id" UUID NOT NULL,
    "id_site" UUID NOT NULL,
    "titre" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "contenu" JSONB NOT NULL DEFAULT '[]',
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "page_id_site_idx" ON "page"("id_site");

-- CreateIndex
CREATE UNIQUE INDEX "page_id_site_slug_key" ON "page"("id_site", "slug");

-- AddForeignKey
ALTER TABLE "page" ADD CONSTRAINT "page_id_site_fkey" FOREIGN KEY ("id_site") REFERENCES "site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
