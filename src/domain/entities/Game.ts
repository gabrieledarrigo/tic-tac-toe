import { Player } from "./Player";
import { Board } from "../values/Board";
import { AggregateRoot } from "../shared/AggregateRoot";
import { NewGameCreated } from "../events/NewGameCreated";
import { GameId } from "../values/GameId";

export class Game extends AggregateRoot {
  private currentPlayer?: Player;

  constructor(public readonly id: GameId, public readonly board: Board) {
    super();
    this.apply(new NewGameCreated(id));
  }
}
