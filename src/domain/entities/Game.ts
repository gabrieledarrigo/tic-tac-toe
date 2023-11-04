import { Board } from "../values/Board";
import { AggregateRoot } from "../shared/AggregateRoot";
import { NewGameCreated } from "../events/NewGameCreated";
import { GameId } from "../values/GameId";
import { PlayerJoined } from "../events/PlayerJoined";
import { Failure, Result, Success } from "../shared/Result";
import { PlayerId } from "../values/PlayerId";

export class Game extends AggregateRoot {
  public constructor(
    public readonly id: GameId,
    public readonly board: Board,
    private playerOneId?: PlayerId,
    private playerTwoId?: PlayerId
  ) {
    super();
  }

  public static new(
    id: GameId,
    board: Board,
    playerOne?: PlayerId,
    playerTwo?: PlayerId
  ): Game {
    const game = new Game(id, board, playerOne, playerTwo);
    game.apply(new NewGameCreated(id));

    return game;
  }

  public playerJoin(playerId: PlayerId): Result<void> {
    if (this.isFull()) {
      return Failure.of(new Error("Game is full"));
    }

    if (!this.playerOneId) {
      this.playerOneId = playerId;
    } else {
      this.playerTwoId = playerId;
    }

    this.apply(new PlayerJoined(this.id, playerId));

    return Success.of(undefined);
  }

  public getPlayerOneId(): PlayerId | undefined {
    return this.playerOneId;
  }

  public getPlayerTwoId(): PlayerId | undefined {
    return this.playerTwoId;
  }

  private isFull(): boolean {
    return !!this.playerOneId && !!this.playerTwoId;
  }
}
