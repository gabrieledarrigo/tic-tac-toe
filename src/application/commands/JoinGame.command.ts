import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Failure, Result } from "../../domain/shared/Result";
import { GameId } from "../../domain/values/GameId";
import { PlayerId } from "../../domain/values/PlayerId";
import { GamesRepository } from "../../infrastructure/repositories/Games.repository";

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
  constructor(private readonly games: GamesRepository) {}

  public async execute(command: JoinGame): Promise<Result<void>> {
    const game = await this.games.byId(command.gameId);

    if (!game) {
      return Failure.of(
        new Error(`Game with id ${command.gameId.value} not found`)
      );
    }

    return game.playerJoin(command.playerId);
  }
}
