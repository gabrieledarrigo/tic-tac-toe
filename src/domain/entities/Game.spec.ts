import { createMock } from "../../../test/utils";
import { NewGameCreated } from "../events/NewGameCreated";
import { PlayerJoined } from "../events/PlayerJoined";
import { GameId } from "../values/GameId";
import { PlayerId } from "../values/PlayerId";
import { Game, Moves } from "./Game";
import { Mark, Move, RowOrColumnValue } from "./Move";

describe("Game", () => {
  it("given an array of Moves, it should arrange the board", () => {
    const id = GameId.of("id");
    const playerOneId = PlayerId.of("playerOneId");
    const playerTwoId = PlayerId.of("playerTwoId");

    const moves: Moves = [
      createMock<Move>({ row: 0, column: 0, mark: Mark.X }),
      createMock<Move>({ row: 0, column: 1, mark: Mark.O }),
      createMock<Move>({ row: 0, column: 2, mark: Mark.X }),
      createMock<Move>({ row: 1, column: 0, mark: Mark.O }),
      createMock<Move>({ row: 1, column: 1, mark: Mark.X }),
      createMock<Move>({ row: 1, column: 2, mark: Mark.O }),
      createMock<Move>({ row: 2, column: 0, mark: Mark.X }),
      createMock<Move>({ row: 2, column: 1, mark: Mark.O }),
      createMock<Move>({ row: 2, column: 2, mark: Mark.X }),
    ];

    const game = new Game(id, playerOneId, playerTwoId, moves);

    expect(game.getBoard()).toEqual([
      [moves[0], moves[1], moves[2]],
      [moves[3], moves[4], moves[5]],
      [moves[6], moves[7], moves[8]],
    ]);
  });

  describe("new", () => {
    it("given an id, when a new Game is created, then it should publish a NewGameCreated event", () => {
      const id = GameId.of("id");

      const game = Game.new(id);

      expect(game.getDomainEvents()).toContainEqual(new NewGameCreated(id));
    });

    it("given an id, when a new Game is created, then the game board should be empty", () => {
      const id = GameId.of("id");

      const game = Game.new(id);

      expect(game.getBoard()).toEqual([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);
    });
  });

  describe("playerJoin", () => {
    it("given a PlayerId, when joined, then it should add it to the game", () => {
      const id = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const game = new Game(id);
      game.playerJoin(playerOneId);

      expect(game.getPlayerOneId()).toEqual(playerOneId);

      game.playerJoin(playerTwoId);

      expect(game.getPlayerTwoId()).toEqual(playerTwoId);
    });

    it("given a PlayerId, when joined, then it should not add the player to the game if the player is already in the game as the player one", () => {
      const id = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const game = new Game(id);
      game.playerJoin(playerOneId);
      game.playerJoin(playerTwoId);

      const actual = game.playerJoin(playerTwoId);

      expect(actual.isSuccess()).toBeTruthy();
    });

    it("given a PlayerId, when joined, then it should not add the player to the game if the player is already in the game as the player two", () => {
      const id = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");

      const game = new Game(id);
      game.playerJoin(playerOneId);

      const actual = game.playerJoin(playerOneId);

      expect(actual.isSuccess()).toBeTruthy();
    });

    it("given a player, when joined, then it should not add the player to the game if the game is full", () => {
      const id = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");
      const playerThreeId = PlayerId.of("playerThreeId");

      const game = new Game(id);
      game.playerJoin(playerOneId);
      game.playerJoin(playerTwoId);

      const actual = game.playerJoin(playerThreeId);

      expect(actual.isFailure()).toBeTruthy();
    });

    it("given a player, when joined, then it should publish a PlayerJoined event", () => {
      const id = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");

      const game = new Game(id);
      game.playerJoin(playerOneId);

      expect(game.getDomainEvents()).toContainEqual(
        new PlayerJoined(game.id, playerOneId)
      );
    });
  });

  describe("getCell", () => {
    it("should return the cell value", () => {
      const id = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const game = new Game(id, playerOneId, playerTwoId);
      const actual = game.getCell(0, 0);

      expect(actual).toEqual(null);
    });
  });

  describe("boardIsEmpty", () => {
    it("should return true when the board is empty", () => {
      const id = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const game = new Game(id, playerOneId, playerTwoId);
      const actual = game.boardIsEmpty();

      expect(actual).toEqual(true);
    });

    it("should return false when the board is not empty", () => {
      const id = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const move = createMock<Move>({
        id: "id",
        gameId: GameId.of("gameId"),
        playerId: PlayerId.of("playerId"),
        row: 0,
        column: 0,
        mark: Mark.X,
      });

      const game = new Game(id, playerOneId, playerTwoId, [move]);
      const actual = game.boardIsEmpty();

      expect(actual).toEqual(false);
    });
  });

  describe("boardIsFull", () => {
    it("should return true when the board is full", () => {
      const id = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const moves: Moves = [
        createMock<Move>({ row: 0, column: 0, mark: Mark.X }),
        createMock<Move>({ row: 0, column: 1, mark: Mark.O }),
        createMock<Move>({ row: 0, column: 2, mark: Mark.X }),
        createMock<Move>({ row: 1, column: 0, mark: Mark.O }),
        createMock<Move>({ row: 1, column: 1, mark: Mark.X }),
        createMock<Move>({ row: 1, column: 2, mark: Mark.O }),
        createMock<Move>({ row: 2, column: 0, mark: Mark.X }),
        createMock<Move>({ row: 2, column: 1, mark: Mark.O }),
        createMock<Move>({ row: 2, column: 2, mark: Mark.X }),
      ];

      const game = new Game(id, playerOneId, playerTwoId, moves);
      const actual = game.boardIsFull();

      expect(actual).toEqual(true);
    });

    it("should return false when the board is not full", () => {
      const id = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const move = createMock<Move>({
        id: "id",
        gameId: GameId.of("gameId"),
        playerId: PlayerId.of("playerId"),
        row: 0,
        column: 0,
        mark: Mark.X,
      });

      const game = new Game(id, playerOneId, playerTwoId, [move]);
      const actual = game.boardIsFull();

      expect(actual).toEqual(false);
    });
  });

  describe("place", () => {
    it("should place a Move on the board within the given row and column coordinates", () => {
      const id = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const move = createMock<Move>({
        id: "id",
        gameId: GameId.of("gameId"),
        playerId: PlayerId.of("playerId"),
        row: 0,
        column: 0,
        mark: Mark.X,
      });

      const game = new Game(id, playerOneId, playerTwoId);
      game.place(move);

      const actual = game.getBoard();

      expect(actual).toEqual([
        [move, null, null],
        [null, null, null],
        [null, null, null],
      ]);
    });

    it("should return an error when the row is out of bounds", () => {
      const id = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const move = createMock<Move>({
        id: "id",
        gameId: GameId.of("gameId"),
        playerId: PlayerId.of("playerId"),
        row: 3 as RowOrColumnValue,
        column: 0,
        mark: Mark.X,
      });

      const game = new Game(id, playerOneId, playerTwoId);
      const actual = game.place(move);

      expect(actual).toEqual({
        error: new Error("Row is out of bounds"),
      });
    });

    it("should return an error when the column is out of bounds", () => {
      const id = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const move = createMock<Move>({
        id: "id",
        gameId: GameId.of("gameId"),
        playerId: PlayerId.of("playerId"),
        row: 0,
        column: 3 as RowOrColumnValue,
        mark: Mark.X,
      });

      const game = new Game(id, playerOneId, playerTwoId);
      const actual = game.place(move);

      expect(actual).toEqual({
        error: new Error("Column is out of bounds"),
      });
    });

    it("should return an error when the cell is not empty", () => {
      const id = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const move = createMock<Move>({
        id: "id",
        gameId: GameId.of("gameId"),
        playerId: PlayerId.of("playerId"),
        row: 0,
        column: 0,
        mark: Mark.X,
      });

      const game = new Game(id, playerOneId, playerTwoId);
      game.place(move);
      const actual = game.place(move);

      expect(actual).toEqual({
        error: new Error("Cell is not empty"),
      });
    });
  });
});
