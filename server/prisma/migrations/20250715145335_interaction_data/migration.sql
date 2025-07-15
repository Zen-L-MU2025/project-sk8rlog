-- CreateTable
CREATE TABLE "InteractionData" (
    "userID" TEXT NOT NULL,
    "likeInteractionCount" INTEGER NOT NULL DEFAULT 0,
    "averageLikeInteractionTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "commentInteractionCount" INTEGER NOT NULL DEFAULT 0,
    "averageCommentInteractionTime" DOUBLE PRECISION NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "InteractionData_userID_key" ON "InteractionData"("userID");
