import { NewGameCreated } from "../events/NewGameCreated";
import { Board } from "../values/Board";
import { GameId } from "../values/GameId";
import { Game } from "./Game";

describe("Game", () => {
  it("given an id and a Board, then it should publish a NewGameCreated event", () => {
    const id = GameId.of("id");
    const board = Board.of();

    const game = new Game(id, board);

    expect(game.getDomainEvents()).toContainEqual(
      new NewGameCreated(id, board)
    );
  });
});
