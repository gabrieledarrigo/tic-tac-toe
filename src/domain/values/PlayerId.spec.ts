import { PlayerId } from "./PlayerId";

describe("PlayerId", () => {
  it("encapsulate a string identifier", () => {
    const id = "id";

    const actual = PlayerId.of(id);

    expect(actual.value).toEqual(id);
  });
});
