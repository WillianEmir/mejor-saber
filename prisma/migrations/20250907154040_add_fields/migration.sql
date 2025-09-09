/*
  Warnings:

  - You are about to drop the column `area_id` on the `simulacros` table. All the data in the column will be lost.
  - You are about to drop the column `completed` on the `simulacros` table. All the data in the column will be lost.
  - Added the required column `competencia_id` to the `simulacros` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."simulacro_preguntas" DROP CONSTRAINT "simulacro_preguntas_pregunta_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."simulacros" DROP CONSTRAINT "simulacros_area_id_fkey";

-- DropIndex
DROP INDEX "public"."contenidos_curriculares_area_id_idx";

-- DropIndex
DROP INDEX "public"."contenidos_curriculares_area_id_nombre_key";

-- DropIndex
DROP INDEX "public"."simulacros_area_id_idx";

-- AlterTable
ALTER TABLE "public"."simulacros" DROP COLUMN "area_id",
DROP COLUMN "completed",
ADD COLUMN     "competencia_id" TEXT NOT NULL,
ADD COLUMN     "duracionMinutos" INTEGER;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "school" TEXT;

-- CreateIndex
CREATE INDEX "simulacro_preguntas_opcion_seleccionada_id_idx" ON "public"."simulacro_preguntas"("opcion_seleccionada_id");

-- CreateIndex
CREATE INDEX "simulacros_competencia_id_idx" ON "public"."simulacros"("competencia_id");

-- AddForeignKey
ALTER TABLE "public"."simulacros" ADD CONSTRAINT "simulacros_competencia_id_fkey" FOREIGN KEY ("competencia_id") REFERENCES "public"."competencias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."simulacro_preguntas" ADD CONSTRAINT "simulacro_preguntas_pregunta_id_fkey" FOREIGN KEY ("pregunta_id") REFERENCES "public"."preguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
