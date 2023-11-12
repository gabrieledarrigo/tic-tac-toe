import { Player } from "../entities";
import { Repository } from "../shared/Repository";
import { PlayerId } from "../values/PlayerId";

/**
 * Represent a repository of players.
 */
export interface Players extends Repository<Player, PlayerId> {
  nextIdentity(): PlayerId;
  byId(id: PlayerId): Promise<Player | null>;
  persist(player: Player): Promise<void>;
}
