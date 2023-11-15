import { DomainEvent } from "../shared/DomainEvent";
import { GameId } from "../values/GameId";

export class GameEnded extends DomainEvent {
  constructor(public readonly id: GameId) {
    super();
  }
}
