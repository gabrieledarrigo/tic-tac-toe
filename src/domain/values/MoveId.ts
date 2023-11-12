export class MoveId {
  private constructor(public readonly value: string) {}

  public static of(value: string): MoveId {
    return new MoveId(value);
  }
}
