import { Player } from "./Player";
import { Board } from "../values/Board";
import { AggregateRoot } from "../shared/AggregateRoot";
import { NewGameCreated } from "../events/NewGameCreated";
import { GameId } from "../values/GameId";

export class Game extends AggregateRoot {
  public constructor(
    public readonly id: GameId,
    public readonly board: Board,
    public readonly playerOne?: Player,
    public readonly playerTwo?: Player
  ) {
    super();
  }

  public static new(
    id: GameId,
    board: Board,
    playerOne?: Player,
    playerTwo?: Player
  ): Game {
    const game = new Game(id, board, playerOne, playerTwo);
    game.apply(new NewGameCreated(id));

    return game;
  }
}
