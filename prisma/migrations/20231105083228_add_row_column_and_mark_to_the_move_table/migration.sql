/*
  Warnings:

  - Added the required column `column` to the `Move` table without a default value. This is not possible if the table is not empty.
  - Added the required column `row` to the `Move` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Mark" AS ENUM ('X', 'O');

-- AlterTable
ALTER TABLE "Move" ADD COLUMN     "column" SMALLINT NOT NULL,
ADD COLUMN     "mark" "Mark",
ADD COLUMN     "row" SMALLINT NOT NULL;
