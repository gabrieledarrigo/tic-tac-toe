import { MoveFactory } from "./MoveFactory";
import { Move } from "../../domain/entities";
import { GameId } from "../../domain/values/GameId";
import { PlayerId } from "../../domain/values/PlayerId";
import { Mark } from "../../domain/entities";
import { MoveGetPayload } from "../repositories/types";
import { MoveId } from "../../domain/values/MoveId";

describe("MoveFactory", () => {
  describe("create", () => {
    it("should create a Move from a MoveGetPayload", () => {
      const moveGetPayload: MoveGetPayload = {
        id: "moveId",
        gameId: "gameId",
        playerId: "playerId",
        row: 0,
        column: 0,
        mark: Mark.X,
        placedAt: new Date("01/01/2023"),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const expectedMove = new Move(
        MoveId.of("moveId"),
        GameId.of("gameId"),
        PlayerId.of("playerId"),
        0,
        0,
        Mark.X,
        new Date("01/01/2023"),
      );

      const actualMove = MoveFactory.create(moveGetPayload);

      expect(actualMove).toEqual(expectedMove);
    });
  });
});
