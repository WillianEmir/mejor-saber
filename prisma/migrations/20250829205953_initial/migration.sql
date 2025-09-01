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
CREATE TABLE "public"."opciones_pregunta" (
    "id" TEXT NOT NULL,
    "respuesta" TEXT NOT NULL,
    "correcta" BOOLEAN NOT NULL,
    "retroalimentacion" TEXT,
    "pregunta_id" TEXT NOT NULL,

    CONSTRAINT "opciones_pregunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."preguntas" (
    "id" TEXT NOT NULL,
    "contexto" TEXT NOT NULL,
    "imagen" TEXT,
    "enunciado" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
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

-- CreateTable
CREATE TABLE "public"."_ContenidoCurricularPreguntas" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ContenidoCurricularPreguntas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "contenidos_curriculares_area_id_idx" ON "public"."contenidos_curriculares"("area_id");

-- CreateIndex
CREATE UNIQUE INDEX "contenidos_curriculares_area_id_nombre_key" ON "public"."contenidos_curriculares"("area_id", "nombre");

-- CreateIndex
CREATE INDEX "opciones_pregunta_pregunta_id_idx" ON "public"."opciones_pregunta"("pregunta_id");

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

-- CreateIndex
CREATE INDEX "_ContenidoCurricularPreguntas_B_index" ON "public"."_ContenidoCurricularPreguntas"("B");

-- AddForeignKey
ALTER TABLE "public"."contenidos_curriculares" ADD CONSTRAINT "contenidos_curriculares_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."opciones_pregunta" ADD CONSTRAINT "opciones_pregunta_pregunta_id_fkey" FOREIGN KEY ("pregunta_id") REFERENCES "public"."preguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."preguntas" ADD CONSTRAINT "preguntas_evidencia_id_fkey" FOREIGN KEY ("evidencia_id") REFERENCES "public"."evidencias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."competencias" ADD CONSTRAINT "competencias_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."afirmaciones" ADD CONSTRAINT "afirmaciones_competencia_id_fkey" FOREIGN KEY ("competencia_id") REFERENCES "public"."competencias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."evidencias" ADD CONSTRAINT "evidencias_afirmacion_id_fkey" FOREIGN KEY ("afirmacion_id") REFERENCES "public"."afirmaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ContenidoCurricularPreguntas" ADD CONSTRAINT "_ContenidoCurricularPreguntas_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."contenidos_curriculares"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ContenidoCurricularPreguntas" ADD CONSTRAINT "_ContenidoCurricularPreguntas_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."preguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
