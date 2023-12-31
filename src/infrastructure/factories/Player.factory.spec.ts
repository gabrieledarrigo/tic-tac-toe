import { PlayerFactory } from "./Player.factory";
import { Player } from "../../domain/entities/Player";
import { PlayerId } from "../../domain/values/PlayerId";
import { createMock } from "../../../test/utils";
import { PlayerGetPayload as RepositoryPlayer } from "../repositories/types";
import { Email } from "../../domain/values/Email";

describe("PlayerFactory", () => {
  describe("create", () => {
    it("should create a new Player", () => {
      const repositoryPlayer = createMock<RepositoryPlayer>({
        id: "playerId",
        email: "player@example.com",
      });

      const expectedPlayer = new Player(
        PlayerId.of(repositoryPlayer.id),
        Email.of(repositoryPlayer.email),
      );

      const player = PlayerFactory.create(repositoryPlayer);

      expect(player).toEqual(expectedPlayer);
    });
  });
});
