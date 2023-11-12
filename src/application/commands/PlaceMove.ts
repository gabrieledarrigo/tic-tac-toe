import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Mark, Move, RowOrColumnValue } from "../../domain/entities";
import { GameState } from "../../domain/values/GameState";
import { Failure, Result } from "../../domain/shared/Result";
import { GamesRepository } from "../../infrastructure/repositories/Games.repository";
import { GameId } from "../../domain/values/GameId";
import { PlayerId } from "../../domain/values/PlayerId";

export class PlaceMove {
  constructor(
    public readonly gameId: GameId,
    public readonly playerId: PlayerId,
    public readonly row: RowOrColumnValue,
    public readonly column: RowOrColumnValue,
    public readonly mark: Mark
  ) {}
}

@CommandHandler(PlaceMove)
export class PlaceMoveCommandHandler
  implements ICommandHandler<PlaceMove, Result<GameState>>
{
  constructor(
    private readonly games: GamesRepository,
    public readonly eventBus: EventBus
  ) {}

  public async execute(command: PlaceMove): Promise<Result<GameState>> {
    const { gameId, playerId, row, column, mark } = command;

    const game = await this.games.byId(gameId);

    if (!game) {
      return Failure.of(
        new Error(`Game with id ${gameId.value} does not exist`)
      );
    }

    const moveId = this.games.nextMoveIdentity();

    const placed = game.place(
      new Move(moveId, gameId, playerId, row, column, mark)
    );

    if (placed.isFailure()) {
      return placed;
    }

    await this.games.persist(game);
    this.eventBus.publishAll(game.pullDomainEvents());

    return placed;
  }
}
