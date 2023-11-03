-- AlterTable
ALTER TABLE "game" ADD COLUMN     "player_one_id" UUID,
ADD COLUMN     "player_two_id" UUID;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_player_one_id_fkey" FOREIGN KEY ("player_one_id") REFERENCES "player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_player_two_id_fkey" FOREIGN KEY ("player_two_id") REFERENCES "player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
