import { Player } from "../entities";
import { WithNextIdentity } from "../shared/Repository";
import { PlayerId } from "../values/PlayerId";

export interface Players extends WithNextIdentity<PlayerId> {
  nextIdentity(): PlayerId;
  byId(id: PlayerId): Promise<Player | null>;
}
