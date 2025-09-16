/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "imageUrl";

-- CreateTable
CREATE TABLE "ServiceFile" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceFile_path_key" ON "ServiceFile"("path");

-- AddForeignKey
ALTER TABLE "ServiceFile" ADD CONSTRAINT "ServiceFile_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
