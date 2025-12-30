-- AlterTable
ALTER TABLE "simulacros" ADD COLUMN     "simulacroOficialId" TEXT;

-- CreateTable
CREATE TABLE "simulacros_oficiales" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "schoolId" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,

    CONSTRAINT "simulacros_oficiales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "simulacros_oficiales_schoolId_idx" ON "simulacros_oficiales"("schoolId");

-- CreateIndex
CREATE INDEX "simulacros_oficiales_areaId_idx" ON "simulacros_oficiales"("areaId");

-- CreateIndex
CREATE INDEX "simulacros_simulacroOficialId_idx" ON "simulacros"("simulacroOficialId");

-- AddForeignKey
ALTER TABLE "simulacros" ADD CONSTRAINT "simulacros_simulacroOficialId_fkey" FOREIGN KEY ("simulacroOficialId") REFERENCES "simulacros_oficiales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulacros_oficiales" ADD CONSTRAINT "simulacros_oficiales_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulacros_oficiales" ADD CONSTRAINT "simulacros_oficiales_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
