import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Failure, Result, Success } from "../../domain/shared/Result";
import { GameId } from "../../domain/values/GameId";
import { PlayerId } from "../../domain/values/PlayerId";
import { GamesRepository } from "../../infrastructure/repositories/Games.repository";
import { PlayersRepository } from "../../infrastructure/repositories/Players.repository";

export class JoinGame {
  constructor(
    public readonly gameId: GameId,
    public readonly playerId: PlayerId
  ) {}
}

@CommandHandler(JoinGame)
export class JoinGameCommandHandler
  implements ICommandHandler<JoinGame, Result<void>>
{
  constructor(
    private readonly games: GamesRepository,
    private readonly players: PlayersRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: JoinGame): Promise<Result<void>> {
    const { playerId, gameId } = command;
    const player = await this.players.byId(playerId);

    if (!player) {
      return Failure.of(
        new Error(`Player with id ${playerId.value} not found`)
      );
    }

    const game = await this.games.byId(gameId);

    if (!game) {
      return Failure.of(new Error(`Game with id ${gameId.value} not found`));
    }

    const join = game.playerJoin(command.playerId);

    if (join.isFailure()) {
      return Failure.of(join.error);
    }

    await this.games.persist(game);
    this.eventBus.publishAll(game.pullDomainEvents());

    return join;
  }
}
