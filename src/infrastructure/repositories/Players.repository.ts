import * as uuid from "uuid";
import { Players } from "../../domain/repositories/Players";
import { PlayerId } from "../../domain/values/PlayerId";
import { Player } from "../../domain/entities";
import { Prisma } from "../Prisma";
import { Injectable } from "@nestjs/common";
import { PlayerFactory } from "../factories/Player.factory";

@Injectable()
export class PlayersRepository implements Players {
  constructor(private readonly prisma: Prisma) {}

  public nextIdentity(): PlayerId {
    return PlayerId.of(uuid.v4());
  }

  public async byId(id: PlayerId): Promise<Player | null> {
    const player = await this.prisma.player.findUnique({
      where: {
        id: id.value,
      },
    });

    if (!player) {
      return null;
    }

    return PlayerFactory.create(player);
  }

  public async persist(player: Player): Promise<void> {
    await this.prisma.player.create({
      data: {
        id: player.id.value,
        email: player.email.value,
      },
    });
  }
}
