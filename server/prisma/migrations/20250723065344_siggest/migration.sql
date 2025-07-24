-- AlterTable
ALTER TABLE "User" ADD COLUMN     "suggestedUsers" JSONB NOT NULL DEFAULT '[]';
