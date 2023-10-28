import { Player } from "./Player";
import { Board } from "../values/Board";
import { AggregateRoot } from "../shared/AggregateRoot";

export class Game extends AggregateRoot {
  private currentPlayer?: Player;

  constructor(public readonly id: string, public readonly board: Board) {
    super();
  }
}
