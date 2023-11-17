import { DomainEvent } from "../shared/DomainEvent";
import { PlayerId } from "../values/PlayerId";

export class NewPlayerCreated extends DomainEvent {
  constructor(public readonly playerId: PlayerId) {
    super();
  }
}
