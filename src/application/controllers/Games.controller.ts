import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { NewGame } from "../commands/NewGame.command";
import { GameId } from "../../domain/values/GameId";
import { Result } from "../../domain/shared/Result";
import { NewGameResponse } from "../dtos/NewGameResponse.dto";
import { JoinGameRequest } from "../dtos/JoinGameRequest.dto";
import { JoinGame } from "../commands/JoinGame.command";
import { PlayerId } from "../../domain/values/PlayerId";

@Controller("/api/games")
export class GamesController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  public async newGame(): Promise<NewGameResponse> {
    const result = (
      await this.commandBus.execute<NewGame, Result<GameId>>(new NewGame())
    ).unwrapOrElse((error) => {
      throw new BadRequestException(error);
    });

    return new NewGameResponse(result.value);
  }

  @Post(":id")
  public async joinGame(
    @Param("id") gameId: string,
    @Body() joinGameRequest: JoinGameRequest
  ): Promise<void> {
    const result = await this.commandBus.execute<JoinGame, Result<void>>(
      new JoinGame(GameId.of(gameId), PlayerId.of(joinGameRequest.playerId))
    );

    return result.unwrapOrElse((error) => {
      throw new BadRequestException(error);
    });
  }
}
