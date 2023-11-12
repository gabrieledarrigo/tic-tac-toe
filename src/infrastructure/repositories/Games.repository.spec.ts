import { createMock } from "../../../test/utils";
import { Game, Mark, Move, Moves } from "../../domain/entities";
import { GameId } from "../../domain/values/GameId";
import { PlayerId } from "../../domain/values/PlayerId";
import { Prisma } from "../Prisma";
import { GamesRepository } from "./Games.repository";
import { GameGetPayload } from "./types";
import * as uuid from "uuid";

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe("GamesRepository", () => {
  const prisma = createMock<Prisma>({
    game: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
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
    it("should return the Game when it exists", async () => {
      const game = createMock<GameGetPayload>({
        id: "id",
        playerOneId: "playerOneId",
        playerTwoId: "playerTwoId",
        moves: [],
      });

      jest.spyOn(prisma.game, "findUnique").mockResolvedValue(game);

      const expectedGame = new Game(
        GameId.of("id"),
        PlayerId.of("playerOneId"),
        PlayerId.of("playerTwoId")
      );

      const games = new GamesRepository(prisma);
      const actual = await games.byId(GameId.of("id"));

      expect(prisma.game.findUnique).toHaveBeenCalledWith({
        where: {
          id: "id",
        },
        include: {
          moves: true,
        },
      });
      expect(actual).toEqual(expectedGame);
    });

    it("should return a null value when the Game does not exist", async () => {
      jest.spyOn(prisma.game, "findUnique").mockResolvedValue(null);

      const games = new GamesRepository(prisma);
      const actual = await games.byId(GameId.of("id"));

      expect(actual).toBeNull();
    });
  });

  describe("persist", () => {
    it("should persist a new Game along the related Moves", async () => {
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const moves: Moves = [
        createMock<Move>({
          playerId: playerOneId,
          row: 0,
          column: 0,
          mark: Mark.X,
        }),
      ];

      const expectedMove = {
        id: moves[0].id,
        playerId: moves[0].playerId.value,
        row: moves[0].row,
        column: moves[0].column,
        mark: moves[0].mark,
      };

      const game = new Game(GameId.of("id"), playerOneId, playerTwoId, moves);

      const games = new GamesRepository(prisma);
      games.persist(game);

      expect(prisma.game.upsert).toHaveBeenCalledWith({
        where: {
          id: "id",
        },
        create: {
          playerOneId: playerOneId.value,
          playerTwoId: playerTwoId?.value,
        },
        update: {
          moves: {
            upsert: [
              {
                where: {
                  id: expectedMove.id,
                },
                create: expectedMove,
                update: expectedMove,
              },
            ],
          },
        },
      });
    });
  });
});
