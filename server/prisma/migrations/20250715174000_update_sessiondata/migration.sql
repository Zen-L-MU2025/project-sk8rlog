/*
  Warnings:

  - You are about to drop the column `lastSessionEndTime` on the `SesssionData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SesssionData" DROP COLUMN "lastSessionEndTime",
ADD COLUMN     "averageSessionEndTime" DOUBLE PRECISION,
ADD COLUMN     "averageSessionStartTime" DOUBLE PRECISION;
