import { IsEmail } from "class-validator";

export class NewPlayerRequest {
  @IsEmail()
  email!: string;
}
