import { IsEnum, IsInt, IsUUID, Max, Min } from "class-validator";
import { Mark, RowOrColumnValue } from "../../domain/entities";
import { ApiProperty } from "@nestjs/swagger";

export class PlaceMoveRequest {
  @IsUUID()
  @ApiProperty({ format: "uuid" })
  public playerId!: string;

  @IsInt()
  @Min(0)
  @Max(2)
  @ApiProperty({ type: "number" })
  public row!: RowOrColumnValue;

  @IsInt()
  @Min(0)
  @Max(2)
  @ApiProperty({ type: "number" })
  public column!: RowOrColumnValue;

  @IsEnum(Mark)
  public mark!: Mark;
}
