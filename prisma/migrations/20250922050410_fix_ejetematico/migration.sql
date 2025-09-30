/*
  Warnings:

  - You are about to drop the column `avance` on the `actividades_interactivas` table. All the data in the column will be lost.
  - You are about to drop the column `completado` on the `actividades_interactivas` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `actividades_interactivas` table. All the data in the column will be lost.
  - You are about to drop the column `eje_tematico_id` on the `actividades_interactivas` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `ejes_tematicos` table. All the data in the column will be lost.
  - You are about to drop the column `completado` on the `sub_temas` table. All the data in the column will be lost.
  - You are about to drop the column `eje_tematico_id` on the `sub_temas` table. All the data in the column will be lost.
  - You are about to drop the `items_actividad_interactiva` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `progreso_usuario` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `match` to the `actividades_interactivas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `retroalimentacion` to the `actividades_interactivas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seccion_id` to the `actividades_interactivas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seccion_id` to the `sub_temas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `sub_temas` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TipoSeccion" AS ENUM ('TEORIA', 'INTERACTIVA');

-- DropForeignKey
ALTER TABLE "public"."actividades_interactivas" DROP CONSTRAINT "actividades_interactivas_eje_tematico_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."items_actividad_interactiva" DROP CONSTRAINT "items_actividad_interactiva_actividad_interactiva_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."progreso_usuario" DROP CONSTRAINT "progreso_usuario_actividad_interactiva_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."progreso_usuario" DROP CONSTRAINT "progreso_usuario_eje_tematico_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."progreso_usuario" DROP CONSTRAINT "progreso_usuario_sub_tema_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."progreso_usuario" DROP CONSTRAINT "progreso_usuario_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."sub_temas" DROP CONSTRAINT "sub_temas_eje_tematico_id_fkey";

-- DropIndex
DROP INDEX "public"."actividades_interactivas_eje_tematico_id_idx";

-- DropIndex
DROP INDEX "public"."sub_temas_eje_tematico_id_idx";

-- AlterTable
ALTER TABLE "public"."actividades_interactivas" DROP COLUMN "avance",
DROP COLUMN "completado",
DROP COLUMN "descripcion",
DROP COLUMN "eje_tematico_id",
ADD COLUMN     "match" JSONB NOT NULL,
ADD COLUMN     "retroalimentacion" TEXT NOT NULL,
ADD COLUMN     "seccion_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."ejes_tematicos" DROP COLUMN "tipo";

-- AlterTable
ALTER TABLE "public"."sub_temas" DROP COLUMN "completado",
DROP COLUMN "eje_tematico_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "seccion_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."items_actividad_interactiva";

-- DropTable
DROP TABLE "public"."progreso_usuario";

-- DropEnum
DROP TYPE "public"."TipoEjeTematico";

-- CreateTable
CREATE TABLE "public"."secciones" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "orden" INTEGER,
    "tipo" "public"."TipoSeccion" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "eje_tematico_id" TEXT NOT NULL,

    CONSTRAINT "secciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."progresos_seccion" (
    "id" TEXT NOT NULL,
    "avance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completada" BOOLEAN NOT NULL DEFAULT false,
    "usuario_id" TEXT NOT NULL,
    "seccion_id" TEXT NOT NULL,

    CONSTRAINT "progresos_seccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."progresos_sub_tema" (
    "id" TEXT NOT NULL,
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "usuario_id" TEXT NOT NULL,
    "sub_tema_id" TEXT NOT NULL,

    CONSTRAINT "progresos_sub_tema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."progresos_actividad" (
    "id" TEXT NOT NULL,
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "intentos" INTEGER NOT NULL DEFAULT 0,
    "usuario_id" TEXT NOT NULL,
    "actividad_id" TEXT NOT NULL,

    CONSTRAINT "progresos_actividad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "secciones_eje_tematico_id_idx" ON "public"."secciones"("eje_tematico_id");

-- CreateIndex
CREATE INDEX "progresos_seccion_usuario_id_idx" ON "public"."progresos_seccion"("usuario_id");

-- CreateIndex
CREATE INDEX "progresos_seccion_seccion_id_idx" ON "public"."progresos_seccion"("seccion_id");

-- CreateIndex
CREATE UNIQUE INDEX "progresos_seccion_usuario_id_seccion_id_key" ON "public"."progresos_seccion"("usuario_id", "seccion_id");

-- CreateIndex
CREATE INDEX "progresos_sub_tema_usuario_id_idx" ON "public"."progresos_sub_tema"("usuario_id");

-- CreateIndex
CREATE INDEX "progresos_sub_tema_sub_tema_id_idx" ON "public"."progresos_sub_tema"("sub_tema_id");

-- CreateIndex
CREATE UNIQUE INDEX "progresos_sub_tema_usuario_id_sub_tema_id_key" ON "public"."progresos_sub_tema"("usuario_id", "sub_tema_id");

-- CreateIndex
CREATE INDEX "progresos_actividad_usuario_id_idx" ON "public"."progresos_actividad"("usuario_id");

-- CreateIndex
CREATE INDEX "progresos_actividad_actividad_id_idx" ON "public"."progresos_actividad"("actividad_id");

-- CreateIndex
CREATE UNIQUE INDEX "progresos_actividad_usuario_id_actividad_id_key" ON "public"."progresos_actividad"("usuario_id", "actividad_id");

-- CreateIndex
CREATE INDEX "actividades_interactivas_seccion_id_idx" ON "public"."actividades_interactivas"("seccion_id");

-- CreateIndex
CREATE INDEX "sub_temas_seccion_id_idx" ON "public"."sub_temas"("seccion_id");

-- AddForeignKey
ALTER TABLE "public"."secciones" ADD CONSTRAINT "secciones_eje_tematico_id_fkey" FOREIGN KEY ("eje_tematico_id") REFERENCES "public"."ejes_tematicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sub_temas" ADD CONSTRAINT "sub_temas_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "public"."secciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."actividades_interactivas" ADD CONSTRAINT "actividades_interactivas_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "public"."secciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."progresos_seccion" ADD CONSTRAINT "progresos_seccion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."progresos_seccion" ADD CONSTRAINT "progresos_seccion_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "public"."secciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."progresos_sub_tema" ADD CONSTRAINT "progresos_sub_tema_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."progresos_sub_tema" ADD CONSTRAINT "progresos_sub_tema_sub_tema_id_fkey" FOREIGN KEY ("sub_tema_id") REFERENCES "public"."sub_temas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."progresos_actividad" ADD CONSTRAINT "progresos_actividad_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."progresos_actividad" ADD CONSTRAINT "progresos_actividad_actividad_id_fkey" FOREIGN KEY ("actividad_id") REFERENCES "public"."actividades_interactivas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
