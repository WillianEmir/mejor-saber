-- CreateEnum
CREATE TYPE "public"."Rol" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."PlanName" AS ENUM ('FREE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "isActived" BOOLEAN NOT NULL DEFAULT false,
    "avatar" TEXT,
    "phone" TEXT,
    "date_is_actived" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "rol" "public"."Rol" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."simulacros" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "area_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "simulacros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."simulacro_preguntas" (
    "id" TEXT NOT NULL,
    "simulacro_id" TEXT NOT NULL,
    "pregunta_id" TEXT NOT NULL,
    "opcion_seleccionada_id" TEXT,
    "correcta" BOOLEAN,

    CONSTRAINT "simulacro_preguntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."planes" (
    "id" TEXT NOT NULL,
    "name" "public"."PlanName" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "duration_in_days" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "planes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "public"."SubscriptionStatus" NOT NULL,

    CONSTRAINT "user_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" TEXT NOT NULL,
    "user_subscription_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL,
    "payment_gateway_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "simulacros_user_id_idx" ON "public"."simulacros"("user_id");

-- CreateIndex
CREATE INDEX "simulacros_area_id_idx" ON "public"."simulacros"("area_id");

-- CreateIndex
CREATE INDEX "simulacro_preguntas_simulacro_id_idx" ON "public"."simulacro_preguntas"("simulacro_id");

-- CreateIndex
CREATE INDEX "simulacro_preguntas_pregunta_id_idx" ON "public"."simulacro_preguntas"("pregunta_id");

-- CreateIndex
CREATE UNIQUE INDEX "simulacro_preguntas_simulacro_id_pregunta_id_key" ON "public"."simulacro_preguntas"("simulacro_id", "pregunta_id");

-- CreateIndex
CREATE UNIQUE INDEX "planes_name_key" ON "public"."planes"("name");

-- CreateIndex
CREATE INDEX "user_subscriptions_user_id_idx" ON "public"."user_subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "user_subscriptions_plan_id_idx" ON "public"."user_subscriptions"("plan_id");

-- CreateIndex
CREATE INDEX "payments_user_subscription_id_idx" ON "public"."payments"("user_subscription_id");

-- AddForeignKey
ALTER TABLE "public"."simulacros" ADD CONSTRAINT "simulacros_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."simulacros" ADD CONSTRAINT "simulacros_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."simulacro_preguntas" ADD CONSTRAINT "simulacro_preguntas_simulacro_id_fkey" FOREIGN KEY ("simulacro_id") REFERENCES "public"."simulacros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."simulacro_preguntas" ADD CONSTRAINT "simulacro_preguntas_pregunta_id_fkey" FOREIGN KEY ("pregunta_id") REFERENCES "public"."preguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."simulacro_preguntas" ADD CONSTRAINT "simulacro_preguntas_opcion_seleccionada_id_fkey" FOREIGN KEY ("opcion_seleccionada_id") REFERENCES "public"."opciones_pregunta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_subscriptions" ADD CONSTRAINT "user_subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."planes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_user_subscription_id_fkey" FOREIGN KEY ("user_subscription_id") REFERENCES "public"."user_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
