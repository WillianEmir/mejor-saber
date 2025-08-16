/*
  Warnings:

  - You are about to drop the column `areaId` on the `Pregunta` table. All the data in the column will be lost.
  - You are about to drop the column `explicacionOpciones` on the `Pregunta` table. All the data in the column will be lost.
  - Added the required column `evidenciaId` to the `Pregunta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Pregunta" DROP CONSTRAINT "Pregunta_areaId_fkey";

-- DropIndex
DROP INDEX "public"."Pregunta_areaId_idx";

-- AlterTable
ALTER TABLE "public"."Pregunta" DROP COLUMN "areaId",
DROP COLUMN "explicacionOpciones",
ADD COLUMN     "evidenciaId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Pregunta_evidenciaId_idx" ON "public"."Pregunta"("evidenciaId");

-- AddForeignKey
ALTER TABLE "public"."Pregunta" ADD CONSTRAINT "Pregunta_evidenciaId_fkey" FOREIGN KEY ("evidenciaId") REFERENCES "public"."Evidencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
