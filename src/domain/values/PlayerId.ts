export class PlayerId {
  private constructor(public readonly value: string) {}

  public static of(value: string) {
    return new PlayerId(value);
  }

  public equals(other: PlayerId): boolean {
    return this.value === other.value;
  }
}
