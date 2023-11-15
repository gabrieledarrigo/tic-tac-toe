import { GameState } from "./GameState";
import { PlayerId } from "./PlayerId";

describe("GameState", () => {
  describe("of", () => {
    it("should create a new GameState instance with the given state and winner", () => {
      const winner = PlayerId.of("playerId");

      const gameState = GameState.of("Draw", winner);

      expect(gameState.state).toEqual("Draw");
      expect(gameState.winner).toEqual(winner);
    });

    it("should create a new GameState instance with the given state and no winner", () => {
      const gameState = GameState.of("In Progress");

      expect(gameState.state).toEqual("In Progress");
      expect(gameState.winner).toBeUndefined();
    });
  });

  describe("isEnded", () => {
    it.each(["Horizontal Win", "Vertical Win", "Diagonal Win", "Draw"])(
      "should return true when the game state is %s",
      () => {
        const gameState = GameState.of("Horizontal Win");

        expect(gameState.isEnded()).toBe(true);
      }
    );
  });
});
