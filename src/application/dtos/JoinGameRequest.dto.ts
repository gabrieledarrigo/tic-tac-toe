import { IsUUID } from "class-validator";

export class JoinGameRequest {
  @IsUUID("4")
  public readonly playerId!: string;
}
