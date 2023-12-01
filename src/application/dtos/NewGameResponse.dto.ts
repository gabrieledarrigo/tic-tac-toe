import { ApiProperty } from "@nestjs/swagger";
import { GameId } from "../../domain/values/GameId";

export class NewGameResponse {
  @ApiProperty({ format: "uuid" })
  public readonly id: string;

  constructor(id: GameId) {
    this.id = id.value;
  }
}
