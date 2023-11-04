import { createMock } from "../../../test/utils";
import { Game } from "../../domain/entities";
import { Failure, Success } from "../../domain/shared/Result";
import { GameId } from "../../domain/values/GameId";
import { PlayerId } from "../../domain/values/PlayerId";
import { GamesRepository } from "../../infrastructure/repositories/Games.repository";
import { JoinGame, JoinGameCommandHandler } from "./JoinGame.command";

describe("JoinGameCommandHandler", () => {
  describe("execute", () => {
    const games = createMock<GamesRepository>({
      byId: jest.fn(),
    });

    const gameId = GameId.of("id");
    const playerId = PlayerId.of("playerId");
    const command = new JoinGame(gameId, playerId);

    it("should get a Game with the given GameId", async () => {
      const game = createMock<Game>({
        playerJoin: jest.fn(),
      });

      jest.spyOn(games, "byId").mockResolvedValue(Success.of(game));

      const commandHandler = new JoinGameCommandHandler(games);

      await commandHandler.execute(command);

      expect(games.byId).toHaveBeenCalledWith(gameId);
    });

    it("should return a failure when the Game does not exist", async () => {
      jest
        .spyOn(games, "byId")
        .mockResolvedValue(Failure.of(new Error("Game not found")));

      const commandHandler = new JoinGameCommandHandler(games);

      const actual = await commandHandler.execute(command);

      expect(actual.isFailure()).toBeTruthy();
    });

    it("should join a Player to the Game", async () => {
      const game = createMock<Game>({
        playerJoin: jest.fn(),
      });

      jest.spyOn(games, "byId").mockResolvedValue(Success.of(game));

      const commandHandler = new JoinGameCommandHandler(games);

      await commandHandler.execute(command);

      expect(game.playerJoin).toHaveBeenCalledWith(playerId);
    });
  });
});
