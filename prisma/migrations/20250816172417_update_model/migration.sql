/*
  Warnings:

  - You are about to drop the `Afirmacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Area` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Competencia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Evidencia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pregunta` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Afirmacion" DROP CONSTRAINT "Afirmacion_competenciaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Competencia" DROP CONSTRAINT "Competencia_areaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Evidencia" DROP CONSTRAINT "Evidencia_afirmacionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Pregunta" DROP CONSTRAINT "Pregunta_evidenciaId_fkey";

-- DropTable
DROP TABLE "public"."Afirmacion";

-- DropTable
DROP TABLE "public"."Area";

-- DropTable
DROP TABLE "public"."Competencia";

-- DropTable
DROP TABLE "public"."Evidencia";

-- DropTable
DROP TABLE "public"."Pregunta";

-- CreateTable
CREATE TABLE "public"."contenidos_curriculares" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "area_id" TEXT NOT NULL,

    CONSTRAINT "contenidos_curriculares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."preguntas" (
    "id" TEXT NOT NULL,
    "contexto" TEXT NOT NULL,
    "imagen" TEXT,
    "enunciado" TEXT NOT NULL,
    "opciones" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "contenido_curricular_id" TEXT NOT NULL,
    "evidencia_id" TEXT NOT NULL,

    CONSTRAINT "preguntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."areas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."competencias" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "area_id" TEXT NOT NULL,

    CONSTRAINT "competencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."afirmaciones" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "competencia_id" TEXT NOT NULL,

    CONSTRAINT "afirmaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."evidencias" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "afirmacion_id" TEXT NOT NULL,

    CONSTRAINT "evidencias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contenidos_curriculares_area_id_idx" ON "public"."contenidos_curriculares"("area_id");

-- CreateIndex
CREATE UNIQUE INDEX "contenidos_curriculares_area_id_nombre_key" ON "public"."contenidos_curriculares"("area_id", "nombre");

-- CreateIndex
CREATE INDEX "preguntas_contenido_curricular_id_idx" ON "public"."preguntas"("contenido_curricular_id");

-- CreateIndex
CREATE INDEX "preguntas_evidencia_id_idx" ON "public"."preguntas"("evidencia_id");

-- CreateIndex
CREATE UNIQUE INDEX "areas_nombre_key" ON "public"."areas"("nombre");

-- CreateIndex
CREATE INDEX "competencias_area_id_idx" ON "public"."competencias"("area_id");

-- CreateIndex
CREATE UNIQUE INDEX "competencias_area_id_nombre_key" ON "public"."competencias"("area_id", "nombre");

-- CreateIndex
CREATE INDEX "afirmaciones_competencia_id_idx" ON "public"."afirmaciones"("competencia_id");

-- CreateIndex
CREATE UNIQUE INDEX "afirmaciones_competencia_id_nombre_key" ON "public"."afirmaciones"("competencia_id", "nombre");

-- CreateIndex
CREATE INDEX "evidencias_afirmacion_id_idx" ON "public"."evidencias"("afirmacion_id");

-- CreateIndex
CREATE UNIQUE INDEX "evidencias_afirmacion_id_nombre_key" ON "public"."evidencias"("afirmacion_id", "nombre");

-- AddForeignKey
ALTER TABLE "public"."contenidos_curriculares" ADD CONSTRAINT "contenidos_curriculares_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."preguntas" ADD CONSTRAINT "preguntas_contenido_curricular_id_fkey" FOREIGN KEY ("contenido_curricular_id") REFERENCES "public"."contenidos_curriculares"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."preguntas" ADD CONSTRAINT "preguntas_evidencia_id_fkey" FOREIGN KEY ("evidencia_id") REFERENCES "public"."evidencias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."competencias" ADD CONSTRAINT "competencias_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."afirmaciones" ADD CONSTRAINT "afirmaciones_competencia_id_fkey" FOREIGN KEY ("competencia_id") REFERENCES "public"."competencias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."evidencias" ADD CONSTRAINT "evidencias_afirmacion_id_fkey" FOREIGN KEY ("afirmacion_id") REFERENCES "public"."afirmaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
