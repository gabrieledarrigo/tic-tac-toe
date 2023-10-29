import { NewGameCreated } from "../events/NewGameCreated";
import { Board } from "../values/Board";
import { Game } from "./Game";

describe("Game", () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date());
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("given an id and a board, then it should publish a NewGameCreated event", () => {
    const id = "id";
    const board = Board.of();

    const game = new Game("id", board);

    console.log(game);

    expect(game.getDomainEvents()).toContainEqual(
      new NewGameCreated(id, board)
    );
  });
});
