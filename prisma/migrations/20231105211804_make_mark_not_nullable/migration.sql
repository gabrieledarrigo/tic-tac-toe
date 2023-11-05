/*
  Warnings:

  - You are about to drop the `Move` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Move" DROP CONSTRAINT "Move_game_id_fkey";

-- DropForeignKey
ALTER TABLE "Move" DROP CONSTRAINT "Move_player_id_fkey";

-- DropTable
DROP TABLE "Move";

-- CreateTable
CREATE TABLE "move" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "game_id" UUID NOT NULL,
    "player_id" UUID NOT NULL,
    "row" SMALLINT NOT NULL,
    "column" SMALLINT NOT NULL,
    "mark" "Mark" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "move_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "check_valid_row" CHECK ("row" IN (1, 2, 3)),
    CONSTRAINT "check_valid_column" CHECK ("column" IN (1, 2, 3))
);

-- AddForeignKey
ALTER TABLE "move" ADD CONSTRAINT "move_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "move" ADD CONSTRAINT "move_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
