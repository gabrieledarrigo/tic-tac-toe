import { NewGameCreated } from "../events/NewGameCreated";
import { PlayerJoined } from "../events/PlayerJoined";
import { GameId } from "../values/GameId";
import { PlayerId } from "../values/PlayerId";
import { Game } from "./Game";

describe("Game", () => {
  describe("new", () => {
    it("given an id and a Board, when created, then it should publish a NewGameCreated event", () => {
      const id = GameId.of("id");

      const game = Game.new(id);

      expect(game.getDomainEvents()).toContainEqual(new NewGameCreated(id));
    });
  });

  describe("playerJoin", () => {
    it("given a PlayerId, when joined, then it should add it to the game", () => {
      const id = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const game = new Game(id);
      game.playerJoin(playerOneId);

      expect(game.getPlayerOneId()).toEqual(playerOneId);

      game.playerJoin(playerTwoId);

      expect(game.getPlayerTwoId()).toEqual(playerTwoId);
    });

    it("given a PlayerId, when joined, then it should not add the player to the game if the player is already in the game as the player one", () => {
      const id = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const game = new Game(id);
      game.playerJoin(playerOneId);
      game.playerJoin(playerTwoId);

      const actual = game.playerJoin(playerTwoId);

      expect(actual.isSuccess()).toBeTruthy();
    });

    it("given a PlayerId, when joined, then it should not add the player to the game if the player is already in the game as the player two", () => {
      const id = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");

      const game = new Game(id);
      game.playerJoin(playerOneId);

      const actual = game.playerJoin(playerOneId);

      expect(actual.isSuccess()).toBeTruthy();
    });

    it("given a player, when joined, then it should not add the player to the game if the game is full", () => {
      const id = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");
      const playerThreeId = PlayerId.of("playerThreeId");

      const game = new Game(id);
      game.playerJoin(playerOneId);
      game.playerJoin(playerTwoId);

      const actual = game.playerJoin(playerThreeId);

      expect(actual.isFailure()).toBeTruthy();
    });

    it("given a player, when joined, then it should publish a PlayerJoined event", () => {
      const id = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");

      const game = new Game(id);
      game.playerJoin(playerOneId);

      expect(game.getDomainEvents()).toContainEqual(
        new PlayerJoined(game.id, playerOneId)
      );
    });
  });
});
