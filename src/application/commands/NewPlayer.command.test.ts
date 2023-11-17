import { NewPlayer, NewPlayerCommandHandler } from "./NewPlayer.command";
import { PlayerId } from "../../domain/values/PlayerId";
import { Player } from "../../domain/entities/Player";
import { PlayersRepository } from "../../infrastructure/repositories/Players.repository";
import { Email } from "../../domain/values/Email";
import { createMock } from "../../../test/utils";
import { EventBus } from "@nestjs/cqrs";

describe("NewPlayerCommandHandler", () => {
  const players = createMock<PlayersRepository>({
    nextIdentity: jest.fn(),
    persist: jest.fn(),
  });

  const eventBus = createMock<EventBus>({
    publishAll: jest.fn(),
  });

  const playerId = PlayerId.of("id");
  const email = Email.of("player@example.com");

  describe("execute", () => {
    beforeEach(() => {
      jest.spyOn(players, "nextIdentity").mockReturnValue(playerId);
      jest.spyOn(Player, "new");
    });

    it("should create and persist a new Player", async () => {
      const command = new NewPlayer(email);
      const commandHandler = new NewPlayerCommandHandler(players, eventBus);

      await commandHandler.execute(command);

      expect(players.nextIdentity).toHaveBeenCalled();
      expect(players.persist).toHaveBeenCalledWith(Player.new(playerId, email));
    });

    it("should publish all Player domain events", async () => {
      const command = new NewPlayer(email);
      const commandHandler = new NewPlayerCommandHandler(players, eventBus);

      await commandHandler.execute(command);

      expect(eventBus.publishAll).toHaveBeenCalledWith([
        ...Player.new(playerId, email).pullDomainEvents(),
      ]);
    });

    it("should return the new PlayerId", async () => {
      const command = new NewPlayer(email);
      const commandHandler = new NewPlayerCommandHandler(players, eventBus);

      const actual = await commandHandler.execute(command);

      expect(actual.unwrap()).toEqual(playerId);
    });
  });
});
