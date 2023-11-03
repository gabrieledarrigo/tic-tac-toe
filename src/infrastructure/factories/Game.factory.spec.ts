import {
  GameWithPlayers,
  Player as RepositoryPlayer,
} from "../repositories/types";
import { GameFactory } from "./Game.factory";
import { Game } from "../../domain/entities/Game";
import { Player } from "../../domain/entities/Player";
import { GameId } from "../../domain/values/GameId";
import { Board } from "../../domain/values/Board";
import { PlayerId } from "../../domain/values/PlayerId";
import { createMock } from "../../../test/utils";

describe("GameFactory", () => {
  describe("create", () => {
    it("should create a new Game with no Players", () => {
      const gameWithPlayers = createMock<GameWithPlayers>({
        id: "gameId",
        playerOne: null,
        playerTwo: null,
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

    it("should create a new Game with two Players", () => {
      const playerOne = createMock<RepositoryPlayer>({
        id: "playerOneId",
        email: "player.one@example.com",
      });

      const playerTwo = createMock<RepositoryPlayer>({
        id: "playerTwoId",
        email: "player.two@example.com",
      });

      const gameWithPlayers = createMock<GameWithPlayers>({
        id: "gameId",
        playerOne,
        playerTwo,
      });

      const expectedPlayerOne = new Player(
        PlayerId.of(playerOne.id),
        playerOne.email
      );
      const expectedPlayerTwo = new Player(
        PlayerId.of(playerTwo!.id),
        playerTwo.email
      );

      const expectedGame = new Game(
        GameId.of(gameWithPlayers.id),
        Board.of(),
        expectedPlayerOne,
        expectedPlayerTwo
      );

      const game = GameFactory.create(gameWithPlayers);

      expect(game).toEqual(expectedGame);
    });

    it("should create a new Game with only Player one", () => {
      const playerOne = createMock<RepositoryPlayer>({
        id: "playerOneId",
        email: "player.one@example.com",
      });

      const gameWithPlayers = createMock<GameWithPlayers>({
        id: "gameId",
        playerOne,
      });

      const expectedPlayerOne = new Player(
        PlayerId.of(playerOne.id),
        playerOne.email
      );

      const expectedGame = new Game(
        GameId.of(gameWithPlayers.id),
        Board.of(),
        expectedPlayerOne,
        undefined
      );

      const game = GameFactory.create(gameWithPlayers);

      expect(game).toEqual(expectedGame);
    });

    it("should create a new Game with only Player two", () => {
      const playerTwo = createMock<RepositoryPlayer>({
        id: "playerTwoId",
        email: "player.two@example.com",
      });

      const gameWithPlayers = createMock<GameWithPlayers>({
        id: "gameId",
        playerTwo,
      });

      const expectedPlayerTwo = new Player(
        PlayerId.of(playerTwo!.id),
        playerTwo.email
      );

      const expectedGame = new Game(
        GameId.of(gameWithPlayers.id),
        Board.of(),
        undefined,
        expectedPlayerTwo
      );

      const game = GameFactory.create(gameWithPlayers);

      expect(game).toEqual(expectedGame);
    });
  });
});
