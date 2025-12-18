-- AlterTable
ALTER TABLE "simulacros" ADD COLUMN     "area_id" TEXT;

-- CreateIndex
CREATE INDEX "simulacros_area_id_idx" ON "simulacros"("area_id");

-- AddForeignKey
ALTER TABLE "simulacros" ADD CONSTRAINT "simulacros_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
