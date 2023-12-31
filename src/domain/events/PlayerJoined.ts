import { DomainEvent } from "../shared/DomainEvent";
import { GameId } from "../values/GameId";
import { PlayerId } from "../values/PlayerId";

export class PlayerJoined extends DomainEvent {
  constructor(
    public readonly gameId: GameId,
    public readonly playerId: PlayerId,
  ) {
    super();
  }
}
