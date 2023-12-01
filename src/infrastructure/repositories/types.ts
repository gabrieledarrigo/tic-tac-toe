import { Prisma } from "@prisma/client";

export type PlayerGetPayload = Prisma.PlayerGetPayload<Record<string, never>>;

export type GameGetPayload = Prisma.GameGetPayload<{
  include: {
    moves: true;
  };
}>;

export type MoveGetPayload = Prisma.MoveGetPayload<Record<string, never>>;
