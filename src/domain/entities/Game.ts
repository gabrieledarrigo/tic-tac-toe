import { AggregateRoot } from "../shared/AggregateRoot";
import { NewGameCreated } from "../events/NewGameCreated";
import { GameId } from "../values/GameId";
import { PlayerJoined } from "../events/PlayerJoined";
import { Failure, Result, Success } from "../shared/Result";
import { PlayerId } from "../values/PlayerId";
import { Move, RowOrColumnValue } from "./Move";
import { GameState } from "../values/GameState";

export type Cell = Move | null;

export type Board = [
  [Cell, Cell, Cell],
  [Cell, Cell, Cell],
  [Cell, Cell, Cell]
];

export type Moves =
  | []
  | [Move]
  | [Move, Move]
  | [Move, Move, Move]
  | [Move, Move, Move, Move]
  | [Move, Move, Move, Move, Move]
  | [Move, Move, Move, Move, Move, Move]
  | [Move, Move, Move, Move, Move, Move, Move]
  | [Move, Move, Move, Move, Move, Move, Move, Move]
  | [Move, Move, Move, Move, Move, Move, Move, Move, Move];

export class Game extends AggregateRoot {
  private readonly board: Board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  private currentPlayer?: PlayerId;

  public constructor(
    public readonly id: GameId,
    private playerOneId?: PlayerId,
    private playerTwoId?: PlayerId,
    moves: Moves = []
  ) {
    super();

    moves.forEach((move) => {
      this.board[move.row][move.column] = move;
    });
  }

  public static new(id: GameId): Game {
    const game = new Game(id);
    game.apply(new NewGameCreated(id));

    return game;
  }

  public playerJoin(playerId: PlayerId): Result<void> {
    if (this.isFull()) {
      if (
        this.playerOneId?.equals(playerId) ||
        this.playerTwoId?.equals(playerId)
      ) {
        return Success.of(undefined);
      }

      return Failure.of(new Error("Game is full"));
    }

    if (!this.playerOneId) {
      this.playerOneId = playerId;
    } else if (this.playerOneId.equals(playerId)) {
      return Success.of(undefined);
    } else {
      this.playerTwoId = playerId;
    }

    this.apply(new PlayerJoined(this.id, playerId));

    return Success.of(undefined);
  }

  public getPlayerOneId(): PlayerId | undefined {
    return this.playerOneId;
  }

  public getPlayerTwoId(): PlayerId | undefined {
    return this.playerTwoId;
  }

  public getBoard(): Board {
    return this.board;
  }

  public boardIsEmpty(): boolean {
    return this.board.every((row) => row.every((cell) => cell === null));
  }

  public boardIsFull(): boolean {
    return this.board.every((row) => row.every((cell) => cell !== null));
  }

  public getCell(row: RowOrColumnValue, column: RowOrColumnValue): Cell {
    return this.board[row][column];
  }

  public place(move: Move): Result<GameState> {
    const { row, column, playerId } = move;

    if (row < 0 || row > 2) {
      return Failure.of(new Error("Row is out of bounds"));
    }

    if (column < 0 || column > 2) {
      return Failure.of(new Error("Column is out of bounds"));
    }

    if (this.getCell(row, column) !== null) {
      if (this.boardIsFull()) {
        return Failure.of(new Error("Game is ended"));
      }

      return Failure.of(new Error("Cell is not empty"));
    }

    this.board[row][column] = move;
    this.currentPlayer = playerId;

    return Success.of(this.gameStatus());
  }

  private isFull(): boolean {
    return !!this.playerOneId && !!this.playerTwoId;
  }

  private gameStatus(): GameState {
    // Check for horizontal win
    if (
      (this.checkMarksAreEquals([0, 0], [0, 1]) &&
        this.checkMarksAreEquals([0, 1], [0, 2])) ||
      (this.checkMarksAreEquals([1, 0], [1, 1]) &&
        this.checkMarksAreEquals([1, 1], [1, 2])) ||
      (this.checkMarksAreEquals([2, 0], [2, 1]) &&
        this.checkMarksAreEquals([2, 1], [2, 2]))
    ) {
      return GameState.of("Horizontal Win", this.currentPlayer);
    }

    // Check for vertical win
    if (
      (this.checkMarksAreEquals([0, 0], [1, 0]) &&
        this.checkMarksAreEquals([1, 0], [2, 0])) ||
      (this.checkMarksAreEquals([0, 1], [1, 1]) &&
        this.checkMarksAreEquals([1, 1], [2, 1])) ||
      (this.checkMarksAreEquals([0, 2], [1, 2]) &&
        this.checkMarksAreEquals([1, 2], [2, 2]))
    ) {
      return GameState.of("Vertical Win", this.currentPlayer);
    }

    // Check for diagonal win
    if (
      (this.checkMarksAreEquals([0, 0], [1, 1]) &&
        this.checkMarksAreEquals([1, 1], [2, 2])) ||
      (this.checkMarksAreEquals([0, 2], [1, 1]) &&
        this.checkMarksAreEquals([1, 1], [2, 0]))
    ) {
      return GameState.of("Diagonal Win", this.currentPlayer);
    }

    if (this.boardIsFull()) {
      return GameState.of("Draw");
    }

    return GameState.of("In Progress");
  }

  private checkMarksAreEquals(
    firstCellPosition: [RowOrColumnValue, RowOrColumnValue],
    secondCellPosition: [RowOrColumnValue, RowOrColumnValue]
  ): boolean {
    const firstCell = this.getCell(...firstCellPosition);
    const secondCell = this.getCell(...secondCellPosition);

    if (!firstCell || !secondCell) {
      return false;
    }

    return firstCell.mark === secondCell.mark;
  }
}
