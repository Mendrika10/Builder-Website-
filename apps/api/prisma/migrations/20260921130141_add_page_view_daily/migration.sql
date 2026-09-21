-- AlterTable
ALTER TABLE "page" ADD COLUMN     "vues" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "page_view_daily" (
    "id" UUID NOT NULL,
    "id_site" UUID NOT NULL,
    "id_page" UUID,
    "date" DATE NOT NULL,
    "compteur" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "page_view_daily_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "page_view_daily_id_site_date_idx" ON "page_view_daily"("id_site", "date");

-- CreateIndex
CREATE UNIQUE INDEX "page_view_daily_id_site_id_page_date_key" ON "page_view_daily"("id_site", "id_page", "date");

-- AddForeignKey
ALTER TABLE "page_view_daily" ADD CONSTRAINT "page_view_daily_id_site_fkey" FOREIGN KEY ("id_site") REFERENCES "site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_view_daily" ADD CONSTRAINT "page_view_daily_id_page_fkey" FOREIGN KEY ("id_page") REFERENCES "page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
