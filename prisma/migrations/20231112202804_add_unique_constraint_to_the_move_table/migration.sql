/*
  Warnings:

  - A unique constraint covering the columns `[game_id,player_id,row,column,mark]` on the table `move` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "move_game_id_player_id_row_column_mark_key" ON "move"("game_id", "player_id", "row", "column", "mark");
