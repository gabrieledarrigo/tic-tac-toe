import { EventBus } from "@nestjs/cqrs";
import { Game } from "../../domain/entities";
import { Board } from "../../domain/values/Board";
import { GameId } from "../../domain/values/GameId";
import { GamesRepository } from "../../infrastructure/repositories/Games.repository";
import { NewGame, NewGameCommandHandler } from "./NewGame.command";
import { NewGameCreated } from "../../domain/events/NewGameCreated";
import { createMock } from "../../../test/utils";

describe("NewGameCommandHandler", () => {
  describe("execute", () => {
    const games = createMock<GamesRepository>({
      nextIdentity: jest.fn(),
      persist: jest.fn(),
    });

    const eventBus = createMock<EventBus>({
      publishAll: jest.fn(),
    });

    const gameId = GameId.of("id");

    beforeEach(() => {
      jest.spyOn(games, "nextIdentity").mockReturnValue(gameId);
      jest.spyOn(Game, "new");
    });

    it("should create and persist a new Game", async () => {
      const commandHandler = new NewGameCommandHandler(games, eventBus);

      await commandHandler.execute(new NewGame());

      expect(games.nextIdentity).toHaveBeenCalled();
      expect(Game.new).toHaveBeenCalledWith(gameId, Board.of());
      expect(games.persist).toHaveBeenCalledWith(Game.new(gameId, Board.of()));
    });

    it("should publish all Game domain events", async () => {
      const commandHandler = new NewGameCommandHandler(games, eventBus);

      await commandHandler.execute(new NewGame());

      expect(eventBus.publishAll).toHaveBeenCalledWith([
        new NewGameCreated(gameId),
      ]);
    });

    it("should return the new GameId", async () => {
      const commandHandler = new NewGameCommandHandler(games, eventBus);

      const actual = await commandHandler.execute(new NewGame());

      expect(actual.unwrap()).toEqual(gameId);
    });
  });
});
