/*
  Warnings:

  - Added the required column `detailedDescription` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "services" ADD COLUMN     "benefits" TEXT[],
ADD COLUMN     "detailedDescription" TEXT NOT NULL,
ADD COLUMN     "preparation" TEXT[];
