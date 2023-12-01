import { ApiProperty } from "@nestjs/swagger";
import { PlayerId } from "../../domain/values/PlayerId";

export class NewPlayerResponse {
  @ApiProperty({ format: "uuid" })
  public readonly playerId: string;

  constructor(playerId: PlayerId) {
    this.playerId = playerId.value;
  }
}
