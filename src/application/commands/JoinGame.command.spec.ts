import { EventBus } from "@nestjs/cqrs";
import { createMock } from "../../../test/utils";
import { Game, Player } from "../../domain/entities";
import { GameId } from "../../domain/values/GameId";
import { PlayerId } from "../../domain/values/PlayerId";
import { GamesRepository } from "../../infrastructure/repositories/Games.repository";
import { JoinGame, JoinGameCommandHandler } from "./JoinGame.command";
import { PlayerJoined } from "../../domain/events/PlayerJoined";
import { PlayersRepository } from "../../infrastructure/repositories/Players.repository";
import { Failure, Success } from "../../domain/shared/Result";

describe("JoinGameCommandHandler", () => {
  describe("execute", () => {
    const games = createMock<GamesRepository>({
      byId: jest.fn(),
      persist: jest.fn(),
    });

    const players = createMock<PlayersRepository>({
      byId: jest.fn(),
    });

    const eventBus = createMock<EventBus>({
      publishAll: jest.fn(),
    });

    const gameId = GameId.of("id");
    const playerId = PlayerId.of("playerId");
    const command = new JoinGame(gameId, playerId);

    it("should get the Player with the given PlayerId", async () => {
      const game = createMock<Game>({
        playerJoin: jest.fn(),
        getDomainEvents: jest.fn(),
      });

      jest.spyOn(games, "byId").mockResolvedValue(game);

      const commandHandler = new JoinGameCommandHandler(
        games,
        players,
        eventBus
      );

      await commandHandler.execute(command);

      expect(players.byId).toHaveBeenCalledWith(playerId);
    });

    it("should return a failure when the Player does not exist", async () => {
      jest.spyOn(players, "byId").mockResolvedValue(null);

      const commandHandler = new JoinGameCommandHandler(
        games,
        players,
        eventBus
      );

      const actual = await commandHandler.execute(command);

      expect(actual.isFailure()).toBeTruthy();
    });

    it("should get a Game with the given GameId", async () => {
      const game = createMock<Game>({
        playerJoin: jest.fn().mockReturnValue(Success.of(undefined)),
        getDomainEvents: jest.fn(),
      });

      const player = createMock<Player>({
        id: playerId,
      });

      jest.spyOn(players, "byId").mockResolvedValue(player);
      jest.spyOn(games, "byId").mockResolvedValue(game);

      const commandHandler = new JoinGameCommandHandler(
        games,
        players,
        eventBus
      );

      await commandHandler.execute(command);

      expect(games.byId).toHaveBeenCalledWith(gameId);
    });

    it("should return a failure when the Game does not exist", async () => {
      const player = createMock<Player>({
        id: playerId,
      });

      jest.spyOn(players, "byId").mockResolvedValue(player);
      jest.spyOn(games, "byId").mockResolvedValue(null);

      const commandHandler = new JoinGameCommandHandler(
        games,
        players,
        eventBus
      );

      const actual = await commandHandler.execute(command);

      expect(actual.isFailure()).toBeTruthy();
    });

    it("should join a Player to the Game", async () => {
      const game = createMock<Game>({
        playerJoin: jest.fn().mockReturnValue(Success.of(undefined)),
        getDomainEvents: jest.fn(),
      });

      const player = createMock<Player>({
        id: playerId,
      });

      jest.spyOn(players, "byId").mockResolvedValue(player);
      jest.spyOn(games, "byId").mockResolvedValue(game);

      const commandHandler = new JoinGameCommandHandler(
        games,
        players,
        eventBus
      );

      await commandHandler.execute(command);

      expect(game.playerJoin).toHaveBeenCalledWith(playerId);
    });

    it("should return a failure if the Player cannot join the Game", async () => {
      const game = createMock<Game>({
        playerJoin: jest
          .fn()
          .mockReturnValue(Failure.of(new Error("Game is full"))),
        getDomainEvents: jest.fn(),
      });

      const player = createMock<Player>({
        id: playerId,
      });

      jest.spyOn(players, "byId").mockResolvedValue(player);
      jest.spyOn(games, "byId").mockResolvedValue(game);

      const commandHandler = new JoinGameCommandHandler(
        games,
        players,
        eventBus
      );

      const actual = await commandHandler.execute(command);

      expect(actual.isFailure()).toBeTruthy();
    });

    it("should persist the Game", async () => {
      const game = createMock<Game>({
        playerJoin: jest.fn().mockReturnValue(Success.of(undefined)),
        getDomainEvents: jest.fn(),
      });

      const player = createMock<Player>({
        id: playerId,
      });

      jest.spyOn(players, "byId").mockResolvedValue(player);
      jest.spyOn(games, "byId").mockResolvedValue(game);

      const commandHandler = new JoinGameCommandHandler(
        games,
        players,
        eventBus
      );

      await commandHandler.execute(command);

      expect(games.persist).toHaveBeenCalledWith(game);
    });

    it("should publish all Game domain events", async () => {
      const game = createMock<Game>({
        playerJoin: jest.fn().mockReturnValue(Success.of(undefined)),
        getDomainEvents: jest
          .fn()
          .mockReturnValue([new PlayerJoined(gameId, playerId)]),
      });

      const player = createMock<Player>({
        id: playerId,
      });

      jest.spyOn(players, "byId").mockResolvedValue(player);
      jest.spyOn(games, "byId").mockResolvedValue(game);

      const commandHandler = new JoinGameCommandHandler(
        games,
        players,
        eventBus
      );

      await commandHandler.execute(command);

      expect(eventBus.publishAll).toHaveBeenCalledWith([
        new PlayerJoined(gameId, playerId),
      ]);
    });
  });
});
