import { Player } from ".";
import { NewGameCreated } from "../events/NewGameCreated";
import { PlayerJoined } from "../events/PlayerJoined";
import { Board } from "../values/Board";
import { GameId } from "../values/GameId";
import { PlayerId } from "../values/PlayerId";
import { Game } from "./Game";

describe("Game", () => {
  describe("new", () => {
    it("given an id and a Board, when created, then it should publish a NewGameCreated event", () => {
      const id = GameId.of("id");
      const board = Board.of();

      const game = Game.new(id, board);

      expect(game.getDomainEvents()).toContainEqual(new NewGameCreated(id));
    });
  });

  describe("playerJoin", () => {
    it("given a player, when joined, then it should add the player to the game", () => {
      const id = GameId.of("id");
      const board = Board.of();

      const playerOne = new Player(
        PlayerId.of("playerOneId"),
        "player.one@example.com"
      );
      const playerTwo = new Player(
        PlayerId.of("playerTwoId"),
        "player.two@example.com"
      );

      const game = new Game(id, board);
      game.playerJoin(playerOne);

      expect(game.getPlayerOne()).toEqual(playerOne);

      game.playerJoin(playerTwo);

      expect(game.getPlayerTwo()).toEqual(playerTwo);
    });

    it("given a player, when joined, then it should not add the player to the game if the game is full", () => {
      const id = GameId.of("id");
      const board = Board.of();

      const playerOne = new Player(
        PlayerId.of("playerOneId"),
        "player.one@example.com"
      );
      const playerTwo = new Player(
        PlayerId.of("playerTwoId"),
        "player.two@example.com"
      );
      const playerThree = new Player(
        PlayerId.of("playerTwoId"),
        "player.two@example.com"
      );

      const game = new Game(id, board);
      game.playerJoin(playerOne);
      game.playerJoin(playerTwo);

      const actual = game.playerJoin(playerThree);

      expect(actual.isFailure()).toBeTruthy();
    });

    it("given a player, when joined, then it should publish a PlayerJoined event", () => {
      const id = GameId.of("id");
      const board = Board.of();
      const player = new Player(PlayerId.of("playerId"), "player@example.com");

      const game = new Game(id, board);
      game.playerJoin(player);

      expect(game.getDomainEvents()).toContainEqual(
        new PlayerJoined(game.id, player.id)
      );
    });
  });
});
