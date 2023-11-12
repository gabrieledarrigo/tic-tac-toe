import { createMock } from "../../../test/utils";
import { PlayerFactory } from "../factories/Player.factory";
import { Player } from "../../domain/entities/Player";
import { PlayerId } from "../../domain/values/PlayerId";
import { PlayersRepository } from "./Players.repository";
import { Prisma } from "../Prisma";
import { PlayerGetPayload } from "./types";
import * as uuid from "uuid";

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe("PlayersRepository", () => {
  const prisma = createMock<Prisma>({
    player: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  });

  describe("nextIdentity", () => {
    it("should return a new PlayerId", () => {
      const id = "id";
      jest.spyOn(uuid, "v4").mockReturnValue(id);

      const repository = new PlayersRepository(prisma);
      const playerId = repository.nextIdentity();

      expect(playerId).toEqual(PlayerId.of(id));
    });
  });

  describe("byId", () => {
    it("should return the Player when it exists", async () => {
      const player = createMock<PlayerGetPayload>({
        id: "id",
        email: "player@example.com",
      });

      jest.spyOn(prisma.player, "findUnique").mockResolvedValue(player);

      const expectedPlayer = PlayerFactory.create(player);

      const repository = new PlayersRepository(prisma);
      const actual = await repository.byId(PlayerId.of("id"));

      expect(prisma.player.findUnique).toHaveBeenCalledWith({
        where: {
          id: "id",
        },
      });
      expect(actual).toEqual(expectedPlayer);
    });

    it("should return null when the Player does not exist", async () => {
      jest.spyOn(prisma.player, "findUnique").mockResolvedValue(null);

      const repository = new PlayersRepository(prisma);
      const actual = await repository.byId(PlayerId.of("id"));

      expect(prisma.player.findUnique).toHaveBeenCalledWith({
        where: {
          id: "id",
        },
      });
      expect(actual).toBeNull();
    });
  });

  describe("persist", () => {
    it("should persist the player", async () => {
      const player = new Player(PlayerId.of("id"), "player@example.com");

      const repository = new PlayersRepository(prisma);
      await repository.persist(player);

      expect(prisma.player.create).toHaveBeenCalledWith({
        data: {
          id: player.id.value,
          email: player.email,
        },
      });
    });
  });
});
