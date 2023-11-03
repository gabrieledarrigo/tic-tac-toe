import { Event } from "../shared/Event";
import { GameId } from "../values/GameId";
import { PlayerId } from "../values/PlayerId";

export class PlayerJoined extends Event {
  constructor(
    public readonly gameId: GameId,
    public readonly playerId: PlayerId
  ) {
    super();
  }
}
