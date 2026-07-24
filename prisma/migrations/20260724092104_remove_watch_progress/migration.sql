/*
  Warnings:

  - You are about to drop the `WatchProgress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WatchProgress" DROP CONSTRAINT "WatchProgress_userId_fkey";

-- DropTable
DROP TABLE "WatchProgress";
