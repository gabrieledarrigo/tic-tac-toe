import { AggregateRoot } from "../shared/AggregateRoot";
import { NewGameCreated } from "../events/NewGameCreated";
import { GameId } from "../values/GameId";
import { PlayerJoined } from "../events/PlayerJoined";
import { Failure, Result, Success } from "../shared/Result";
import { PlayerId } from "../values/PlayerId";
import { Move } from "./Move";

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

  public getCell(row: number, column: number): Cell {
    return this.board[row][column];
  }

  public place(move: Move): Result<void> {
    const { row, column } = move;

    if (row < 0 || row > 2) {
      return Failure.of(new Error("Row is out of bounds"));
    }

    if (column < 0 || column > 2) {
      return Failure.of(new Error("Column is out of bounds"));
    }

    if (this.getCell(row, column) !== null) {
      return Failure.of(new Error("Cell is not empty"));
    }

    this.board[row][column] = move;

    return Success.of(undefined);
  }

  private isFull(): boolean {
    return !!this.playerOneId && !!this.playerTwoId;
  }
}
