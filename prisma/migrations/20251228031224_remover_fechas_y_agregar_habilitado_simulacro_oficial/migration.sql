/*
  Warnings:

  - You are about to drop the column `fechaFin` on the `simulacros_oficiales` table. All the data in the column will be lost.
  - You are about to drop the column `fechaInicio` on the `simulacros_oficiales` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "simulacros_oficiales" DROP COLUMN "fechaFin",
DROP COLUMN "fechaInicio",
ADD COLUMN     "habilitado" BOOLEAN NOT NULL DEFAULT false;
