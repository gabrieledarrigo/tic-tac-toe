import { Player } from "./Player";
import { Board } from "../values/Board";
import { AggregateRoot } from "../shared/AggregateRoot";
import { NewGameCreated } from "../events/NewGameCreated";
import { GameId } from "../values/GameId";

export class Game extends AggregateRoot {
  constructor(
    public readonly id: GameId,
    public readonly board: Board,
    public readonly playerOne?: Player,
    public readonly playerTwo?: Player
  ) {
    super();
    this.apply(new NewGameCreated(id));
  }
}
