import { Injectable } from "@nestjs/common";
import { Prisma } from "../Prisma";
import { Games } from "../../domain/repositories/Games";
import { Game } from "../../domain/entities";
import * as uuid from "uuid";

@Injectable()
export class GamesRepository implements Games {
  constructor(private readonly prisma: Prisma) {}

  public nextIdentity(): string {
    return uuid.v4();
  }

  public async persist(game: Game): Promise<void> {
    await this.prisma.game.create({
      data: {
        id: game.id,
      },
    });
  }
}
