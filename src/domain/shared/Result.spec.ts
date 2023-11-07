import { Failure, Success } from "./Result";

describe("Result", () => {
  describe("Failure", () => {
    describe("isSuccess", () => {
      it("should return false", () => {
        const actual = Failure.of(new Error("Something went wrong"));

        expect(actual.isSuccess()).toBe(false);
      });
    });

    describe("isFailure", () => {
      it("should return true", () => {
        const actual = Failure.of(new Error("Something went wrong"));

        expect(actual.isFailure()).toBe(true);
      });
    });

    describe("unwrap", () => {
      it("should throw the error passed to the constructor", () => {
        const error = new Error("Something went wrong");
        const actual = Failure.of(error);

        expect(() => actual.unwrap()).toThrow(error);
      });
    });

    it("should call the provided function with the Error passed as an argument", () => {
      const error = new Error("Something went wrong");
      const failure = Failure.of(error);
      const orElse = jest.fn();

      const result = failure.unwrapOrElse(orElse);

      expect(orElse).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });
  });

  describe("Success", () => {
    describe("isSuccess", () => {
      it("should return true", () => {
        const actual = Success.of("Hello, world!");

        expect(actual.isSuccess()).toBe(true);
      });
    });

    describe("isFailure", () => {
      it("should return false", () => {
        const actual = Success.of("Hello, world!");

        expect(actual.isFailure()).toBe(false);
      });
    });

    describe("unwrap", () => {
      it("should return the value passed to the constructor", () => {
        const value = "Hello, world!";
        const actual = Success.of(value);

        expect(actual.unwrap()).toBe(value);
      });
    });

    describe("unwrapOrElse", () => {
      it("should return the value passed to the constructor", () => {
        const value = "Hello, world!";
        const success = Success.of(value);
        const orElse = jest.fn();

        const result = success.unwrapOrElse(orElse);

        expect(orElse).not.toHaveBeenCalled();
        expect(result).toBe(value);
      });
    });
  });
});
