import { Player } from "../../domain/entities";
import { PlayerId } from "../../domain/values/PlayerId";
import { PlayerGetPayload as RepositoryPlayer } from "../repositories/types";

export class PlayerFactory {
  public static create(player: RepositoryPlayer): Player {
    return new Player(PlayerId.of(player.id), player.email);
  }
}
