/*
  Warnings:

  - The primary key for the `services` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "ServiceFile" DROP CONSTRAINT "ServiceFile_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_service_id_fkey";

-- DropForeignKey
ALTER TABLE "time_slots" DROP CONSTRAINT "time_slots_service_id_fkey";

-- AlterTable
ALTER TABLE "ServiceFile" ALTER COLUMN "serviceId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "service_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "services" DROP CONSTRAINT "services_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "services_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "services_id_seq";

-- AlterTable
ALTER TABLE "time_slots" ALTER COLUMN "service_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "time_slots" ADD CONSTRAINT "time_slots_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceFile" ADD CONSTRAINT "ServiceFile_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
