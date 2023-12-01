import {
  BadRequestException,
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
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
import { PlaceMoveRequest } from "../dtos/PlaceMoveRequest.dto";
import { PlaceMove } from "../commands/PlaceMove";
import { GameState } from "../../domain/values/GameState";
import { NewGameRequest } from "../dtos/NewGameRequest.dto";

@Controller("/api/games")
export class GamesController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  public async newGame(
    @Body() newGameRequest: NewGameRequest
  ): Promise<NewGameResponse> {
    const result = (
      await this.commandBus.execute<NewGame, Result<GameId>>(
        new NewGame(PlayerId.of(newGameRequest.playerOneId))
      )
    ).unwrapOrElse((error) => {
      throw new BadRequestException(error);
    });

    return new NewGameResponse(result.value);
  }

  @Post(":id")
  public async joinGame(
    @Param("id", ParseUUIDPipe) gameId: string,
    @Body() joinGameRequest: JoinGameRequest
  ): Promise<void> {
    const result = await this.commandBus.execute<JoinGame, Result<void>>(
      new JoinGame(GameId.of(gameId), PlayerId.of(joinGameRequest.playerId))
    );

    return result.unwrapOrElse((error) => {
      throw new BadRequestException(error.message);
    });
  }

  @Post(":id/moves")
  public async placeMove(
    @Param("id", ParseUUIDPipe) gameId: string,
    @Body() placeMoveRequest: PlaceMoveRequest
  ): Promise<GameState> {
    const result = await this.commandBus.execute<PlaceMove, Result<GameState>>(
      new PlaceMove(
        GameId.of(gameId),
        PlayerId.of(placeMoveRequest.playerId),
        placeMoveRequest.row,
        placeMoveRequest.column,
        placeMoveRequest.mark
      )
    );

    return result.unwrapOrElse((error) => {
      throw new BadRequestException(error.message);
    });
  }
}
