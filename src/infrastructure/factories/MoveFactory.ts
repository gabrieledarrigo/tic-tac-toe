import { Mark, Move, RowOrColumnValue } from "../../domain/entities";
import { GameId } from "../../domain/values/GameId";
import { MoveId } from "../../domain/values/MoveId";
import { PlayerId } from "../../domain/values/PlayerId";
import { MoveGetPayload } from "../repositories/types";

export class MoveFactory {
  public static create(move: MoveGetPayload): Move {
    return new Move(
      MoveId.of(move.id),
      GameId.of(move.gameId),
      PlayerId.of(move.playerId),
      move.row as RowOrColumnValue,
      move.column as RowOrColumnValue,
      move.mark as Mark,
      move.placedAt
    );
  }
}
