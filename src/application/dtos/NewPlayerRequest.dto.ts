import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class NewPlayerRequest {
  @IsEmail()
  @ApiProperty({ format: "email" })
  email!: string;
}
