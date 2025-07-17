-- CreateTable
CREATE TABLE "SesssionData" (
    "userID" TEXT NOT NULL,
    "sessionCount" INTEGER NOT NULL DEFAULT 0,
    "averageSessionTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastSessionStartTime" TIMESTAMP(3),
    "lastSessionEndTime" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "SesssionData_userID_key" ON "SesssionData"("userID");
