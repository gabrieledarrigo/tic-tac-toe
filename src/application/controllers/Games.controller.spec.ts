import { BadRequestException } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Failure, Result, Success } from "../../domain/shared/Result";
import { GameId } from "../../domain/values/GameId";
import { GameState } from "../../domain/values/GameState";
import { JoinGameRequest } from "../dtos/JoinGameRequest.dto";
import { NewGameRequest } from "../dtos/NewGameRequest.dto";
import { NewGameResponse } from "../dtos/NewGameResponse.dto";
import { PlaceMoveRequest } from "../dtos/PlaceMoveRequest.dto";
import { PlaceMoveResponse } from "../dtos/PlaceMoveResponse.dto";
import { GamesController } from "./Games.controller";
import { createMock } from "../../../test/utils";
import { Mark } from "../../domain/entities";

describe("GamesController", () => {
  let gamesController: GamesController;

  const commandBus: CommandBus = createMock<CommandBus>({
    execute: jest.fn(),
  });

  beforeEach(() => {
    gamesController = new GamesController(commandBus);
  });

  describe("newGame", () => {
    it("should create a new game and return the response", async () => {
      const gameId = GameId.of("gameId");

      jest.spyOn(commandBus, "execute").mockResolvedValue(Success.of(gameId));

      const newGameRequest = createMock<NewGameRequest>({
        playerOneId: "playerOneId",
      });

      const actual = await gamesController.newGame(newGameRequest);

      expect(actual).toEqual(new NewGameResponse(gameId));
    });

    it("should throw BadRequestException if the command execution fails", async () => {
      const error = new Error("Player with id playerOneId not found");

      jest.spyOn(commandBus, "execute").mockResolvedValue(Failure.of(error));

      const newGameRequest = createMock<NewGameRequest>({
        playerOneId: "playerOneId",
      });

      await expect(gamesController.newGame(newGameRequest)).rejects.toThrow(
        new BadRequestException(error.message),
      );
    });
  });

  describe("joinGame", () => {
    it("should join an existing game", async () => {
      jest.spyOn(commandBus, "execute").mockResolvedValue(Success.of(undefined));

      const gameId = "gameId";
      const joinGameRequest: JoinGameRequest = {
        playerId: "playerId",
      };

      const result = await gamesController.joinGame(gameId, joinGameRequest);

      expect(result).toBeUndefined();
    });

    it("should throw BadRequestException if the command execution fails", async () => {
      const error = new Error("Game is full.");

      jest.spyOn(commandBus, "execute").mockResolvedValue(Failure.of(error));

      const gameId = "gameId";
      const joinGameRequest: JoinGameRequest = {
        playerId: "playerId",
      };

      await expect(
        gamesController.joinGame(gameId, joinGameRequest),
      ).rejects.toThrow(new BadRequestException(error.message));
    });
  });

  describe("placeMove", () => {
    it("should place a move and return the response", async () => {
      const gameState = createMock<GameState>({
        state: "In Progress",
      });

      jest.spyOn(commandBus, "execute").mockResolvedValue(Success.of(gameState));

      const gameId = "gameId";
      const placeMoveRequest: PlaceMoveRequest = {
        playerId: "playerId",
        row: 0,
        column: 0,
        mark: Mark.X,
      };

      const actual = await gamesController.placeMove(gameId, placeMoveRequest);

      expect(actual).toEqual(new PlaceMoveResponse(gameState));
    });

    it("should throw BadRequestException if the command execution fails", async () => {
      const error = new Error("Invalid move");

      jest.spyOn(commandBus, "execute").mockResolvedValue(Failure.of(error));

      const gameId = "gameId";
      const placeMoveRequest: PlaceMoveRequest = {
        playerId: "playerId",
        row: 0,
        column: 0,
        mark: Mark.X,
      };

      await expect(
        gamesController.placeMove(gameId, placeMoveRequest),
      ).rejects.toThrow(new BadRequestException(error.message));
    });
  });
});
