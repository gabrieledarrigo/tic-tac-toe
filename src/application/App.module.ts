import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GamesController } from "./controllers/Games.controller";
import { Prisma } from "../infrastructure/Prisma";
import { GamesRepository } from "../infrastructure/repositories/Games.repository";
import { NewGameCommandHandler } from "./commands/NewGame.command";

@Module({
  imports: [CqrsModule],
  controllers: [GamesController],
  providers: [Prisma, GamesRepository, NewGameCommandHandler],
})
export class AppModule {}
