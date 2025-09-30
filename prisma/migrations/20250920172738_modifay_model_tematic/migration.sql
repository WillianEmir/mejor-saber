-- CreateEnum
CREATE TYPE "public"."TipoEjeTematico" AS ENUM ('TEORICO', 'PRACTICO', 'EVALUATIVO');

-- CreateEnum
CREATE TYPE "public"."TipoActividadInteractiva" AS ENUM ('RELACIONAR', 'IDENTIFICAR', 'GRAFICO');

-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'DOCENTE';

-- AlterTable
ALTER TABLE "public"."afirmaciones" ADD COLUMN     "descripcionCorta" TEXT,
ADD COLUMN     "descripcionLarga" TEXT,
ADD COLUMN     "imagen" TEXT;

-- AlterTable
ALTER TABLE "public"."areas" ADD COLUMN     "descripcionCorta" TEXT,
ADD COLUMN     "descripcionLarga" TEXT,
ADD COLUMN     "imagen" TEXT;

-- AlterTable
ALTER TABLE "public"."competencias" ADD COLUMN     "descripcionCorta" TEXT,
ADD COLUMN     "descripcionLarga" TEXT,
ADD COLUMN     "imagen" TEXT;

-- AlterTable
ALTER TABLE "public"."contenidos_curriculares" ADD COLUMN     "descripcionCorta" TEXT,
ADD COLUMN     "descripcionLarga" TEXT,
ADD COLUMN     "imagen" TEXT;

-- AlterTable
ALTER TABLE "public"."ejes_tematicos" ADD COLUMN     "descripcionCorta" TEXT,
ADD COLUMN     "descripcionLarga" TEXT,
ADD COLUMN     "imagen" TEXT,
ADD COLUMN     "orden" INTEGER,
ADD COLUMN     "preguntaTematica" TEXT,
ADD COLUMN     "relevanciaICFES" TEXT,
ADD COLUMN     "tipo" "public"."TipoEjeTematico",
ADD COLUMN     "video" TEXT;

-- AlterTable
ALTER TABLE "public"."evidencias" ADD COLUMN     "descripcionCorta" TEXT,
ADD COLUMN     "descripcionLarga" TEXT,
ADD COLUMN     "imagen" TEXT;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "school_sede_id" TEXT;

-- CreateTable
CREATE TABLE "public"."items_actividad_interactiva" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "match" TEXT NOT NULL,
    "retroalimentacion" TEXT NOT NULL,
    "respuestaCorrecta" BOOLEAN NOT NULL DEFAULT false,
    "imagen" TEXT,
    "actividad_interactiva_id" TEXT NOT NULL,

    CONSTRAINT "items_actividad_interactiva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."actividades_interactivas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "avance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "tipo" "public"."TipoActividadInteractiva" NOT NULL,
    "imagen" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "eje_tematico_id" TEXT NOT NULL,

    CONSTRAINT "actividades_interactivas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sub_temas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "imagen" TEXT,
    "video" TEXT,
    "eje_tematico_id" TEXT NOT NULL,

    CONSTRAINT "sub_temas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."progreso_usuario" (
    "id" TEXT NOT NULL,
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "avance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "usuario_id" TEXT NOT NULL,
    "eje_tematico_id" TEXT,
    "sub_tema_id" TEXT,
    "actividad_interactiva_id" TEXT,

    CONSTRAINT "progreso_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."objetivos_aprendizaje" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "eje_tematico_id" TEXT NOT NULL,

    CONSTRAINT "objetivos_aprendizaje_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "items_actividad_interactiva_actividad_interactiva_id_idx" ON "public"."items_actividad_interactiva"("actividad_interactiva_id");

-- CreateIndex
CREATE INDEX "actividades_interactivas_eje_tematico_id_idx" ON "public"."actividades_interactivas"("eje_tematico_id");

-- CreateIndex
CREATE INDEX "sub_temas_eje_tematico_id_idx" ON "public"."sub_temas"("eje_tematico_id");

-- CreateIndex
CREATE INDEX "progreso_usuario_usuario_id_idx" ON "public"."progreso_usuario"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "progreso_usuario_usuario_id_eje_tematico_id_key" ON "public"."progreso_usuario"("usuario_id", "eje_tematico_id");

-- CreateIndex
CREATE UNIQUE INDEX "progreso_usuario_usuario_id_sub_tema_id_key" ON "public"."progreso_usuario"("usuario_id", "sub_tema_id");

-- CreateIndex
CREATE UNIQUE INDEX "progreso_usuario_usuario_id_actividad_interactiva_id_key" ON "public"."progreso_usuario"("usuario_id", "actividad_interactiva_id");

-- CreateIndex
CREATE INDEX "objetivos_aprendizaje_eje_tematico_id_idx" ON "public"."objetivos_aprendizaje"("eje_tematico_id");

-- CreateIndex
CREATE INDEX "contenidos_curriculares_area_id_idx" ON "public"."contenidos_curriculares"("area_id");

-- CreateIndex
CREATE INDEX "school_sedes_school_id_idx" ON "public"."school_sedes"("school_id");

-- CreateIndex
CREATE INDEX "users_school_id_idx" ON "public"."users"("school_id");

-- CreateIndex
CREATE INDEX "users_school_sede_id_idx" ON "public"."users"("school_sede_id");

-- AddForeignKey
ALTER TABLE "public"."items_actividad_interactiva" ADD CONSTRAINT "items_actividad_interactiva_actividad_interactiva_id_fkey" FOREIGN KEY ("actividad_interactiva_id") REFERENCES "public"."actividades_interactivas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."actividades_interactivas" ADD CONSTRAINT "actividades_interactivas_eje_tematico_id_fkey" FOREIGN KEY ("eje_tematico_id") REFERENCES "public"."ejes_tematicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sub_temas" ADD CONSTRAINT "sub_temas_eje_tematico_id_fkey" FOREIGN KEY ("eje_tematico_id") REFERENCES "public"."ejes_tematicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."progreso_usuario" ADD CONSTRAINT "progreso_usuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."progreso_usuario" ADD CONSTRAINT "progreso_usuario_eje_tematico_id_fkey" FOREIGN KEY ("eje_tematico_id") REFERENCES "public"."ejes_tematicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."progreso_usuario" ADD CONSTRAINT "progreso_usuario_sub_tema_id_fkey" FOREIGN KEY ("sub_tema_id") REFERENCES "public"."sub_temas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."progreso_usuario" ADD CONSTRAINT "progreso_usuario_actividad_interactiva_id_fkey" FOREIGN KEY ("actividad_interactiva_id") REFERENCES "public"."actividades_interactivas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."objetivos_aprendizaje" ADD CONSTRAINT "objetivos_aprendizaje_eje_tematico_id_fkey" FOREIGN KEY ("eje_tematico_id") REFERENCES "public"."ejes_tematicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_school_sede_id_fkey" FOREIGN KEY ("school_sede_id") REFERENCES "public"."school_sedes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
