-- CreateTable
CREATE TABLE "public"."Pregunta" (
    "id" TEXT NOT NULL,
    "contexto" TEXT NOT NULL,
    "imagen" TEXT,
    "enunciado" TEXT NOT NULL,
    "opciones" JSONB NOT NULL,
    "explicacionOpciones" JSONB NOT NULL,
    "campoEvalua" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,

    CONSTRAINT "Pregunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Area" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Competencia" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,

    CONSTRAINT "Competencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Afirmacion" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "competenciaId" TEXT NOT NULL,

    CONSTRAINT "Afirmacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Evidencia" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "afirmacionId" TEXT NOT NULL,

    CONSTRAINT "Evidencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Pregunta_areaId_idx" ON "public"."Pregunta"("areaId");

-- AddForeignKey
ALTER TABLE "public"."Pregunta" ADD CONSTRAINT "Pregunta_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "public"."Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Competencia" ADD CONSTRAINT "Competencia_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "public"."Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Afirmacion" ADD CONSTRAINT "Afirmacion_competenciaId_fkey" FOREIGN KEY ("competenciaId") REFERENCES "public"."Competencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evidencia" ADD CONSTRAINT "Evidencia_afirmacionId_fkey" FOREIGN KEY ("afirmacionId") REFERENCES "public"."Afirmacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
