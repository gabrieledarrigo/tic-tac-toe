/**
 * Represents a unique identifier for a move in a Tic Tac Toe game.
 */
export class MoveId {
  private constructor(public readonly value: string) {}

  /**
   * Creates a new MoveId instance from the given string value.
   * @param value - The string value to create the MoveId from.
   * @returns A new MoveId instance.
   */
  public static of(value: string): MoveId {
    return new MoveId(value);
  }
}
