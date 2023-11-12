import { IsEnum, IsInt, IsUUID, Max, Min } from "class-validator";
import { Mark, RowOrColumnValue } from "../../domain/entities";

export class PlaceMoveRequest {
  @IsUUID()
  public playerId!: string;

  @IsInt()
  @Min(0)
  @Max(2)
  public row!: RowOrColumnValue;

  @IsInt()
  @Min(0)
  @Max(2)
  public column!: RowOrColumnValue;

  @IsEnum(Mark)
  public mark!: Mark;
}
