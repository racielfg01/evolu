/*
  Warnings:

  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DaySchedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TimeSlot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `serviceId` on the `ServiceFile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceFile" DROP CONSTRAINT "ServiceFile_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "ServiceFile" DROP COLUMN "serviceId",
ADD COLUMN     "serviceId" BIGINT NOT NULL;

-- DropTable
DROP TABLE "Appointment";

-- DropTable
DROP TABLE "DaySchedule";

-- DropTable
DROP TABLE "Service";

-- DropTable
DROP TABLE "TimeSlot";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "Sex";

-- CreateTable
CREATE TABLE "roles" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sexes" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "sexes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "cuid" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role_id" BIGINT NOT NULL,
    "sex_id" BIGINT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" BIGSERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "day_schedules" (
    "date" TEXT NOT NULL,

    CONSTRAINT "day_schedules_pkey" PRIMARY KEY ("date")
);

-- CreateTable
CREATE TABLE "time_slots" (
    "id" BIGSERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "service_id" BIGINT NOT NULL,
    "day_schedule_date" TEXT,

    CONSTRAINT "time_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "cuid" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time_slot_id" BIGINT NOT NULL,
    "service_id" BIGINT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sexes_name_key" ON "sexes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_cuid_key" ON "users"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "services_cuid_key" ON "services"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "day_schedules_date_key" ON "day_schedules"("date");

-- CreateIndex
CREATE UNIQUE INDEX "time_slots_cuid_key" ON "time_slots"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_cuid_key" ON "appointments"("cuid");

-- CreateIndex
CREATE INDEX "ServiceFile_serviceId_idx" ON "ServiceFile"("serviceId");

-- CreateIndex
CREATE INDEX "ServiceFile_createdAt_idx" ON "ServiceFile"("createdAt");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_sex_id_fkey" FOREIGN KEY ("sex_id") REFERENCES "sexes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_slots" ADD CONSTRAINT "time_slots_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_slots" ADD CONSTRAINT "time_slots_day_schedule_date_fkey" FOREIGN KEY ("day_schedule_date") REFERENCES "day_schedules"("date") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_time_slot_id_fkey" FOREIGN KEY ("time_slot_id") REFERENCES "time_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceFile" ADD CONSTRAINT "ServiceFile_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
