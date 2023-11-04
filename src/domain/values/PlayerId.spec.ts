import { PlayerId } from "./PlayerId";

describe("PlayerId", () => {
  describe("of", () => {
    it("encapsulate a string identifier", () => {
      const id = "id";

      const actual = PlayerId.of(id);

      expect(actual.value).toEqual(id);
    });
  });

  describe("equals", () => {
    it("should be equal to another PlayerId with the same value", () => {
      const id = "id";

      const actual = PlayerId.of(id);
      const expected = PlayerId.of(id);

      expect(actual.equals(expected)).toBe(true);
    });

    it("should not be equal to another PlayerId with a different value", () => {
      const actual = PlayerId.of("id");
      const expected = PlayerId.of("anotherId");

      expect(actual.equals(expected)).toBe(false);
    });
  });
});
