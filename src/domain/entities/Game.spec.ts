import { Board } from "../values/Board";
import { Game } from "./Game";

describe("Game", () => {
  it("has an id and a Board", () => {
    const id = "id";
    const board = Board.of();

    const game = new Game("id", board);

    expect(game.id).toBe(id);
    expect(game.board).toBe(board);
  });
});
