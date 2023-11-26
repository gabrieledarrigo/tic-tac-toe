import { GameId } from "../values/GameId";
import { MoveId } from "../values/MoveId";
import { PlayerId } from "../values/PlayerId";

/**
 * Represents the possible marks in a tic-tac-toe game.
 */
export enum Mark {
  X = "X",
  O = "O",
}

/**
 * Represents a value for a row or column in a tic-tac-toe board.
 * Can be 0, 1, or 2.
 */
export type RowOrColumnValue = 0 | 1 | 2;

/**
 * Represents a move made by a player in a tic-tac-toe game.
 */
export class Move {
  /**
   * Creates an instance of Move.
   * @param {MoveId} id - The unique identifier of the move.
   * @param {GameId} gameId - The identifier of the game the move belongs to.
   * @param {PlayerId} playerId - The identifier of the player who made the move.
   * @param {0|1|2} row - The row where the move was made.
   * @param {0|1|2} column - The column where the move was made.
   * @param {Mark} mark - The mark (X or O) made by the player.
   */
  constructor(
    public readonly id: MoveId,
    public readonly gameId: GameId,
    public readonly playerId: PlayerId,
    public readonly row: RowOrColumnValue,
    public readonly column: RowOrColumnValue,
    public readonly mark: Mark,
  ) {}
}
