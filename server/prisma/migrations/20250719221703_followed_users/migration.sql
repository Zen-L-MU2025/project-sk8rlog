-- AlterTable
ALTER TABLE "User" ADD COLUMN     "followedUsers" TEXT[] DEFAULT ARRAY[]::TEXT[];
