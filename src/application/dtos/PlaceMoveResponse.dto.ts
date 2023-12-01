import { ApiProperty } from "@nestjs/swagger";
import { GameState, State } from "../../domain/values/GameState";

export class PlaceMoveResponse {
  public readonly state: State;

  @ApiProperty({ format: "uuid" })
  public readonly winner?: string;

  constructor(gameState: GameState) {
    this.state = gameState.state;
    this.winner = gameState.winner?.value;
  }
}
