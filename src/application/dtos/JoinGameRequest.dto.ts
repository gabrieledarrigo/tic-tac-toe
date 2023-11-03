import { IsUUID } from "class-validator";

export class JoinGameRequest {
  @IsUUID()
  public readonly playerId!: string;
}
