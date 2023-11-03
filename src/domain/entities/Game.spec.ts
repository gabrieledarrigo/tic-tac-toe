import { NewGameCreated } from "../events/NewGameCreated";
import { Board } from "../values/Board";
import { GameId } from "../values/GameId";
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
});
