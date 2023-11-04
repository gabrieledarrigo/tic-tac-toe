import { Injectable } from "@nestjs/common";
import { Prisma } from "../Prisma";
import { Games } from "../../domain/repositories/Games";
import { Game } from "../../domain/entities";
import * as uuid from "uuid";
import { GameId } from "../../domain/values/GameId";
import { GameFactory } from "../factories/Game.factory";
import { Failure, Result, Success } from "../../domain/shared/Result";

@Injectable()
export class GamesRepository implements Games {
  constructor(private readonly prisma: Prisma) {}

  public nextIdentity(): GameId {
    return GameId.of(uuid.v4());
  }

  public async byId(id: GameId): Promise<Result<Game>> {
    const game = await this.prisma.game.findUnique({
      where: {
        id: id.value,
      },
    });

    if (!game) {
      return Failure.of(new Error(`Cannot find Game with id: ${id.value}`));
    }

    return Success.of(GameFactory.create(game));
  }

  public async persist(game: Game): Promise<void> {
    await this.prisma.game.create({
      data: {
        id: game.id.value,
        playerOneId: game.getPlayerOneId()?.value,
        playerTwoId: game.getPlayerTwoId()?.value,
      },
    });
  }
}
