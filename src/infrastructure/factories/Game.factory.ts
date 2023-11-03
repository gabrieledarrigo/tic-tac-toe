import { Game } from "../../domain/entities";
import { GameId } from "../../domain/values/GameId";
import { Board } from "../../domain/values/Board";
import { PlayerFactory } from "./Player.factory";
import { GameWithPlayers } from "../repositories/types";

export class GameFactory {
  public static create(game: GameWithPlayers): Game {
    const playerOne = game?.playerOne
      ? PlayerFactory.create(game.playerOne)
      : undefined;

    const playerTwo = game?.playerTwo
      ? PlayerFactory.create(game.playerTwo)
      : undefined;

    return new Game(GameId.of(game.id), Board.of(), playerOne, playerTwo);
  }
}
