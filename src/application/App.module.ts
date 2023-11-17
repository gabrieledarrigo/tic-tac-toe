import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GamesController } from "./controllers/Games.controller";
import { Prisma } from "../infrastructure/Prisma";
import { GamesRepository } from "../infrastructure/repositories/Games.repository";
import { NewGameCommandHandler } from "./commands/NewGame.command";
import { JoinGameCommandHandler } from "./commands/JoinGame.command";
import { PlayersRepository } from "../infrastructure/repositories/Players.repository";
import { PlaceMoveCommandHandler } from "./commands/PlaceMove";
import { NewPlayerCommandHandler } from "./commands/NewPlayer.command";
import { PlayersController } from "./controllers/Players.controller";

@Module({
  imports: [CqrsModule],
  controllers: [GamesController, PlayersController],
  providers: [
    Prisma,
    GamesRepository,
    PlayersRepository,
    NewPlayerCommandHandler,
    NewGameCommandHandler,
    JoinGameCommandHandler,
    PlaceMoveCommandHandler,
  ],
})
export class AppModule {}
