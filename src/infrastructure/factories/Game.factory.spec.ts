import { GameGetPayload } from "../repositories/types";
import { GameFactory } from "./Game.factory";
import { Game } from "../../domain/entities/Game";
import { GameId } from "../../domain/values/GameId";
import { PlayerId } from "../../domain/values/PlayerId";
import { createMock } from "../../../test/utils";
import { Mark } from "../../domain/entities";
import { MoveId } from "../../domain/values/MoveId";

describe("GameFactory", () => {
  describe("create", () => {
    it("should create a new Game with both PlayerIds", () => {
      const gameWithPlayers = createMock<GameGetPayload>({
        id: "gameId",
        playerOneId: "playerOneId",
        playerTwoId: "playerTwoId",
        moves: [],
      });

      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const expectedGame = new Game(
        GameId.of(gameWithPlayers.id),
        playerOneId,
        playerTwoId
      );

      const game = GameFactory.create(gameWithPlayers);

      expect(game).toEqual(expectedGame);
    });

    it("should create a new Game with only PlayerId one", () => {
      const gameWithPlayers = createMock<GameGetPayload>({
        id: "gameId",
        playerOneId: "playerOneId",
        moves: [],
      });

      const playerOneId = PlayerId.of("playerOneId");

      const expectedGame = new Game(
        GameId.of(gameWithPlayers.id),
        playerOneId,
        undefined
      );

      const game = GameFactory.create(gameWithPlayers);

      expect(game).toEqual(expectedGame);
    });

    it("should create a new Game with the related moves", () => {
      const gameWithMoves = createMock<GameGetPayload>({
        id: "gameId",
        playerOneId: "playerOneId",
        playerTwoId: null,
        moves: [
          {
            id: "moveId",
            gameId: "gameId",
            playerId: "playerId",
            row: 1,
            column: 1,
            mark: Mark.X,
          },
        ],
      });

      const playerOneId = PlayerId.of("playerOneId");

      const expectedGame = new Game(
        GameId.of(gameWithMoves.id),
        playerOneId,
        undefined,
        [
          {
            id: MoveId.of("moveId"),
            gameId: GameId.of("gameId"),
            playerId: PlayerId.of("playerId"),
            row: 1,
            column: 1,
            mark: Mark.X,
            placedAt: new Date(),
          },
        ]
      );

      const game = GameFactory.create(gameWithMoves);

      expect(game).toEqual(expectedGame);
    });
  });
});
