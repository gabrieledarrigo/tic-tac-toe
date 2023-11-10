import { Event } from "../shared/Event";
import { GameId } from "../values/GameId";
import { PlayerId } from "../values/PlayerId";

export class PlayerMoved extends Event {
  public constructor(
    public readonly gameId: GameId,
    public readonly playerId: PlayerId,
    public readonly move: string
  ) {
    super();
  }
}
