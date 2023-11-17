import { Player } from "../../domain/entities";
import { Email } from "../../domain/values/Email";
import { PlayerId } from "../../domain/values/PlayerId";
import { PlayerGetPayload } from "../repositories/types";

export class PlayerFactory {
  public static create(player: PlayerGetPayload): Player {
    return new Player(PlayerId.of(player.id), Email.of(player.email));
  }
}
