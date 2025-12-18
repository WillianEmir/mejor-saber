-- DropForeignKey
ALTER TABLE "simulacros" DROP CONSTRAINT "simulacros_competencia_id_fkey";

-- AlterTable
ALTER TABLE "simulacros" ALTER COLUMN "competencia_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "simulacros" ADD CONSTRAINT "simulacros_competencia_id_fkey" FOREIGN KEY ("competencia_id") REFERENCES "competencias"("id") ON DELETE SET NULL ON UPDATE CASCADE;
