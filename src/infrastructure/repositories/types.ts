import { Prisma } from "@prisma/client";

export type Player = Prisma.PlayerGetPayload<{}>;

export type GameGetPayload = Prisma.GameGetPayload<{
  include: {
    moves: true;
  };
}>;

export type MoveGetPayload = Prisma.MoveGetPayload<{}>;
