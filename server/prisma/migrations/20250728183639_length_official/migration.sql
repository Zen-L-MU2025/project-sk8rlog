/*
  Warnings:

  - You are about to drop the column `clipLength` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "clipLength",
ADD COLUMN     "length" INTEGER;
