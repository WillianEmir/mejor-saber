-- AlterTable
ALTER TABLE "public"."actividades_interactivas" ALTER COLUMN "match" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."progresos_actividad" ALTER COLUMN "completado" DROP DEFAULT,
ALTER COLUMN "intentos" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."progresos_seccion" ALTER COLUMN "completada" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."progresos_sub_tema" ALTER COLUMN "completado" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."sub_temas" ADD COLUMN     "ejemplo" TEXT;
