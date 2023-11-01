import { GameId } from "./GameId";

describe("GameId", () => {
  it("encapsulate a string identifier", () => {
    const id = "id";

    const actual = GameId.of(id);

    expect(actual.value).toEqual(id);
  });
});
