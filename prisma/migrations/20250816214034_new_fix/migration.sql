/*
  Warnings:

  - You are about to drop the column `contenido_curricular_id` on the `preguntas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."preguntas" DROP CONSTRAINT "preguntas_contenido_curricular_id_fkey";

-- DropIndex
DROP INDEX "public"."preguntas_contenido_curricular_id_idx";

-- AlterTable
ALTER TABLE "public"."preguntas" DROP COLUMN "contenido_curricular_id";

-- CreateTable
CREATE TABLE "public"."_ContenidoCurricularPreguntas" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ContenidoCurricularPreguntas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ContenidoCurricularPreguntas_B_index" ON "public"."_ContenidoCurricularPreguntas"("B");

-- AddForeignKey
ALTER TABLE "public"."_ContenidoCurricularPreguntas" ADD CONSTRAINT "_ContenidoCurricularPreguntas_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."contenidos_curriculares"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ContenidoCurricularPreguntas" ADD CONSTRAINT "_ContenidoCurricularPreguntas_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."preguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
