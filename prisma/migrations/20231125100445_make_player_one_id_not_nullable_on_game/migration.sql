/*
  Warnings:

  - Made the column `player_one_id` on table `game` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "game" DROP CONSTRAINT "game_player_one_id_fkey";

-- AlterTable
ALTER TABLE "game" ALTER COLUMN "player_one_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_player_one_id_fkey" FOREIGN KEY ("player_one_id") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
