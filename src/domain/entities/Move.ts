import { GameId } from "../values/GameId";
import { PlayerId } from "../values/PlayerId";

export enum Mark {
  X = "X",
  O = "O",
}

export type RowOrColumnValue = 0 | 1 | 2;

export class Move {
  constructor(
    public readonly id: string,
    public readonly gameId: GameId,
    public readonly playerId: PlayerId,
    public readonly row: RowOrColumnValue,
    public readonly column: RowOrColumnValue,
    public readonly mark: Mark
  ) {}
}
