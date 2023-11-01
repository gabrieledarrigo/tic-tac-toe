export class GameId {
  private constructor(public readonly value: string) {}

  public static of(value: string) {
    return new GameId(value);
  }
}
