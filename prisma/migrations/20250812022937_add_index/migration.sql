-- CreateIndex
CREATE INDEX "Afirmacion_competenciaId_idx" ON "public"."Afirmacion"("competenciaId");

-- CreateIndex
CREATE INDEX "Competencia_areaId_idx" ON "public"."Competencia"("areaId");

-- CreateIndex
CREATE INDEX "Evidencia_afirmacionId_idx" ON "public"."Evidencia"("afirmacionId");
