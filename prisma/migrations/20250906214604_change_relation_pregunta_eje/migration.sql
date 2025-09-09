/*
  Warnings:

  - You are about to drop the `_ContenidoCurricularPreguntas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_ContenidoCurricularPreguntas" DROP CONSTRAINT "_ContenidoCurricularPreguntas_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ContenidoCurricularPreguntas" DROP CONSTRAINT "_ContenidoCurricularPreguntas_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."simulacro_preguntas" DROP CONSTRAINT "simulacro_preguntas_pregunta_id_fkey";

-- DropTable
DROP TABLE "public"."_ContenidoCurricularPreguntas";

-- CreateTable
CREATE TABLE "public"."_EjeTematicoPreguntas" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EjeTematicoPreguntas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EjeTematicoPreguntas_B_index" ON "public"."_EjeTematicoPreguntas"("B");

-- AddForeignKey
ALTER TABLE "public"."simulacro_preguntas" ADD CONSTRAINT "simulacro_preguntas_pregunta_id_fkey" FOREIGN KEY ("pregunta_id") REFERENCES "public"."preguntas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EjeTematicoPreguntas" ADD CONSTRAINT "_EjeTematicoPreguntas_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."ejetematicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EjeTematicoPreguntas" ADD CONSTRAINT "_EjeTematicoPreguntas_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."preguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
