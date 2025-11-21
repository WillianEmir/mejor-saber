/*
  Warnings:

  - You are about to drop the column `duration_in_days` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "duration_in_days",
ADD COLUMN     "durationInDays" INTEGER NOT NULL DEFAULT 365;

-- CreateTable
CREATE TABLE "product_characteristics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "product_characteristics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_characteristics_product_id_idx" ON "product_characteristics"("product_id");

-- AddForeignKey
ALTER TABLE "product_characteristics" ADD CONSTRAINT "product_characteristics_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
