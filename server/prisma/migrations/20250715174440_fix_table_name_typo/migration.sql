/*
  Warnings:

  - You are about to drop the `SesssionData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "SesssionData";

-- CreateTable
CREATE TABLE "SessionData" (
    "userID" TEXT NOT NULL,
    "sessionCount" INTEGER NOT NULL DEFAULT 0,
    "averageSessionTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastSessionStartTime" TIMESTAMP(3),
    "averageSessionStartTime" DOUBLE PRECISION,
    "averageSessionEndTime" DOUBLE PRECISION
);

-- CreateIndex
CREATE UNIQUE INDEX "SessionData_userID_key" ON "SessionData"("userID");
