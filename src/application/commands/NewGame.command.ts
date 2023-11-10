import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Game } from "../../domain/entities";
import { Result, Success } from "../../domain/shared/Result";
import { GameId } from "../../domain/values/GameId";
import { GamesRepository } from "../../infrastructure/repositories/Games.repository";

export class NewGame {
  constructor() {}
}

@CommandHandler(NewGame)
export class NewGameCommandHandler
  implements ICommandHandler<NewGame, Result<GameId>>
{
  constructor(
    private readonly games: GamesRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(_command: NewGame): Promise<Result<GameId>> {
    const id = this.games.nextIdentity();
    const game = Game.new(id);

    await this.games.persist(game);
    this.eventBus.publishAll(game.pullDomainEvents());

    return Success.of(id);
  }
}
