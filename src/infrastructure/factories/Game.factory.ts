import { Game, Moves } from "../../domain/entities";
import { GameId } from "../../domain/values/GameId";
import { GameGetPayload } from "../repositories/types";
import { PlayerId } from "../../domain/values/PlayerId";
import { MoveFactory } from "./MoveFactory";

export class GameFactory {
  public static create(game: GameGetPayload): Game {
    const playerOneId = PlayerId.of(game.playerOneId);

    const playerTwoId = game?.playerTwoId
      ? PlayerId.of(game.playerTwoId)
      : undefined;

    const moves = game.moves.map((move) => {
      return MoveFactory.create(move);
    });

    return new Game(GameId.of(game.id), playerOneId, playerTwoId, moves as Moves);
  }
}
