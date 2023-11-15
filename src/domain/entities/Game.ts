import { AggregateRoot } from "../shared/AggregateRoot";
import { NewGameCreated } from "../events/NewGameCreated";
import { GameId } from "../values/GameId";
import { PlayerJoined } from "../events/PlayerJoined";
import { Failure, Result, Success } from "../shared/Result";
import { PlayerId } from "../values/PlayerId";
import { Move, RowOrColumnValue } from "./Move";
import { GameState } from "../values/GameState";
import { PlayerMoved } from "../events/PlayerMoved";
import { GameEnded } from "../events/GameEnded";

/**
 * Represents a cell on the game board, which can either be a move or null.
 */
export type Cell = Move | null;

/**
 * Represents a tic-tac-toe board, which is a 3x3 grid of cells.
 */
export type Board = [
  [Cell, Cell, Cell],
  [Cell, Cell, Cell],
  [Cell, Cell, Cell]
];

/**
 * Represents a list of moves in a Tic Tac Toe game.
 * The list can have between 0 and 9 moves.
 */
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

/**
 * Represents a game of Tic Tac Toe.
 */
export class Game extends AggregateRoot {
  /**
   * Represents the game board as a 2D array of null or move values.
   */
  private readonly board: Board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  /**
   * The ID of the player who is currently taking their turn.
   */
  private currentPlayer?: PlayerId;

  public constructor(
    public readonly id: GameId,
    private playerOneId?: PlayerId,
    private playerTwoId?: PlayerId,
    private readonly moves: Moves = []
  ) {
    super();

    this.moves.forEach((move) => {
      this.board[move.row][move.column] = move;
    });
  }

  /**
   * Creates a new instance of the Game class with the specified id.
   * Also applies the NewGameCreated event.
   * @param id The id of the game.
   * @returns A new instance of the Game class.
   */
  public static new(id: GameId): Game {
    const game = new Game(id);
    game.apply(new NewGameCreated(id));

    return game;
  }

  /**
   * Adds a player to the game.
   * Also applies the PlayerJoined event.
   * @param playerId The ID of the player to add.
   * @returns A Result object indicating success or failure.
   */
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

  /**
   * Returns the ID of the first player in the game.
   * @returns The ID of the first player, or undefined if it has not been set.
   */
  public getPlayerOneId(): PlayerId | undefined {
    return this.playerOneId;
  }

  /**
   * Returns the ID of the second player in the game, if any.
   * @returns The ID of the second player, or undefined if there is no second player.
   */
  public getPlayerTwoId(): PlayerId | undefined {
    return this.playerTwoId;
  }

  /**
   * Returns an array of all the moves made in the game.
   * @returns {Moves} An array of moves made in the game.
   */
  public getMoves(): Moves {
    return this.board.flat().filter((cell) => cell !== null) as Moves;
  }

  /**
   * Returns the current board of the game.
   * @returns {Board} The current board of the game.
   */
  public getBoard(): Board {
    return this.board;
  }

  /**
   * Checks if the game board is empty.
   * @returns {boolean} True if the board is empty, false otherwise.
   */
  public boardIsEmpty(): boolean {
    return this.board.every((row) => row.every((cell) => cell === null));
  }

  /**
   * Checks if the game board is full.
   * @returns {boolean} True if the board is full, false otherwise.
   */
  public boardIsFull(): boolean {
    return this.board.every((row) => row.every((cell) => cell !== null));
  }

  /**
   * Returns the cell at the specified row and column.
   * @param row The row of the cell to retrieve.
   * @param column The column of the cell to retrieve.
   * @returns The cell at the specified row and column.
   */
  public getCell(row: RowOrColumnValue, column: RowOrColumnValue): Cell {
    return this.board[row][column];
  }

  /**
   * Places a move on the game board and updates the game state accordingly.
   * @param move - The move to place on the board.
   * @returns A Result object containing either the updated game state or an error.
   */
  public place(move: Move): Result<GameState> {
    const { row, column, playerId } = move;

    if (this.currentPlayer && playerId.equals(this.currentPlayer)) {
      return Failure.of(
        new Error(`Player with id: ${playerId.value} has already placed a move`)
      );
    }

    if (
      this.playerOneId?.equals(playerId) === false &&
      this.playerTwoId?.equals(playerId) === false
    ) {
      return Failure.of(
        new Error(`Player with id: ${playerId.value} is not part of the game`)
      );
    }

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

    this.apply(new PlayerMoved(this.id, playerId, move.id));

    const gameState = this.gameState();
    if (gameState.isEnded()) {
      this.apply(new GameEnded(this.id));
    }

    return Success.of(gameState);
  }

  /**
   * Checks if the game is full, meaning both playerOneId and playerTwoId are defined.
   * @returns {boolean} True if the game is full, false otherwise.
   */
  private isFull(): boolean {
    return !!this.playerOneId && !!this.playerTwoId;
  }

  /**
   * Returns the current state of the game.
   * @returns {GameState} The current state of the game.
   */
  private gameState(): GameState {
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

  /**
   * Checks if the marks of two cells are equal.
   * @param firstCellPosition - The position of the first cell.
   * @param secondCellPosition - The position of the second cell.
   * @returns True if the marks of the two cells are equal, false otherwise.
   */
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
