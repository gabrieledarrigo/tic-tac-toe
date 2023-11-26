import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Email } from "../../domain/values/Email";
import { PlayerId } from "../../domain/values/PlayerId";
import { Result, Success } from "../../domain/shared/Result";
import { PlayersRepository } from "../../infrastructure/repositories/Players.repository";
import { Player } from "../../domain/entities";

export class NewPlayer {
  constructor(public readonly email: Email) {}
}

@CommandHandler(NewPlayer)
export class NewPlayerCommandHandler
  implements ICommandHandler<NewPlayer, Result<PlayerId>>
{
  constructor(
    private readonly players: PlayersRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(command: NewPlayer): Promise<Result<PlayerId>> {
    const id = this.players.nextIdentity();
    const player = Player.new(id, command.email);

    await this.players.persist(player);
    this.eventBus.publishAll(player.pullDomainEvents());

    return Success.of(id);
  }
}
