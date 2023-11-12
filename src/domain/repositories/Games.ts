import { Game } from "../entities";
import { Repository } from "../shared/Repository";
import { GameId } from "../values/GameId";

/**
 * Represents a repository of games.
 */
export interface Games extends Repository<Game, GameId> {
  nextIdentity(): GameId;
  byId(id: GameId): Promise<Game | null>;
  persist(game: Game): Promise<void>;
}
