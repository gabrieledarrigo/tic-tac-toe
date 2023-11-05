export enum Mark {
  X = "X",
  O = "O",
}

export class Move {
  constructor(
    public readonly id: string,
    public readonly gameId: string,
    public readonly playerId: string,
    public readonly row: number,
    public readonly column: number,
    public readonly mark?: Mark
  ) {}
}
