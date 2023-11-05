import { AggregateRoot } from "../shared/AggregateRoot";
import { NewGameCreated } from "../events/NewGameCreated";
import { GameId } from "../values/GameId";
import { PlayerJoined } from "../events/PlayerJoined";
import { Failure, Result, Success } from "../shared/Result";
import { PlayerId } from "../values/PlayerId";
import { Move } from "./Move";

export class Game extends AggregateRoot {
  public constructor(
    public readonly id: GameId,
    private playerOneId?: PlayerId,
    private playerTwoId?: PlayerId,
    private readonly moves: Move[] = []
  ) {
    super();
  }

  public static new(
    id: GameId,
    playerOneId?: PlayerId,
    playerTwoId?: PlayerId,
    moves: Move[] = []
  ): Game {
    const game = new Game(id, playerOneId, playerTwoId, moves);
    game.apply(new NewGameCreated(id));

    return game;
  }

  public playerJoin(playerId: PlayerId): Result<void> {
    if (this.isFull()) {
      if (
        this.playerOneId?.equals(playerId) ||
        this.playerTwoId?.equals(playerId)
      ) {
        return Success.of(undefined);
      }

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
