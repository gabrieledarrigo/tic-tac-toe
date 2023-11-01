import { Game } from "../entities";
import { WithNextIdentity } from "../shared/Repository";

export interface Games extends WithNextIdentity {
  persist(game: Game): Promise<void>;
}
