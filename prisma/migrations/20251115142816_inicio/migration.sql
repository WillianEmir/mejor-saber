-- CreateEnum
CREATE TYPE "TipoSeccion" AS ENUM ('TEORIA', 'INTERACTIVA');

-- CreateEnum
CREATE TYPE "TipoActividadInteractiva" AS ENUM ('RELACIONAR', 'IDENTIFICAR', 'GRAFICO');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ADMINSCHOOL', 'USER', 'DOCENTE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "Nivel" AS ENUM ('NIVEL1', 'NIVEL2', 'NIVEL3', 'NIVEL4');

-- CreateTable
CREATE TABLE "areas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "descripcionCorta" TEXT,
    "descripcionLarga" TEXT,
    "imagen" TEXT,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contenidos_curriculares" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "area_id" TEXT NOT NULL,
    "descripcionCorta" TEXT,
    "descripcionLarga" TEXT,
    "imagen" TEXT,

    CONSTRAINT "contenidos_curriculares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ejes_tematicos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "contenido_curricular_id" TEXT NOT NULL,
    "descripcionCorta" TEXT,
    "descripcionLarga" TEXT,
    "imagen" TEXT,
    "orden" INTEGER,
    "preguntaTematica" TEXT,
    "relevanciaICFES" TEXT,
    "video" TEXT,

    CONSTRAINT "ejes_tematicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secciones" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" "TipoSeccion" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "eje_tematico_id" TEXT NOT NULL,

    CONSTRAINT "secciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_temas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagen" TEXT,
    "video" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seccion_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ejemplo" TEXT,

    CONSTRAINT "sub_temas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actividades_interactivas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoActividadInteractiva" NOT NULL,
    "imagen" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "match" TEXT NOT NULL,
    "retroalimentacion" TEXT NOT NULL,
    "seccion_id" TEXT NOT NULL,

    CONSTRAINT "actividades_interactivas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "objetivos_aprendizaje" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "eje_tematico_id" TEXT NOT NULL,

    CONSTRAINT "objetivos_aprendizaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "niveles_desempeno" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "puntajeMin" INTEGER NOT NULL,
    "puntajeMax" INTEGER NOT NULL,
    "nivel" "Nivel" NOT NULL,
    "area_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "niveles_desempeno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progresos_seccion" (
    "id" TEXT NOT NULL,
    "avance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completada" BOOLEAN NOT NULL,
    "seccion_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,

    CONSTRAINT "progresos_seccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progresos_sub_tema" (
    "id" TEXT NOT NULL,
    "completado" BOOLEAN NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "sub_tema_id" TEXT NOT NULL,

    CONSTRAINT "progresos_sub_tema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progresos_actividad" (
    "id" TEXT NOT NULL,
    "completado" BOOLEAN NOT NULL,
    "intentos" INTEGER NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "actividad_id" TEXT NOT NULL,

    CONSTRAINT "progresos_actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competencias" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "area_id" TEXT NOT NULL,
    "descripcionCorta" TEXT,
    "descripcionLarga" TEXT,
    "imagen" TEXT,

    CONSTRAINT "competencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "afirmaciones" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "competencia_id" TEXT NOT NULL,
    "descripcionCorta" TEXT,
    "descripcionLarga" TEXT,
    "imagen" TEXT,

    CONSTRAINT "afirmaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidencias" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "afirmacion_id" TEXT NOT NULL,
    "descripcionCorta" TEXT,
    "descripcionLarga" TEXT,
    "imagen" TEXT,

    CONSTRAINT "evidencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preguntas" (
    "id" TEXT NOT NULL,
    "contexto" TEXT NOT NULL,
    "imagen" TEXT,
    "enunciado" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "evidencia_id" TEXT NOT NULL,
    "groupFlag" TEXT,

    CONSTRAINT "preguntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opciones_pregunta" (
    "id" TEXT NOT NULL,
    "respuesta" TEXT NOT NULL,
    "correcta" BOOLEAN NOT NULL,
    "retroalimentacion" TEXT,
    "pregunta_id" TEXT NOT NULL,

    CONSTRAINT "opciones_pregunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulacros" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "competencia_id" TEXT NOT NULL,
    "duracionMinutos" INTEGER,

    CONSTRAINT "simulacros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulacro_preguntas" (
    "id" TEXT NOT NULL,
    "simulacro_id" TEXT NOT NULL,
    "pregunta_id" TEXT NOT NULL,
    "opcion_seleccionada_id" TEXT,
    "correcta" BOOLEAN,

    CONSTRAINT "simulacro_preguntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT NOT NULL,
    "lastName" TEXT,
    "image" TEXT,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "activation_date" TIMESTAMP(3),
    "address" TEXT,
    "city" TEXT,
    "degree" TEXT,
    "department" TEXT,
    "idDocument" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "school_id" TEXT,
    "school_sede_id" TEXT,
    "last_login" TIMESTAMP(3),
    "emailVerified" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "two_factor_tokens" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "two_factor_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "two_factor_confirmations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "two_factor_confirmations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schools" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT,
    "DANE" TEXT NOT NULL,
    "address" TEXT,
    "department" TEXT,
    "city" TEXT,
    "maxUsers" INTEGER,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_sedes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "DANE" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,

    CONSTRAINT "school_sedes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonios" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "testimonios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "duration_in_days" INTEGER NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "mercado_pago_payment_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EjeTematicoPreguntas" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EjeTematicoPreguntas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "areas_nombre_key" ON "areas"("nombre");

-- CreateIndex
CREATE INDEX "contenidos_curriculares_area_id_idx" ON "contenidos_curriculares"("area_id");

-- CreateIndex
CREATE INDEX "ejes_tematicos_contenido_curricular_id_idx" ON "ejes_tematicos"("contenido_curricular_id");

-- CreateIndex
CREATE UNIQUE INDEX "ejes_tematicos_contenido_curricular_id_nombre_key" ON "ejes_tematicos"("contenido_curricular_id", "nombre");

-- CreateIndex
CREATE INDEX "secciones_eje_tematico_id_idx" ON "secciones"("eje_tematico_id");

-- CreateIndex
CREATE INDEX "sub_temas_seccion_id_idx" ON "sub_temas"("seccion_id");

-- CreateIndex
CREATE INDEX "actividades_interactivas_seccion_id_idx" ON "actividades_interactivas"("seccion_id");

-- CreateIndex
CREATE INDEX "objetivos_aprendizaje_eje_tematico_id_idx" ON "objetivos_aprendizaje"("eje_tematico_id");

-- CreateIndex
CREATE INDEX "niveles_desempeno_area_id_idx" ON "niveles_desempeno"("area_id");

-- CreateIndex
CREATE INDEX "progresos_seccion_usuario_id_idx" ON "progresos_seccion"("usuario_id");

-- CreateIndex
CREATE INDEX "progresos_seccion_seccion_id_idx" ON "progresos_seccion"("seccion_id");

-- CreateIndex
CREATE UNIQUE INDEX "progresos_seccion_usuario_id_seccion_id_key" ON "progresos_seccion"("usuario_id", "seccion_id");

-- CreateIndex
CREATE INDEX "progresos_sub_tema_usuario_id_idx" ON "progresos_sub_tema"("usuario_id");

-- CreateIndex
CREATE INDEX "progresos_sub_tema_sub_tema_id_idx" ON "progresos_sub_tema"("sub_tema_id");

-- CreateIndex
CREATE UNIQUE INDEX "progresos_sub_tema_usuario_id_sub_tema_id_key" ON "progresos_sub_tema"("usuario_id", "sub_tema_id");

-- CreateIndex
CREATE INDEX "progresos_actividad_usuario_id_idx" ON "progresos_actividad"("usuario_id");

-- CreateIndex
CREATE INDEX "progresos_actividad_actividad_id_idx" ON "progresos_actividad"("actividad_id");

-- CreateIndex
CREATE UNIQUE INDEX "progresos_actividad_usuario_id_actividad_id_key" ON "progresos_actividad"("usuario_id", "actividad_id");

-- CreateIndex
CREATE INDEX "competencias_area_id_idx" ON "competencias"("area_id");

-- CreateIndex
CREATE UNIQUE INDEX "competencias_area_id_nombre_key" ON "competencias"("area_id", "nombre");

-- CreateIndex
CREATE INDEX "afirmaciones_competencia_id_idx" ON "afirmaciones"("competencia_id");

-- CreateIndex
CREATE UNIQUE INDEX "afirmaciones_competencia_id_nombre_key" ON "afirmaciones"("competencia_id", "nombre");

-- CreateIndex
CREATE INDEX "evidencias_afirmacion_id_idx" ON "evidencias"("afirmacion_id");

-- CreateIndex
CREATE UNIQUE INDEX "evidencias_afirmacion_id_nombre_key" ON "evidencias"("afirmacion_id", "nombre");

-- CreateIndex
CREATE INDEX "preguntas_evidencia_id_idx" ON "preguntas"("evidencia_id");

-- CreateIndex
CREATE INDEX "opciones_pregunta_pregunta_id_idx" ON "opciones_pregunta"("pregunta_id");

-- CreateIndex
CREATE INDEX "simulacros_user_id_idx" ON "simulacros"("user_id");

-- CreateIndex
CREATE INDEX "simulacros_competencia_id_idx" ON "simulacros"("competencia_id");

-- CreateIndex
CREATE INDEX "simulacro_preguntas_simulacro_id_idx" ON "simulacro_preguntas"("simulacro_id");

-- CreateIndex
CREATE INDEX "simulacro_preguntas_pregunta_id_idx" ON "simulacro_preguntas"("pregunta_id");

-- CreateIndex
CREATE INDEX "simulacro_preguntas_opcion_seleccionada_id_idx" ON "simulacro_preguntas"("opcion_seleccionada_id");

-- CreateIndex
CREATE UNIQUE INDEX "simulacro_preguntas_simulacro_id_pregunta_id_key" ON "simulacro_preguntas"("simulacro_id", "pregunta_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_school_id_idx" ON "users"("school_id");

-- CreateIndex
CREATE INDEX "users_school_sede_id_idx" ON "users"("school_sede_id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_email_token_key" ON "verification_tokens"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_email_token_key" ON "password_reset_tokens"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "two_factor_tokens_token_key" ON "two_factor_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "two_factor_tokens_email_token_key" ON "two_factor_tokens"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "two_factor_confirmations_userId_key" ON "two_factor_confirmations"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "schools_email_key" ON "schools"("email");

-- CreateIndex
CREATE UNIQUE INDEX "schools_DANE_key" ON "schools"("DANE");

-- CreateIndex
CREATE UNIQUE INDEX "school_sedes_DANE_key" ON "school_sedes"("DANE");

-- CreateIndex
CREATE INDEX "school_sedes_school_id_idx" ON "school_sedes"("school_id");

-- CreateIndex
CREATE INDEX "testimonios_user_id_idx" ON "testimonios"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "orders_productId_idx" ON "orders"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_orderId_key" ON "payments"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_mercado_pago_payment_id_key" ON "payments"("mercado_pago_payment_id");

-- CreateIndex
CREATE INDEX "_EjeTematicoPreguntas_B_index" ON "_EjeTematicoPreguntas"("B");

-- AddForeignKey
ALTER TABLE "contenidos_curriculares" ADD CONSTRAINT "contenidos_curriculares_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ejes_tematicos" ADD CONSTRAINT "ejes_tematicos_contenido_curricular_id_fkey" FOREIGN KEY ("contenido_curricular_id") REFERENCES "contenidos_curriculares"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secciones" ADD CONSTRAINT "secciones_eje_tematico_id_fkey" FOREIGN KEY ("eje_tematico_id") REFERENCES "ejes_tematicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_temas" ADD CONSTRAINT "sub_temas_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "secciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividades_interactivas" ADD CONSTRAINT "actividades_interactivas_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "secciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objetivos_aprendizaje" ADD CONSTRAINT "objetivos_aprendizaje_eje_tematico_id_fkey" FOREIGN KEY ("eje_tematico_id") REFERENCES "ejes_tematicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "niveles_desempeno" ADD CONSTRAINT "niveles_desempeno_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresos_seccion" ADD CONSTRAINT "progresos_seccion_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "secciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresos_seccion" ADD CONSTRAINT "progresos_seccion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresos_sub_tema" ADD CONSTRAINT "progresos_sub_tema_sub_tema_id_fkey" FOREIGN KEY ("sub_tema_id") REFERENCES "sub_temas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresos_sub_tema" ADD CONSTRAINT "progresos_sub_tema_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresos_actividad" ADD CONSTRAINT "progresos_actividad_actividad_id_fkey" FOREIGN KEY ("actividad_id") REFERENCES "actividades_interactivas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresos_actividad" ADD CONSTRAINT "progresos_actividad_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competencias" ADD CONSTRAINT "competencias_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "afirmaciones" ADD CONSTRAINT "afirmaciones_competencia_id_fkey" FOREIGN KEY ("competencia_id") REFERENCES "competencias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidencias" ADD CONSTRAINT "evidencias_afirmacion_id_fkey" FOREIGN KEY ("afirmacion_id") REFERENCES "afirmaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preguntas" ADD CONSTRAINT "preguntas_evidencia_id_fkey" FOREIGN KEY ("evidencia_id") REFERENCES "evidencias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opciones_pregunta" ADD CONSTRAINT "opciones_pregunta_pregunta_id_fkey" FOREIGN KEY ("pregunta_id") REFERENCES "preguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulacros" ADD CONSTRAINT "simulacros_competencia_id_fkey" FOREIGN KEY ("competencia_id") REFERENCES "competencias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulacros" ADD CONSTRAINT "simulacros_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulacro_preguntas" ADD CONSTRAINT "simulacro_preguntas_opcion_seleccionada_id_fkey" FOREIGN KEY ("opcion_seleccionada_id") REFERENCES "opciones_pregunta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulacro_preguntas" ADD CONSTRAINT "simulacro_preguntas_pregunta_id_fkey" FOREIGN KEY ("pregunta_id") REFERENCES "preguntas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulacro_preguntas" ADD CONSTRAINT "simulacro_preguntas_simulacro_id_fkey" FOREIGN KEY ("simulacro_id") REFERENCES "simulacros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_school_sede_id_fkey" FOREIGN KEY ("school_sede_id") REFERENCES "school_sedes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "two_factor_confirmations" ADD CONSTRAINT "two_factor_confirmations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_sedes" ADD CONSTRAINT "school_sedes_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonios" ADD CONSTRAINT "testimonios_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EjeTematicoPreguntas" ADD CONSTRAINT "_EjeTematicoPreguntas_A_fkey" FOREIGN KEY ("A") REFERENCES "ejes_tematicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EjeTematicoPreguntas" ADD CONSTRAINT "_EjeTematicoPreguntas_B_fkey" FOREIGN KEY ("B") REFERENCES "preguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
