-- CreateTable
CREATE TABLE "public"."testimonios" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "testimonios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "testimonios_user_id_idx" ON "public"."testimonios"("user_id");

-- AddForeignKey
ALTER TABLE "public"."testimonios" ADD CONSTRAINT "testimonios_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
