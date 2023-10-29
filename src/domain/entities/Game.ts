import { Player } from "./Player";
import { Board } from "../values/Board";
import { AggregateRoot } from "../shared/AggregateRoot";
import { NewGameCreated } from "../events/NewGameCreated";

export class Game extends AggregateRoot {
  private currentPlayer?: Player;

  constructor(public readonly id: string, public readonly board: Board) {
    super();

    this.apply(new NewGameCreated(id, board));
  }
}
