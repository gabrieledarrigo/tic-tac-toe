import { Game } from "../../domain/entities";
import { Board } from "../../domain/values/Board";
import { Prisma } from "../Prisma";
import { GamesRepository } from "./Games.repository";
import * as uuid from "uuid";

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe("GamesRepository", () => {
  const prisma = {
    game: {
      create: jest.fn(),
    },
  } as any as Prisma;

  describe("nextIdentity", () => {
    it("should return a new identity", () => {
      const id = "id";

      jest.spyOn(uuid, "v4").mockReturnValue(id);

      const games = new GamesRepository(prisma);
      const identity = games.nextIdentity();

      expect(identity).toEqual(id);
    });
  });

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
