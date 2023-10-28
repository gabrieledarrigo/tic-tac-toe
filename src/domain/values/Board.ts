import { Failure, Result, Success } from "../../types";

export enum Mark {
  X = "X",
  O = "O",
}

export type EmptyCell = "";

export type Cell = EmptyCell | Mark;

export class Board {
  private readonly board: Cell[][];

  private constructor() {
    this.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  }

  public static of(): Board {
    return new Board();
  }

  public getBoard(): Cell[][] {
    return this.board;
  }

  public cell(row: number, column: number): Cell {
    return this.board[row][column];
  }

  public isEmpty(): boolean {
    return this.board.every((row) => row.every((cell) => cell === ""));
  }

  public isFull(): boolean {
    return this.board.every((row) => row.every((cell) => cell !== ""));
  }

  public place(row: number, column: number, mark: Mark): Result<void> {
    if (row < 0 || row > 2) {
      return Failure.of(new Error("Row is out of bounds"));
    }

    if (column < 0 || column > 2) {
      return Failure.of(new Error("Column is out of bounds"));
    }

    if (this.cell(row, column) !== "") {
      return Failure.of(new Error("Cell is not empty"));
    }

    this.board[row][column] = mark;

    return Success.of(undefined);
  }
}
