import { Player } from "./Player";
import { PlayerId } from "../values/PlayerId";
import { Email } from "../values/Email";
import { NewPlayerCreated } from "../events/NewPlayerCreated";

describe("Player", () => {
  describe("new", () => {
    it("given an id and an email, when a new Player is created, then it should publish a NewPlayerCreated event", () => {
      const id = PlayerId.of("id");
      const email = Email.of("player@example.com");

      const player = Player.new(id, email);

      expect(player.id).toEqual(id);
      expect(player.email).toEqual(email);
      expect(player.pullDomainEvents()).toEqual([new NewPlayerCreated(id)]);
    });
  });
});
