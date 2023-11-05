import { createMock } from "../../../test/utils";
import { Game } from "../../domain/entities";
import { Board } from "../../domain/values/Board";
import { GameId } from "../../domain/values/GameId";
import { PlayerId } from "../../domain/values/PlayerId";
import { Prisma } from "../Prisma";
import { GamesRepository } from "./Games.repository";
import { Game as RepositoryGame } from "./types";
import * as uuid from "uuid";

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe("GamesRepository", () => {
  const prisma = createMock<Prisma>({
    game: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  });

  describe("nextIdentity", () => {
    it("should return a new GameId", () => {
      const id = "id";
      jest.spyOn(uuid, "v4").mockReturnValue(id);

      const games = new GamesRepository(prisma);
      const identity = games.nextIdentity();

      expect(identity).toEqual(GameId.of(id));
    });
  });

  describe("byId", () => {
    it("should return a Success with the Game when it exists", async () => {
      const game = createMock<RepositoryGame>({
        id: "id",
        playerOneId: "playerOneId",
        playerTwoId: "playerTwoId",
      });

      jest.spyOn(prisma.game, "findUnique").mockResolvedValue(game);

      const expectedGame = new Game(
        GameId.of("id"),
        Board.of(),
        PlayerId.of("playerOneId"),
        PlayerId.of("playerTwoId")
      );

      const games = new GamesRepository(prisma);
      const actual = await games.byId(GameId.of("id"));

      expect(prisma.game.findUnique).toHaveBeenCalledWith({
        where: {
          id: "id",
        },
      });
      expect(actual.isSuccess()).toBe(true);
      expect(actual.unwrap()).toEqual(expectedGame);
    });

    it("should return a Failure when the Game does not exist", async () => {
      jest.spyOn(prisma.game, "findUnique").mockResolvedValue(null);

      const games = new GamesRepository(prisma);
      const actual = await games.byId(GameId.of("id"));

      expect(actual.isFailure()).toBe(true);
    });
  });

  describe("persist", () => {
    it("should persist a new Game", async () => {
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const game = new Game(
        GameId.of("id"),
        Board.of(),
        playerOneId,
        playerTwoId
      );

      const games = new GamesRepository(prisma);
      games.persist(game);

      expect(prisma.game.create).toHaveBeenCalledWith({
        data: {
          id: "id",
          playerOneId: playerOneId.value,
          playerTwoId: playerTwoId?.value,
        },
      });
    });
  });
});
