import { Game } from "../entities";
import { WithNextIdentity } from "../shared/Repository";
import { GameId } from "../values/GameId";

export interface Games extends WithNextIdentity<GameId> {
  nextIdentity(): GameId;
  byId(id: GameId): Promise<Game | null>;
  persist(game: Game): Promise<void>;
}
