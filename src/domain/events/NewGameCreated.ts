import { Board } from "../values/Board";
import { Event } from "../shared/Event";
import { GameId } from "../values/GameId";

export class NewGameCreated extends Event {
  constructor(public readonly id: GameId, public readonly board: Board) {
    super();
  }
}
