import { Game } from "../../domain/entities";
import { Games } from "../../domain/repositories/Games";
import { Board } from "../../domain/values/Board";
import { GameId } from "../../domain/values/GameId";
import { GamesRepository } from "../../infrastructure/repositories/Games.repository";
import { NewGame, NewGameCommandHandler } from "./NewGame.command";

describe("NewGameCommandHandler", () => {
  describe("execute", () => {
    const games = {
      nextIdentity: jest.fn(),
      persist: jest.fn(),
    } as any as GamesRepository;

    const gameId = GameId.of("id");

    beforeEach(() => {
      jest.spyOn(games, "nextIdentity").mockReturnValue(gameId);
    });

    it("should create and persist a new Game", async () => {
      const commandHandler = new NewGameCommandHandler(games);

      await commandHandler.execute(new NewGame());

      expect(games.nextIdentity).toHaveBeenCalled();
      expect(games.persist).toHaveBeenCalledWith(new Game(gameId, Board.of()));
    });

    it("should return the new GameId", async () => {
      const commandHandler = new NewGameCommandHandler(games);

      const actual = await commandHandler.execute(new NewGame());

      expect(actual.unwrap()).toEqual(gameId);
    });
  });
});
