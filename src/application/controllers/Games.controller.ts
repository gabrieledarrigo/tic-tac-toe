import { Controller, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { NewGame } from "../commands/NewGame.command";
import { GameId } from "../../domain/values/GameId";
import { Result } from "../../domain/shared/Result";
import { NewGameResponse } from "../dtos/NewGameResponse.dto";

@Controller("/api/games")
export class GamesController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  public async get(): Promise<NewGameResponse> {
    const result = await this.commandBus.execute<NewGame, Result<GameId>>(
      new NewGame()
    );

    return new NewGameResponse(result.unwrap().value);
  }
}
