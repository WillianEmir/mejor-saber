/*
  Warnings:

  - You are about to drop the column `englishFlag` on the `preguntas` table. All the data in the column will be lost.
  - You are about to drop the column `date_is_actived` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isActived` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `school` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `ejetematicos` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."_EjeTematicoPreguntas" DROP CONSTRAINT "_EjeTematicoPreguntas_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."ejetematicos" DROP CONSTRAINT "ejetematicos_contenido_curricular_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."preguntas" DROP CONSTRAINT "preguntas_evidencia_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."simulacro_preguntas" DROP CONSTRAINT "simulacro_preguntas_pregunta_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."simulacros" DROP CONSTRAINT "simulacros_competencia_id_fkey";

-- AlterTable
ALTER TABLE "public"."preguntas" DROP COLUMN "englishFlag",
ADD COLUMN     "groupFlag" TEXT;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "date_is_actived",
DROP COLUMN "isActived",
DROP COLUMN "name",
DROP COLUMN "school",
ADD COLUMN     "activation_date" TIMESTAMP(3),
ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "degree" TEXT,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "idDocument" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "school_id" TEXT,
ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "public"."ejetematicos";

-- CreateTable
CREATE TABLE "public"."ejes_tematicos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "contenido_curricular_id" TEXT NOT NULL,

    CONSTRAINT "ejes_tematicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."schools" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT,
    "DANE" TEXT NOT NULL,
    "address" TEXT,
    "department" TEXT,
    "city" TEXT,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."school_sedes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "DANE" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,

    CONSTRAINT "school_sedes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ejes_tematicos_contenido_curricular_id_idx" ON "public"."ejes_tematicos"("contenido_curricular_id");

-- CreateIndex
CREATE UNIQUE INDEX "ejes_tematicos_contenido_curricular_id_nombre_key" ON "public"."ejes_tematicos"("contenido_curricular_id", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "schools_email_key" ON "public"."schools"("email");

-- CreateIndex
CREATE UNIQUE INDEX "schools_DANE_key" ON "public"."schools"("DANE");

-- CreateIndex
CREATE UNIQUE INDEX "school_sedes_DANE_key" ON "public"."school_sedes"("DANE");

-- AddForeignKey
ALTER TABLE "public"."ejes_tematicos" ADD CONSTRAINT "ejes_tematicos_contenido_curricular_id_fkey" FOREIGN KEY ("contenido_curricular_id") REFERENCES "public"."contenidos_curriculares"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."preguntas" ADD CONSTRAINT "preguntas_evidencia_id_fkey" FOREIGN KEY ("evidencia_id") REFERENCES "public"."evidencias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."school_sedes" ADD CONSTRAINT "school_sedes_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."simulacros" ADD CONSTRAINT "simulacros_competencia_id_fkey" FOREIGN KEY ("competencia_id") REFERENCES "public"."competencias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."simulacro_preguntas" ADD CONSTRAINT "simulacro_preguntas_pregunta_id_fkey" FOREIGN KEY ("pregunta_id") REFERENCES "public"."preguntas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EjeTematicoPreguntas" ADD CONSTRAINT "_EjeTematicoPreguntas_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."ejes_tematicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
