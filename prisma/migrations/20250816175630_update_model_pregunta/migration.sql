/*
  Warnings:

  - The `contenido_curricular_id` column on the `preguntas` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "public"."preguntas" DROP CONSTRAINT "preguntas_contenido_curricular_id_fkey";

-- AlterTable
ALTER TABLE "public"."preguntas" DROP COLUMN "contenido_curricular_id",
ADD COLUMN     "contenido_curricular_id" TEXT[];

-- CreateIndex
CREATE INDEX "preguntas_contenido_curricular_id_idx" ON "public"."preguntas"("contenido_curricular_id");

-- AddForeignKey
ALTER TABLE "public"."preguntas" ADD CONSTRAINT "preguntas_contenido_curricular_id_fkey" FOREIGN KEY ("contenido_curricular_id") REFERENCES "public"."contenidos_curriculares"("id") ON DELETE CASCADE ON UPDATE CASCADE;
