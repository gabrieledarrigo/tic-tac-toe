import { DomainEvent } from "../shared/DomainEvent";
import { GameId } from "../values/GameId";
import { PlayerId } from "../values/PlayerId";

export class PlayerMoved extends DomainEvent {
  public constructor(
    public readonly gameId: GameId,
    public readonly playerId: PlayerId,
    public readonly move: string
  ) {
    super();
  }
}
