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
export type Board = [[Cell, Cell, Cell], [Cell, Cell, Cell], [Cell, Cell, Cell]];

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
    private playerOneId: PlayerId,
    private playerTwoId?: PlayerId,
    private readonly moves: Moves = [],
  ) {
    super();

    this.prepareBoard();
    this.computeCurrentPlayer();
  }

  /**
   * Creates a new instance of the Game class.
   *
   * @param id - The ID of the game.
   * @param playerOneId - The ID of the first player.
   * @returns A new instance of the Game class.
   */
  public static new(id: GameId, playerOneId: PlayerId): Game {
    const game = new Game(id, playerOneId);
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
      if (this.playerOneId.equals(playerId) || this.playerTwoId?.equals(playerId)) {
        this.apply(new PlayerJoined(this.id, playerId));

        return Success.of(undefined);
      }

      return Failure.of(new Error("Game is full"));
    }

    if (!this.playerOneId) {
      this.playerOneId = playerId;
    } else if (this.playerOneId.equals(playerId)) {
      this.apply(new PlayerJoined(this.id, playerId));

      return Success.of(undefined);
    } else {
      this.playerTwoId = playerId;
    }

    this.apply(new PlayerJoined(this.id, playerId));

    return Success.of(undefined);
  }

  /**
   * Returns the ID of the first player in the game.
   * @returns The ID of the first player
   */
  public getPlayerOneId(): PlayerId {
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
   * Returns the current player of the game.
   * @returns The current player or undefined if no player is set.
   */
  public getCurrentPlayer(): PlayerId | undefined {
    return this.currentPlayer;
  }

  /**
   * Returns an array of all the moves made in the game, ordered by the date at which the move was placed.
   * @returns {Moves} An array of moves made in the game.
   */
  public getMovesFromBoard(): Moves {
    return this.board
      .flat()
      .filter((cell) => cell !== null)
      .sort((a, b) => {
        if (a && b) {
          return a.placedAt.getTime() - b.placedAt.getTime();
        }

        return 0;
      }) as Moves;
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

    if (this.gameState().isEnded()) {
      return Failure.of(new Error("Game is ended"));
    }

    if (
      this.playerOneId.equals(playerId) === false &&
      this.playerTwoId?.equals(playerId) === false
    ) {
      return Failure.of(
        new Error(`Player with id: ${playerId.value} is not part of the game`),
      );
    }

    if (this.currentPlayer && playerId.equals(this.currentPlayer) === false) {
      return Failure.of(
        new Error(
          `Player with id: ${playerId.value} cannot move. Current player turn is: ${this.currentPlayer.value}`,
        ),
      );
    }

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
    this.currentPlayer = this.playerOneId.equals(playerId)
      ? this.playerTwoId
      : this.playerOneId;

    this.apply(new PlayerMoved(this.id, playerId, move.id));

    const gameState = this.gameState(playerId);
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
   * Prepares the game board by populating it with the moves.
   */
  private prepareBoard(): void {
    this.moves.forEach((move) => {
      this.board[move.row][move.column] = move;
    });
  }

  /**
   * Computes the current player based on the moves in the game.
   */
  private computeCurrentPlayer(): void {
    if (this.moves.length === 0) {
      this.currentPlayer = this.playerOneId;
      return;
    }

    const lastMove = this.moves[this.moves.length - 1];

    if (this.playerOneId.equals(lastMove.playerId)) {
      this.currentPlayer = this.playerTwoId;
    } else {
      this.currentPlayer = this.playerOneId;
    }
  }

  /**
   * Returns the current state of the game.
   * @param lastMoveBy Optional parameter indicating the player who made the last move.
   * @returns The current state of the game.
   */
  private gameState(lastMoveBy?: PlayerId): GameState {
    // Check for horizontal win
    if (
      (this.checkMarksAreEquals([0, 0], [0, 1]) &&
        this.checkMarksAreEquals([0, 1], [0, 2])) ||
      (this.checkMarksAreEquals([1, 0], [1, 1]) &&
        this.checkMarksAreEquals([1, 1], [1, 2])) ||
      (this.checkMarksAreEquals([2, 0], [2, 1]) &&
        this.checkMarksAreEquals([2, 1], [2, 2]))
    ) {
      return GameState.of("Horizontal Win", lastMoveBy);
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
      return GameState.of("Vertical Win", lastMoveBy);
    }

    // Check for diagonal win
    if (
      (this.checkMarksAreEquals([0, 0], [1, 1]) &&
        this.checkMarksAreEquals([1, 1], [2, 2])) ||
      (this.checkMarksAreEquals([0, 2], [1, 1]) &&
        this.checkMarksAreEquals([1, 1], [2, 0]))
    ) {
      return GameState.of("Diagonal Win", lastMoveBy);
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
    secondCellPosition: [RowOrColumnValue, RowOrColumnValue],
  ): boolean {
    const firstCell = this.getCell(...firstCellPosition);
    const secondCell = this.getCell(...secondCellPosition);

    if (!firstCell || !secondCell) {
      return false;
    }

    return firstCell.mark === secondCell.mark;
  }
}
