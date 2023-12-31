import { createMock } from "../../../test/utils";
import { GameEnded } from "../events/GameEnded";
import { NewGameCreated } from "../events/NewGameCreated";
import { PlayerJoined } from "../events/PlayerJoined";
import { PlayerMoved } from "../events/PlayerMoved";
import { GameId } from "../values/GameId";
import { MoveId } from "../values/MoveId";
import { PlayerId } from "../values/PlayerId";
import { Game, Moves } from "./Game";
import { Mark, Move, RowOrColumnValue } from "./Move";

describe("Game", () => {
  it("given an array of Moves, it should prepare the board", () => {
    const gameId = GameId.of("id");
    const playerOneId = PlayerId.of("playerOneId");
    const playerTwoId = PlayerId.of("playerTwoId");

    const moves: Moves = [
      createMock<Move>({ row: 0, column: 0, mark: Mark.X, playerId: playerOneId }),
      createMock<Move>({ row: 0, column: 1, mark: Mark.O, playerId: playerTwoId }),
      createMock<Move>({ row: 0, column: 2, mark: Mark.X, playerId: playerOneId }),
      createMock<Move>({ row: 1, column: 0, mark: Mark.O, playerId: playerTwoId }),
      createMock<Move>({ row: 1, column: 1, mark: Mark.X, playerId: playerOneId }),
      createMock<Move>({ row: 1, column: 2, mark: Mark.O, playerId: playerTwoId }),
      createMock<Move>({ row: 2, column: 0, mark: Mark.X, playerId: playerOneId }),
      createMock<Move>({ row: 2, column: 1, mark: Mark.O, playerId: playerTwoId }),
      createMock<Move>({ row: 2, column: 2, mark: Mark.X, playerId: playerOneId }),
    ];

    const game = new Game(gameId, playerOneId, playerTwoId, moves);

    expect(game.getBoard()).toEqual([
      [moves[0], moves[1], moves[2]],
      [moves[3], moves[4], moves[5]],
      [moves[6], moves[7], moves[8]],
    ]);
  });

  it("given an empty array of moves, when a Game is instantiated, then it set the current player to player one", () => {
    const gameId = GameId.of("id");
    const playerOneId = PlayerId.of("playerOneId");
    const playerTwoId = PlayerId.of("playerTwoId");

    const moves: Moves = [];

    const game = new Game(gameId, playerOneId, playerTwoId, moves);

    expect(game.getCurrentPlayer()).toEqual(playerOneId);
  });

  it("given an array of moves, when a Game is instantiated, then it set the current player with the id of the player who should move", () => {
    const gameId = GameId.of("id");
    const playerOneId = PlayerId.of("playerOneId");
    const playerTwoId = PlayerId.of("playerTwoId");

    const moves: Moves = [
      createMock<Move>({
        row: 0,
        column: 0,
        mark: Mark.X,
        playerId: playerOneId,
      }),
    ];

    const game = new Game(gameId, playerOneId, playerTwoId, moves);

    expect(game.getCurrentPlayer()).toEqual(playerTwoId);
  });

  describe("new", () => {
    it("given an id and the id of the player one, when the Game is created, then it should set the id of the player one", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");

      const game = Game.new(gameId, playerOneId);

      expect(game.getPlayerOneId()).toEqual(playerOneId);
    });

    it("given an id and the id of the player one, when a new Game is created, then it should publish a NewGameCreated event", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");

      const game = Game.new(gameId, playerOneId);

      expect(game.pullDomainEvents()).toContainEqual(new NewGameCreated(gameId));
    });

    it("given an id and the id of the player one, when a new Game is created, then the game board should be empty", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");

      const game = Game.new(gameId, playerOneId);

      expect(game.getBoard()).toEqual([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);
    });
  });

  describe("playerJoin", () => {
    it("given a PlayerId, when joined, then it should add it to the game", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const game = new Game(gameId, playerOneId);
      game.playerJoin(playerOneId);

      expect(game.getPlayerOneId()).toEqual(playerOneId);

      game.playerJoin(playerTwoId);

      expect(game.getPlayerTwoId()).toEqual(playerTwoId);
    });

    it("given a PlayerId, when joined, then it should add the player to the game if the player is already in the game as the player one", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");

      const game = new Game(gameId, playerOneId);
      game.playerJoin(playerOneId);

      const actual = game.playerJoin(playerOneId);

      expect(actual.isSuccess()).toBeTruthy();
      expect(game.getPlayerOneId()).toEqual(playerOneId);
    });

    it("given a PlayerId, when joined, then it should add the player to the game if the player is already in the game as the player two", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const game = new Game(gameId, playerOneId);
      game.playerJoin(playerOneId);
      game.playerJoin(playerTwoId);

      const actual = game.playerJoin(playerTwoId);

      expect(actual.isSuccess()).toBeTruthy();
      expect(game.getPlayerOneId()).toEqual(playerOneId);
      expect(game.getPlayerTwoId()).toEqual(playerTwoId);
    });

    it("given a PlayerId, when joined, then it should not add the player to the game if the player is already in the game in another position", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");

      const game = new Game(gameId, playerOneId);
      game.playerJoin(playerOneId);

      const actual = game.playerJoin(playerOneId);

      expect(actual.isSuccess()).toBeTruthy();
      expect(game.getPlayerOneId()).toEqual(playerOneId);
      expect(game.getPlayerTwoId()).toEqual(undefined);
    });

    it("given a player, when joined, then it should not add the player to the game if the game is full", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");
      const playerThreeId = PlayerId.of("playerThreeId");

      const game = new Game(gameId, playerOneId);
      game.playerJoin(playerOneId);
      game.playerJoin(playerTwoId);

      const actual = game.playerJoin(playerThreeId);

      expect(actual.isFailure()).toBeTruthy();
    });

    it("given a player, when joined, then it should add a PlayerJoined event to the list of domain events", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const game = new Game(gameId, playerOneId);
      game.playerJoin(playerOneId);
      game.playerJoin(playerTwoId);

      expect(game.pullDomainEvents()).toEqual([
        new PlayerJoined(game.id, playerOneId),
        new PlayerJoined(game.id, playerTwoId),
      ]);
    });
  });

  describe("getPlayerOneId", () => {
    it("should return the id of the first player in the game, if present", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");

      const game = new Game(gameId, playerOneId);
      game.playerJoin(playerOneId);

      expect(game.getPlayerOneId()).toEqual(playerOneId);
    });
  });

  describe("getPlayerTwoId", () => {
    it("should return the id of the second player in the game, if present", () => {
      const gameId = GameId.of("id");
      const playerTwoId = PlayerId.of("playerTwoId");

      const game = new Game(gameId, PlayerId.of("playerOneId"));

      expect(game.getPlayerTwoId()).toBeUndefined();

      game.playerJoin(playerTwoId);

      expect(game.getPlayerTwoId()).toEqual(playerTwoId);
    });
  });

  describe("getMovesFromBoard", () => {
    it("should return the Moves made in the Game, ordered by the date on which they were placed", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const moves: Moves = [
        createMock<Move>({
          row: 0,
          column: 0,
          mark: Mark.X,
          playerId: playerOneId,
          placedAt: new Date("2023-02-01"),
        }),
        createMock<Move>({
          row: 1,
          column: 0,
          mark: Mark.O,
          playerId: playerTwoId,
          placedAt: new Date("2023-01-01"),
        }),
        createMock<Move>({
          row: 2,
          column: 2,
          mark: Mark.X,
          playerId: playerOneId,
          placedAt: new Date("2023-03-01"),
        }),
      ];

      const game = new Game(gameId, playerOneId, playerTwoId, moves);
      const actual = game.getMovesFromBoard();

      expect(actual).toEqual([moves[1], moves[0], moves[2]]);
    });
  });

  describe("boardIsEmpty", () => {
    it("should return true when the board is empty", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const game = new Game(gameId, playerOneId, playerTwoId);
      const actual = game.boardIsEmpty();

      expect(actual).toEqual(true);
    });

    it("should return false when the board is not empty", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const move = createMock<Move>({
        gameId,
        playerId: playerOneId,
        row: 0,
        column: 0,
        mark: Mark.X,
      });

      const game = new Game(gameId, playerOneId, playerTwoId, [move]);
      const actual = game.boardIsEmpty();

      expect(actual).toEqual(false);
    });
  });

  describe("boardIsFull", () => {
    it("should return true when the board is full", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const moves: Moves = [
        createMock<Move>({ row: 0, column: 0, mark: Mark.X, playerId: playerOneId }),
        createMock<Move>({ row: 0, column: 1, mark: Mark.O, playerId: playerTwoId }),
        createMock<Move>({ row: 0, column: 2, mark: Mark.X, playerId: playerOneId }),
        createMock<Move>({ row: 1, column: 0, mark: Mark.O, playerId: playerTwoId }),
        createMock<Move>({ row: 1, column: 1, mark: Mark.X, playerId: playerOneId }),
        createMock<Move>({ row: 1, column: 2, mark: Mark.O, playerId: playerTwoId }),
        createMock<Move>({ row: 2, column: 0, mark: Mark.X, playerId: playerOneId }),
        createMock<Move>({ row: 2, column: 1, mark: Mark.O, playerId: playerTwoId }),
        createMock<Move>({ row: 2, column: 2, mark: Mark.X, playerId: playerOneId }),
      ];

      const game = new Game(gameId, playerOneId, playerTwoId, moves);
      const actual = game.boardIsFull();

      expect(actual).toEqual(true);
    });

    it("should return false when the board is not full", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const move = createMock<Move>({
        gameId,
        playerId: playerOneId,
        row: 0,
        column: 0,
        mark: Mark.X,
      });

      const game = new Game(gameId, playerOneId, playerTwoId, [move]);
      const actual = game.boardIsFull();

      expect(actual).toEqual(false);
    });
  });

  describe("getCell", () => {
    it("should return the cell value", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const game = new Game(gameId, playerOneId, playerTwoId);
      const actual = game.getCell(0, 0);

      expect(actual).toEqual(null);
    });
  });

  describe("place", () => {
    it("should place a Move on the board within the given row and column coordinates", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const move = createMock<Move>({
        gameId,
        playerId: playerOneId,
        row: 0,
        column: 0,
        mark: Mark.X,
      });

      const game = new Game(gameId, playerOneId, playerTwoId);
      game.place(move);

      const actual = game.getBoard();

      expect(actual).toEqual([
        [move, null, null],
        [null, null, null],
        [null, null, null],
      ]);
    });

    it("should return an error if the Game ended", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const moves: Moves = [
        createMock<Move>({ row: 0, column: 0, mark: Mark.X, playerId: playerOneId }),
        createMock<Move>({ row: 1, column: 0, mark: Mark.O, playerId: playerTwoId }),
        createMock<Move>({ row: 0, column: 1, mark: Mark.X, playerId: playerOneId }),
        createMock<Move>({ row: 1, column: 1, mark: Mark.O, playerId: playerTwoId }),
        createMock<Move>({ row: 0, column: 2, mark: Mark.X, playerId: playerOneId }),
      ];

      const game = new Game(gameId, playerOneId, playerTwoId, moves);

      const move = createMock<Move>({
        gameId,
        playerId: playerTwoId,
        row: 1,
        column: 2,
        mark: Mark.O,
      });

      const actual = game.place(move);

      expect(actual).toEqual({
        error: new Error("Game is ended"),
      });
    });

    it("should return an error when the player is not part of the game", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");
      const playerThreeId = PlayerId.of("playerThreeId");

      const game = new Game(gameId, playerOneId, playerTwoId);

      const move = createMock<Move>({
        gameId,
        playerId: playerThreeId,
        row: 0,
        column: 0,
        mark: Mark.X,
      });

      const actual = game.place(move);

      expect(actual).toEqual({
        error: new Error("Player with id: playerThreeId is not part of the game"),
      });
    });

    it("should return an error when the player try to place two moves", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const move = createMock<Move>({
        gameId,
        playerId: playerOneId,
        row: 0,
        column: 0,
        mark: Mark.X,
      });

      const game = new Game(gameId, playerOneId, playerTwoId);
      game.place(move);
      const actual = game.place({
        ...move,
        row: 1,
        column: 1,
      });

      expect(actual).toEqual({
        error: new Error(
          "Player with id: playerOneId cannot move. Current player turn is: playerTwoId",
        ),
      });
    });

    it("should return an error when the row is out of bounds", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const move = createMock<Move>({
        gameId,
        playerId: playerOneId,
        row: 3 as RowOrColumnValue,
        column: 0,
        mark: Mark.X,
      });

      const game = new Game(gameId, playerOneId, playerTwoId);
      const actual = game.place(move);

      expect(actual).toEqual({
        error: new Error("Row is out of bounds"),
      });
    });

    it("should return an error when the column is out of bounds", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const move = createMock<Move>({
        gameId,
        playerId: playerOneId,
        row: 0,
        column: 3 as RowOrColumnValue,
        mark: Mark.X,
      });

      const game = new Game(gameId, playerOneId, playerTwoId);
      const actual = game.place(move);

      expect(actual).toEqual({
        error: new Error("Column is out of bounds"),
      });
    });

    it("should return an error when the cell is not empty", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const move = createMock<Move>({
        gameId,
        playerId: playerOneId,
        row: 0,
        column: 0,
        mark: Mark.X,
      });

      const game = new Game(gameId, playerOneId, playerTwoId);
      game.place(move);
      const actual = game.place({
        ...move,
        playerId: playerTwoId,
      });

      expect(actual).toEqual({
        error: new Error("Cell is not empty"),
      });
    });

    it("should return an error when the the cell is not empty and the board is full", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const moves: Moves = [
        createMock<Move>({ row: 0, column: 0, mark: Mark.X, playerId: playerOneId }),
        createMock<Move>({ row: 0, column: 1, mark: Mark.O, playerId: playerTwoId }),
        createMock<Move>({ row: 0, column: 2, mark: Mark.X, playerId: playerOneId }),
        createMock<Move>({ row: 1, column: 0, mark: Mark.O, playerId: playerTwoId }),
        createMock<Move>({ row: 1, column: 1, mark: Mark.X, playerId: playerOneId }),
        createMock<Move>({ row: 1, column: 2, mark: Mark.O, playerId: playerTwoId }),
        createMock<Move>({ row: 2, column: 0, mark: Mark.X, playerId: playerOneId }),
        createMock<Move>({ row: 2, column: 1, mark: Mark.O, playerId: playerTwoId }),
        createMock<Move>({ row: 2, column: 2, mark: Mark.X, playerId: playerOneId }),
      ];

      const move = createMock<Move>({
        gameId,
        playerId: playerTwoId,
        row: 0,
        column: 0,
        mark: Mark.X,
      });

      const game = new Game(gameId, playerOneId, playerTwoId, moves);
      const actual = game.place(move);

      expect(actual).toEqual({
        error: new Error("Game is ended"),
      });
    });

    it.each<{
      history: [PlayerId, RowOrColumnValue, RowOrColumnValue, Mark][];
      playerMove: [PlayerId, RowOrColumnValue, RowOrColumnValue, Mark];
    }>([
      {
        history: [
          [PlayerId.of("playerOneId"), 0, 0, Mark.X],
          [PlayerId.of("playerTwoId"), 1, 0, Mark.O],
          [PlayerId.of("playerOneId"), 0, 1, Mark.X],
          [PlayerId.of("playerTwoId"), 1, 1, Mark.O],
        ],
        playerMove: [PlayerId.of("playerOneId"), 0, 2, Mark.X],
      },
      {
        history: [
          [PlayerId.of("playerOneId"), 1, 0, Mark.X],
          [PlayerId.of("playerTwoId"), 0, 0, Mark.O],
          [PlayerId.of("playerOneId"), 1, 1, Mark.X],
          [PlayerId.of("playerTwoId"), 0, 1, Mark.O],
        ],
        playerMove: [PlayerId.of("playerOneId"), 1, 2, Mark.X],
      },
      {
        history: [
          [PlayerId.of("playerOneId"), 2, 0, Mark.X],
          [PlayerId.of("playerTwoId"), 1, 0, Mark.O],
          [PlayerId.of("playerOneId"), 2, 1, Mark.X],
          [PlayerId.of("playerTwoId"), 1, 1, Mark.O],
        ],
        playerMove: [PlayerId.of("playerOneId"), 2, 2, Mark.X],
      },
    ])(
      "should return a GameState with the winner when the Player has won the game with a horizontal line",
      ({ history, playerMove }) => {
        const gameId = GameId.of("id");
        const playerOneId = PlayerId.of("playerOneId");
        const playerTwoId = PlayerId.of("playerTwoId");

        const moves = history.map(([playerId, row, column, mark]) => {
          return createMock<Move>({
            playerId,
            row,
            column,
            mark,
          });
        }) as Moves;

        const [playerId, row, column, mark] = playerMove;

        const move = createMock<Move>({
          gameId,
          playerId,
          row,
          column,
          mark,
        });

        const game = new Game(gameId, playerOneId, playerTwoId, moves);
        const actual = game.place(move);

        expect(actual.unwrap()).toEqual({
          state: "Horizontal Win",
          winner: playerId,
        });
      },
    );

    it.each<{
      history: [PlayerId, RowOrColumnValue, RowOrColumnValue, Mark][];
      playerMove: [PlayerId, RowOrColumnValue, RowOrColumnValue, Mark];
    }>([
      {
        history: [
          [PlayerId.of("playerOneId"), 0, 0, Mark.X],
          [PlayerId.of("playerTwoId"), 0, 1, Mark.O],
          [PlayerId.of("playerOneId"), 1, 0, Mark.X],
          [PlayerId.of("playerTwoId"), 1, 1, Mark.O],
        ],
        playerMove: [PlayerId.of("playerOneId"), 2, 0, Mark.X],
      },
      {
        history: [
          [PlayerId.of("playerOneId"), 0, 1, Mark.X],
          [PlayerId.of("playerTwoId"), 0, 0, Mark.O],
          [PlayerId.of("playerOneId"), 1, 1, Mark.X],
          [PlayerId.of("playerTwoId"), 1, 0, Mark.O],
        ],
        playerMove: [PlayerId.of("playerOneId"), 2, 1, Mark.X],
      },
      {
        history: [
          [PlayerId.of("playerOneId"), 0, 2, Mark.X],
          [PlayerId.of("playerTwoId"), 0, 1, Mark.O],
          [PlayerId.of("playerOneId"), 1, 2, Mark.X],
          [PlayerId.of("playerTwoId"), 1, 1, Mark.O],
        ],
        playerMove: [PlayerId.of("playerOneId"), 2, 2, Mark.X],
      },
    ])(
      "should return a GameState with the winner when the Player has won the game with a vertical line",
      ({ history, playerMove }) => {
        const gameId = GameId.of("id");
        const playerOneId = PlayerId.of("playerOneId");
        const playerTwoId = PlayerId.of("playerTwoId");

        const moves = history.map(([playerId, row, column, mark]) => {
          return createMock<Move>({
            playerId,
            row,
            column,
            mark,
          });
        }) as Moves;

        const [playerId, row, column, mark] = playerMove;

        const move = createMock<Move>({
          gameId,
          playerId,
          row,
          column,
          mark,
        });

        const game = new Game(gameId, playerOneId, playerTwoId, moves);
        const actual = game.place(move);

        expect(actual.unwrap()).toEqual({
          state: "Vertical Win",
          winner: playerId,
        });
      },
    );

    it.each<{
      history: [PlayerId, RowOrColumnValue, RowOrColumnValue, Mark][];
      playerMove: [PlayerId, RowOrColumnValue, RowOrColumnValue, Mark];
    }>([
      {
        history: [
          [PlayerId.of("playerOneId"), 0, 0, Mark.X],
          [PlayerId.of("playerTwoId"), 0, 1, Mark.O],
          [PlayerId.of("playerOneId"), 1, 1, Mark.X],
          [PlayerId.of("playerTwoId"), 1, 2, Mark.O],
        ],
        playerMove: [PlayerId.of("playerOneId"), 2, 2, Mark.X],
      },
      {
        history: [
          [PlayerId.of("playerOneId"), 0, 2, Mark.X],
          [PlayerId.of("playerTwoId"), 0, 1, Mark.O],
          [PlayerId.of("playerOneId"), 1, 1, Mark.X],
          [PlayerId.of("playerTwoId"), 1, 0, Mark.O],
        ],
        playerMove: [PlayerId.of("playerOneId"), 2, 0, Mark.X],
      },
    ])(
      "should return a GameState with the winner when the Player has won the game with a diagonal line",
      ({ history, playerMove }) => {
        const gameId = GameId.of("id");
        const playerOneId = PlayerId.of("playerOneId");
        const playerTwoId = PlayerId.of("playerTwoId");

        const moves = history.map(([playerId, row, column, mark]) => {
          return createMock<Move>({
            playerId,
            row,
            column,
            mark,
          });
        }) as Moves;

        const [playerId, row, column, mark] = playerMove;

        const move = createMock<Move>({
          gameId,
          playerId,
          row,
          column,
          mark,
        });

        const game = new Game(gameId, playerOneId, playerTwoId, moves);
        const actual = game.place(move);

        expect(actual.unwrap()).toEqual({
          state: "Diagonal Win",
          winner: playerId,
        });
      },
    );

    it("should return a Draw GameState when the board is full and no player won", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const moves: Moves = [
        createMock<Move>({ row: 0, column: 0, mark: Mark.X, playerId: playerOneId }),
        createMock<Move>({ row: 1, column: 1, mark: Mark.O, playerId: playerTwoId }),
        createMock<Move>({ row: 0, column: 1, mark: Mark.X, playerId: playerOneId }),
        createMock<Move>({ row: 0, column: 2, mark: Mark.O, playerId: playerTwoId }),
        createMock<Move>({ row: 2, column: 0, mark: Mark.X, playerId: playerOneId }),
        createMock<Move>({ row: 1, column: 0, mark: Mark.O, playerId: playerTwoId }),
        createMock<Move>({ row: 1, column: 2, mark: Mark.X, playerId: playerOneId }),
        createMock<Move>({ row: 2, column: 1, mark: Mark.O, playerId: playerTwoId }),
      ];

      const move = createMock<Move>({
        gameId,
        playerId: PlayerId.of("playerOneId"),
        row: 2,
        column: 2,
        mark: Mark.X,
      });

      const game = new Game(gameId, playerOneId, playerTwoId, moves);
      const actual = game.place(move);

      expect(actual.unwrap()).toEqual({
        state: "Draw",
      });
    });

    it("should return an In Progress GameState when the board is not full and no player won", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const moves: Moves = [
        createMock<Move>({ row: 0, column: 0, mark: Mark.X, playerId: playerOneId }),
        createMock<Move>({ row: 0, column: 1, mark: Mark.O, playerId: playerTwoId }),
      ];

      const move = createMock<Move>({
        gameId,
        playerId: PlayerId.of("playerOneId"),
        row: 2,
        column: 1,
        mark: Mark.X,
      });

      const game = new Game(gameId, playerOneId, playerTwoId, moves);
      const actual = game.place(move);

      expect(actual.unwrap()).toEqual({
        state: "In Progress",
      });
    });

    it("should apply a PlayerMoved event", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const move = createMock<Move>({
        id: MoveId.of("moveId"),
        gameId,
        playerId: PlayerId.of("playerOneId"),
        row: 0,
        column: 0,
        mark: Mark.X,
      });

      const game = new Game(gameId, playerOneId, playerTwoId);
      game.place(move);

      const actual = game.pullDomainEvents();

      expect(actual).toEqual([new PlayerMoved(gameId, playerOneId, move.id)]);
    });

    it("should apply a GameEnded event when the game is ended after a Player places a move", () => {
      const gameId = GameId.of("id");
      const playerOneId = PlayerId.of("playerOneId");
      const playerTwoId = PlayerId.of("playerTwoId");

      const moves: Moves = [
        createMock<Move>({ row: 0, column: 0, mark: Mark.X, playerId: playerOneId }),
        createMock<Move>({ row: 1, column: 1, mark: Mark.O, playerId: playerTwoId }),
        createMock<Move>({ row: 0, column: 1, mark: Mark.X, playerId: playerOneId }),
        createMock<Move>({ row: 0, column: 2, mark: Mark.O, playerId: playerTwoId }),
        createMock<Move>({ row: 2, column: 0, mark: Mark.X, playerId: playerOneId }),
        createMock<Move>({ row: 1, column: 0, mark: Mark.O, playerId: playerTwoId }),
        createMock<Move>({ row: 1, column: 2, mark: Mark.X, playerId: playerOneId }),
        createMock<Move>({ row: 2, column: 1, mark: Mark.O, playerId: playerTwoId }),
      ];

      const move = createMock<Move>({
        gameId,
        playerId: playerOneId,
        row: 2,
        column: 2,
        mark: Mark.X,
      });

      const game = new Game(gameId, playerOneId, playerTwoId, moves);
      game.place(move);

      const actual = game.pullDomainEvents();

      expect(actual).toEqual([
        new PlayerMoved(gameId, playerOneId, move.id),
        new GameEnded(gameId),
      ]);
    });
  });
});
