import { Injectable } from "@nestjs/common";
import { Prisma } from "../Prisma";
import { Games } from "../../domain/repositories/Games";
import { Game } from "../../domain/entities";
import * as uuid from "uuid";
import { GameId } from "../../domain/values/GameId";
import { GameFactory } from "../factories/Game.factory";
import { MoveId } from "../../domain/values/MoveId";

@Injectable()
export class GamesRepository implements Games {
  constructor(private readonly prisma: Prisma) {}

  public nextIdentity(): GameId {
    return GameId.of(uuid.v4());
  }

  public nextMoveIdentity(): MoveId {
    return MoveId.of(uuid.v4());
  }

  public async byId(id: GameId): Promise<Game | null> {
    const game = await this.prisma.game.findUnique({
      where: {
        id: id.value,
      },
      include: {
        moves: true,
      },
    });

    if (!game) {
      return null;
    }

    return GameFactory.create(game);
  }

  public async persist(game: Game): Promise<void> {
    await this.prisma.game.upsert({
      where: {
        id: game.id.value,
      },
      create: {
        playerOneId: game.getPlayerOneId()?.value,
        playerTwoId: game.getPlayerTwoId()?.value,
      },
      update: {
        moves: {
          upsert: [
            ...game.getMoves().map(({ id, playerId, row, column, mark }) => {
              const move = {
                id: id.value,
                playerId: playerId.value,
                row: row,
                column: column,
                mark: mark,
              };

              return {
                where: {
                  id: move.id,
                },
                create: move,
                update: move,
              };
            }),
          ],
        },
      },
    });
  }
}
