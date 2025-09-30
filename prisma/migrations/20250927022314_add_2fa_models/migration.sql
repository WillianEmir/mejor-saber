-- CreateTable
CREATE TABLE "public"."verification_tokens" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."password_reset_tokens" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."two_factor_tokens" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "two_factor_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."two_factor_confirmations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "two_factor_confirmations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "public"."verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_email_token_key" ON "public"."verification_tokens"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "public"."password_reset_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_email_token_key" ON "public"."password_reset_tokens"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "two_factor_tokens_token_key" ON "public"."two_factor_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "two_factor_tokens_email_token_key" ON "public"."two_factor_tokens"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "two_factor_confirmations_userId_key" ON "public"."two_factor_confirmations"("userId");

-- AddForeignKey
ALTER TABLE "public"."two_factor_confirmations" ADD CONSTRAINT "two_factor_confirmations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
