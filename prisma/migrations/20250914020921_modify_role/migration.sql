/*
  Warnings:

  - You are about to drop the column `rol` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'ADMINSCHOOL', 'USER');

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "rol",
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "public"."Rol";
