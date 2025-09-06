-- CreateTable
CREATE TABLE "public"."ejetematicos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "contenido_curricular_id" TEXT NOT NULL,

    CONSTRAINT "ejetematicos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ejetematicos_contenido_curricular_id_idx" ON "public"."ejetematicos"("contenido_curricular_id");

-- CreateIndex
CREATE UNIQUE INDEX "ejetematicos_contenido_curricular_id_nombre_key" ON "public"."ejetematicos"("contenido_curricular_id", "nombre");

-- AddForeignKey
ALTER TABLE "public"."ejetematicos" ADD CONSTRAINT "ejetematicos_contenido_curricular_id_fkey" FOREIGN KEY ("contenido_curricular_id") REFERENCES "public"."contenidos_curriculares"("id") ON DELETE CASCADE ON UPDATE CASCADE;
