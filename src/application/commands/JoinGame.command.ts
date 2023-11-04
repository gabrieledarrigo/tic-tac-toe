import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Result } from "../../domain/shared/Result";
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
    const result = await this.games.byId(command.gameId);

    if (result.isFailure()) {
      return result;
    }

    const game = result.unwrap();

    return game.playerJoin(command.playerId);
  }
}
