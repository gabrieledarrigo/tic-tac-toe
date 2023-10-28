import { Board, Mark } from "./Board";

describe("Board", () => {
  it("should be empty when created", () => {
    const board = Board.of();
    const actual = board.getBoard();

    expect(actual).toEqual([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
  });

  describe("cell", () => {
    it("should return the cell value", () => {
      const board = Board.of();
      const actual = board.cell(0, 0);

      expect(actual).toEqual("");
    });
  });

  describe("isEmpty", () => {
    it("should return true when the board is empty", () => {
      const board = Board.of();
      const actual = board.isEmpty();

      expect(actual).toEqual(true);
    });

    it("should return false when the board is not empty", () => {
      const board = Board.of();
      board.place(0, 0, Mark.X);
      const actual = board.isEmpty();

      expect(actual).toEqual(false);
    });
  });

  describe("isFull", () => {
    it("should return true when the board is full", () => {
      const board = Board.of();
      board.place(0, 0, Mark.X);
      board.place(0, 1, Mark.O);
      board.place(0, 2, Mark.X);
      board.place(1, 0, Mark.O);
      board.place(1, 1, Mark.X);
      board.place(1, 2, Mark.O);
      board.place(2, 0, Mark.X);
      board.place(2, 1, Mark.O);
      board.place(2, 2, Mark.X);
      const actual = board.isFull();

      expect(actual).toEqual(true);
    });

    it("should return false when the board is not full", () => {
      const board = Board.of();
      board.place(0, 0, Mark.X);
      const actual = board.isFull();

      expect(actual).toEqual(false);
    });
  });

  describe("place", () => {
    it("should place a Mark on the board within the given row and column coordinates", () => {
      const board = Board.of();
      board.place(0, 0, Mark.X);

      const actual = board.getBoard();

      expect(actual).toEqual([
        [Mark.X, "", ""],
        ["", "", ""],
        ["", "", ""],
      ]);
    });

    it("should return an error when the row is out of bounds", () => {
      const board = Board.of();
      const actual = board.place(3, 0, Mark.X);

      expect(actual).toEqual({
        error: new Error("Row is out of bounds"),
      });
    });

    it("should return an error when the column is out of bounds", () => {
      const board = Board.of();
      const actual = board.place(0, 3, Mark.X);

      expect(actual).toEqual({
        error: new Error("Column is out of bounds"),
      });
    });

    it("should return an error when the cell is not empty", () => {
      const board = Board.of();
      board.place(0, 0, Mark.X);
      const actual = board.place(0, 0, Mark.O);

      expect(actual).toEqual({
        error: new Error("Cell is not empty"),
      });
    });
  });
});
