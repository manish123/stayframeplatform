/*
  Warnings:

  - Added the required column `subscribed_at` to the `waitlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "waitlist" ADD COLUMN     "interest" TEXT NOT NULL DEFAULT 'creator',
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'pro',
ADD COLUMN     "subscribed_at" TIMESTAMP(3) NOT NULL;
