import { Module } from "@nestjs/common";
import { GameController } from "./controllers/Game.controller";
import { TestRepository } from "../infrastructure/repositories/TestRepository";
import { Prisma } from "../infrastructure/Prisma";

@Module({
  imports: [],
  controllers: [GameController],
  providers: [Prisma, TestRepository],
})
export class AppModule {}
