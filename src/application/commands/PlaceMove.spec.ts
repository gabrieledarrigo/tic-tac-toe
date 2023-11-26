import { PlaceMove, PlaceMoveCommandHandler } from "./PlaceMove";
import { GamesRepository } from "../../infrastructure/repositories/Games.repository";
import { createMock } from "../../../test/utils";
import { Failure, Success } from "../../domain/shared/Result";
import { GameId } from "../../domain/values/GameId";
import { PlayerId } from "../../domain/values/PlayerId";
import { Game, Mark, Move } from "../../domain/entities";
import { GameState } from "../../domain/values/GameState";
import { PlayerMoved } from "../../domain/events/PlayerMoved";
import { EventBus } from "@nestjs/cqrs";
import { MoveId } from "../../domain/values/MoveId";

describe("PlaceMove", () => {
  const games = createMock<GamesRepository>({
    byId: jest.fn(),
    persist: jest.fn(),
    nextMoveIdentity: jest.fn(),
  });

  const eventBus = createMock<EventBus>({
    publishAll: jest.fn(),
  });

  const gameId = GameId.of("id");
  const playerId = PlayerId.of("playerId");
  const command = new PlaceMove(gameId, playerId, 0, 0, Mark.X);

  describe("execute", () => {
    it("should get a Game from the repository with the given GameId", async () => {
      const game = createMock<Game>({
        id: gameId,
        place: jest.fn().mockReturnValue(Success.of(GameState.of("Draw"))),
        pullDomainEvents: jest.fn(),
      });

      jest.spyOn(games, "byId").mockResolvedValue(game);

      const commandHandler = new PlaceMoveCommandHandler(games, eventBus);
      await commandHandler.execute(command);

      expect(games.byId).toHaveBeenCalledWith(gameId);
    });

    it("should return a failure when the Game does not exist", async () => {
      jest.spyOn(games, "byId").mockResolvedValue(null);

      const commandHandler = new PlaceMoveCommandHandler(games, eventBus);
      const result = await commandHandler.execute(command);

      expect(result.isFailure()).toBe(true);
      expect(result).toEqual({
        error: new Error(`Game with id ${gameId.value} does not exist`),
      });
    });

    it("should place a Move on the Game", async () => {
      const game = createMock<Game>({
        id: gameId,
        place: jest.fn().mockReturnValue(Success.of(GameState.of("Draw"))),
        pullDomainEvents: jest.fn(),
      });

      const moveId = MoveId.of("moveId");

      jest.spyOn(games, "byId").mockResolvedValue(game);
      jest.spyOn(games, "nextMoveIdentity").mockReturnValue(moveId);

      const commandHandler = new PlaceMoveCommandHandler(games, eventBus);
      await commandHandler.execute(command);

      expect(game.place).toHaveBeenCalledWith(
        new Move(
          moveId,
          command.gameId,
          command.playerId,
          command.row,
          command.column,
          command.mark,
        ),
      );
    });

    it("should return a failure when the Move cannot be placed", async () => {
      const failure = Failure.of(new Error("Invalid move"));

      const game = createMock<Game>({
        id: gameId,
        place: jest.fn().mockReturnValue(failure),
        pullDomainEvents: jest.fn(),
      });

      jest.spyOn(games, "byId").mockResolvedValue(game);

      const commandHandler = new PlaceMoveCommandHandler(games, eventBus);
      const actual = await commandHandler.execute(command);

      expect(actual.isFailure()).toBe(true);
      expect(actual).toEqual(failure);
    });

    it("should persist the Game", async () => {
      const game = createMock<Game>({
        id: gameId,
        place: jest.fn().mockReturnValue(Success.of(GameState.of("Draw"))),
        pullDomainEvents: jest.fn(),
      });

      jest.spyOn(games, "byId").mockResolvedValue(game);

      const commandHandler = new PlaceMoveCommandHandler(games, eventBus);
      await commandHandler.execute(command);

      expect(games.persist).toHaveBeenCalledWith(game);
    });

    it("should publish all Game domain events", async () => {
      const game = createMock<Game>({
        id: gameId,
        place: jest.fn().mockReturnValue(Success.of(GameState.of("Draw"))),
        pullDomainEvents: jest
          .fn()
          .mockReturnValue([new PlayerMoved(gameId, playerId, MoveId.of("moveId"))]),
      });

      jest.spyOn(games, "byId").mockResolvedValue(game);

      const commandHandler = new PlaceMoveCommandHandler(games, eventBus);
      await commandHandler.execute(command);

      expect(game.pullDomainEvents).toHaveBeenCalled();
      expect(eventBus.publishAll).toHaveBeenCalledWith([
        new PlayerMoved(gameId, playerId, MoveId.of("moveId")),
      ]);
    });
  });
});
