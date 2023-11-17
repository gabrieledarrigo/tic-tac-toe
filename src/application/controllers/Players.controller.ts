import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { NewPlayer } from "../commands/NewPlayer.command";
import { Result } from "../../domain/shared/Result";
import { PlayerId } from "../../domain/values/PlayerId";
import { Email } from "../../domain/values/Email";
import { NewPlayerRequest } from "../dtos/NewPlayerRequest.dto";
import { NewPlayerResponse } from "../dtos/NewPlayerResponse.dto";

@Controller("/api/players")
export class PlayersController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  public async newPlayer(
    @Body() newPlayerRequest: NewPlayerRequest
  ): Promise<NewPlayerResponse> {
    const result = (
      await this.commandBus.execute<NewPlayer, Result<PlayerId>>(
        new NewPlayer(Email.of(newPlayerRequest.email))
      )
    ).unwrapOrElse((error) => {
      throw new BadRequestException(error);
    });

    return new NewPlayerResponse(result.value);
  }
}
