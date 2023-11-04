import {
  Game as RepositoryGame,
  Player as RepositoryPlayer,
} from "../repositories/types";
import { GameFactory } from "./Game.factory";
import { Game } from "../../domain/entities/Game";
import { GameId } from "../../domain/values/GameId";
import { Board } from "../../domain/values/Board";
import { PlayerId } from "../../domain/values/PlayerId";
import { createMock } from "../../../test/utils";

describe("GameFactory", () => {
  describe("create", () => {
    it("should create a new Game with no PlayerIds", () => {
      const gameWithPlayers = createMock<RepositoryGame>({
        id: "gameId",
        playerOneId: null,
        playerTwoId: null,
      });

      const expectedGame = new Game(
        GameId.of(gameWithPlayers.id),
        Board.of(),
        undefined,
        undefined
      );

      const game = GameFactory.create(gameWithPlayers);

      expect(game).toEqual(expectedGame);
    });

    it("should create a new Game with both PlayerIds", () => {
      const gameWithPlayers = createMock<RepositoryGame>({
        id: "gameId",
        playerOneId: "playerOneId",
        playerTwoId: "playerTwoId",
      });

      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const expectedGame = new Game(
        GameId.of(gameWithPlayers.id),
        Board.of(),
        playerOneId,
        playerTwoId
      );

      const game = GameFactory.create(gameWithPlayers);

      expect(game).toEqual(expectedGame);
    });

    it("should create a new Game with only PlayerId one", () => {
      const gameWithPlayers = createMock<RepositoryGame>({
        id: "gameId",
        playerOneId: "playerOneId",
      });

      const playerOneId = PlayerId.of("playerOneId");

      const expectedGame = new Game(
        GameId.of(gameWithPlayers.id),
        Board.of(),
        playerOneId,
        undefined
      );

      const game = GameFactory.create(gameWithPlayers);

      expect(game).toEqual(expectedGame);
    });

    it("should create a new Game with only PlayerId two", () => {
      const gameWithPlayers = createMock<RepositoryGame>({
        id: "gameId",
        playerTwoId: "playerTwoId",
      });

      const playerTwoId = PlayerId.of("playerTwoId");

      const expectedGame = new Game(
        GameId.of(gameWithPlayers.id),
        Board.of(),
        undefined,
        playerTwoId
      );

      const game = GameFactory.create(gameWithPlayers);

      expect(game).toEqual(expectedGame);
    });
  });
});
