-- CreateEnum
CREATE TYPE "public"."Nivel" AS ENUM ('NIVEL1', 'NIVEL2', 'NIVEL3', 'NIVEL4');

-- CreateTable
CREATE TABLE "public"."niveles_desempeno" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "puntajeMin" INTEGER NOT NULL,
    "puntajeMax" INTEGER NOT NULL,
    "nivel" "public"."Nivel" NOT NULL,
    "area_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "niveles_desempeno_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "niveles_desempeno_area_id_idx" ON "public"."niveles_desempeno"("area_id");

-- AddForeignKey
ALTER TABLE "public"."niveles_desempeno" ADD CONSTRAINT "niveles_desempeno_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
