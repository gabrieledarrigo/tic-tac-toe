import { BadRequestException } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { NewPlayerRequest } from "../dtos/NewPlayerRequest.dto";
import { NewPlayerResponse } from "../dtos/NewPlayerResponse.dto";
import { PlayersController } from "./Players.controller";
import { createMock } from "../../../test/utils";
import { PlayerId } from "../../domain/values/PlayerId";
import { Failure, Success } from "../../domain/shared/Result";

describe("PlayersController", () => {
  const commandBus: CommandBus = createMock<CommandBus>({
    execute: jest.fn(),
  });

  let playersController: PlayersController;

  beforeEach(() => {
    playersController = new PlayersController(commandBus);
  });

  describe("newPlayer", () => {
    it("should create a new player and return the response", async () => {
      const playerId = PlayerId.of("playerId");

      jest.spyOn(commandBus, "execute").mockResolvedValue(Success.of(playerId));

      const newPlayerRequest: NewPlayerRequest = {
        email: "playerOne@example.com",
      };

      const actual = await playersController.newPlayer(newPlayerRequest);

      expect(actual).toEqual(new NewPlayerResponse(playerId));
    });

    it("should throw BadRequestException if the command execution fails", async () => {
      const error = new Error("Invalid email address");

      jest.spyOn(commandBus, "execute").mockResolvedValue(Failure.of(error));

      const newPlayerRequest: NewPlayerRequest = {
        email: "invalid-email",
      };

      await expect(playersController.newPlayer(newPlayerRequest)).rejects.toThrow(
        new BadRequestException(error),
      );
    });
  });
});
