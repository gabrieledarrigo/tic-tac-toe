import { PlayerId } from "./PlayerId";

/**
 * Represents the possible states of a Tic Tac Toe game.
 * - "In Progress": the game is still ongoing.
 * - "Horizontal Win": a player has won horizontally.
 * - "Vertical Win": a player has won vertically.
 * - "Diagonal Win": a player has won diagonally.
 * - "Draw": the game ended in a draw.
 */
export type State =
  | "In Progress"
  | "Horizontal Win"
  | "Vertical Win"
  | "Diagonal Win"
  | "Draw";

/**
 * Represents the state of a Tic Tac Toe game.
 */
export class GameState {
  private constructor(
    public readonly state: State,
    public readonly winner?: PlayerId,
  ) {}

  /**
   * Creates a new GameState instance with the given state and optional winner.
   * @param state The state of the game.
   * @param winner The winner of the game, if any.
   * @returns A new GameState instance.
   */
  public static of(state: State, winner?: PlayerId): GameState {
    return new GameState(state, winner);
  }

  /**
   * Checks if the game state is ended.
   * @returns {boolean} True if the game state is not "In Progress", false otherwise.
   */
  public isEnded(): boolean {
    return this.state !== "In Progress";
  }
}
