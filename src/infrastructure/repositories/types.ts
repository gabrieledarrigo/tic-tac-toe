import { Prisma } from "@prisma/client";

export type Player = Prisma.PlayerGetPayload<{}>;

export type Game = Prisma.GameGetPayload<{}>;
