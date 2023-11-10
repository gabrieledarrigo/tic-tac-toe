/**
 * Represents a unique identifier for a game.
 */
export class GameId {
  private constructor(public readonly value: string) {}

  /**
   * Creates a new GameId instance from the given string value.
   * @param value The string value to create the GameId from.
   * @returns A new GameId instance.
   */
  public static of(value: string) {
    return new GameId(value);
  }
}
