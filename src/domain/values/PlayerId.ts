export class PlayerId {
  private constructor(public readonly value: string) {}

  /**
   * Creates a new PlayerId instance with the given value.
   * @param value The value of the PlayerId.
   * @returns A new PlayerId instance.
   */
  public static of(value: string) {
    return new PlayerId(value);
  }

  /**
   * Checks if this PlayerId is equal to another PlayerId.
   * @param other The other PlayerId to compare to.
   * @returns True if the PlayerIds are equal, false otherwise.
   */
  public equals(other: PlayerId): boolean {
    return this.value === other.value;
  }
}
