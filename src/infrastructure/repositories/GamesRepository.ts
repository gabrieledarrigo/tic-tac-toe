import { EntityManager } from "typeorm";
import { Game } from "../../domain/entities";
import { Games } from "../../domain/repositories/Games";

export class GamesRepository implements Games {
  constructor(entityManager: EntityManager) {}

  public async create(): Promise<Game> {
    throw new Error("Method not implemented.");
  }
}
