/*
  Warnings:

  - Added the required column `duration` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "total_price" DOUBLE PRECISION NOT NULL;
