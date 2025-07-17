-- AlterTable
ALTER TABLE "InteractionData" ADD COLUMN     "averageCreateInteractionTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "createInteractionCount" INTEGER NOT NULL DEFAULT 0;
