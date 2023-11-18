import { IsUUID } from "class-validator";

export class NewGameRequest {
  @IsUUID()
  playerOneId!: string;
}
