/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "orders_userId_idx";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "referenciaPago" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "orders_userId_key" ON "orders"("userId");
