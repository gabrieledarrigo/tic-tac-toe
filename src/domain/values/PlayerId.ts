export class PlayerId {
  private constructor(public readonly value: string) {}

  public static of(value: string) {
    return new PlayerId(value);
  }
}
