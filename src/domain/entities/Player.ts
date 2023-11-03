import { PlayerId } from "../values/PlayerId";

export class Player {
  constructor(public readonly id: PlayerId, public readonly email: string) {}
}
