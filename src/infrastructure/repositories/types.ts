import { Prisma } from "@prisma/client";

export type Player = Prisma.PlayerGetPayload<{}>;

export type GameWithPlayers = Prisma.GameGetPayload<{
  include: {
    playerOne: boolean;
    playerTwo: boolean;
  };
}>;
