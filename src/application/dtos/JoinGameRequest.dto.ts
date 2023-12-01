import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class JoinGameRequest {
  @IsUUID("4")
  @ApiProperty({ format: "uuid" })
  public readonly playerId!: string;
}
