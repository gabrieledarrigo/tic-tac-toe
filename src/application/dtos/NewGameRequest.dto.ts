import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class NewGameRequest {
  @IsUUID("4")
  @ApiProperty({ format: "uuid" })
  playerOneId!: string;
}
