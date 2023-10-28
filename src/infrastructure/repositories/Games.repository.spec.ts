import { Game } from "../../domain/entities";
import { Board } from "../../domain/values/Board";
import { Prisma } from "../Prisma";
import { GamesRepository } from "./Games.repository";

describe("GamesRepository", () => {
  const prisma = {
    game: {
      create: jest.fn(),
    },
  } as any as Prisma;

  describe("create", () => {
    it("should persist a new game", async () => {
      const game = new Game("1", Board.of());

      const games = new GamesRepository(prisma);
      games.persist(game);

      expect(prisma.game.create).toHaveBeenCalledWith({
        data: {
          id: "1",
        },
      });
    });
  });
});
