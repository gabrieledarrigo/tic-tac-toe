import { Board } from "../values/Board";
import { Event } from "../shared/Event";

export class NewGameCreated extends Event {
  constructor(public readonly id: string, public readonly board: Board) {
    super();
  }
}
