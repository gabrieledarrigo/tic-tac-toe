import { Event } from "../shared/Event";
import { GameId } from "../values/GameId";

export class NewGameCreated extends Event {
  constructor(public readonly id: GameId) {
    super();
  }
}
