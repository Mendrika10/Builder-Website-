/*
  Warnings:

  - Made the column `id_page` on table `page_view_daily` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "page_view_daily" ALTER COLUMN "id_page" SET NOT NULL;
