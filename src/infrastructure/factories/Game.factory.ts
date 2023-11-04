import { Game } from "../../domain/entities";
import { GameId } from "../../domain/values/GameId";
import { Board } from "../../domain/values/Board";
import { Game as RepositoryGame } from "../repositories/types";
import { PlayerId } from "../../domain/values/PlayerId";

export class GameFactory {
  public static create(game: RepositoryGame): Game {
    const playerOneId = game?.playerOneId
      ? PlayerId.of(game.playerOneId)
      : undefined;

    const playerTwoId = game?.playerTwoId
      ? PlayerId.of(game.playerTwoId)
      : undefined;

    return new Game(GameId.of(game.id), Board.of(), playerOneId, playerTwoId);
  }
}
