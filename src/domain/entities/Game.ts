import { Player } from "./Player";
import { Board } from "../values/Board";
import { AggregateRoot } from "../shared/AggregateRoot";
import { NewGameCreated } from "../events/NewGameCreated";
import { GameId } from "../values/GameId";
import { PlayerJoined } from "../events/PlayerJoined";
import { Failure, Result, Success } from "../shared/Result";

export class Game extends AggregateRoot {
  public constructor(
    public readonly id: GameId,
    public readonly board: Board,
    private playerOne?: Player,
    private playerTwo?: Player
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

  public playerJoin(player: Player): Result<void> {
    if (this.isFull()) {
      return Failure.of(new Error("Game is full"));
    }

    if (!this.playerOne) {
      this.playerOne = player;
    } else {
      this.playerTwo = player;
    }

    this.apply(new PlayerJoined(this.id, player.id));

    return Success.of(undefined);
  }

  public getPlayerOne(): Player | undefined {
    return this.playerOne;
  }

  public getPlayerTwo(): Player | undefined {
    return this.playerTwo;
  }

  private isFull(): boolean {
    return !!this.playerOne && !!this.playerTwo;
  }
}
