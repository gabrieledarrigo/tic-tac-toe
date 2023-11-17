import { NewPlayerCreated } from "../events/NewPlayerCreated";
import { AggregateRoot } from "../shared/AggregateRoot";
import { Email } from "../values/Email";
import { PlayerId } from "../values/PlayerId";

/**
 * Represents a player in the game.
 */
export class Player extends AggregateRoot {
  /**
   * Creates an instance of Player.
   * @constructor
   * @param id - The unique identifier of the player.
   * @param email - The email address of the player.
   */
  constructor(public readonly id: PlayerId, public readonly email: Email) {
    super();
  }

  /**
   * Creates a new Player instance with the specified id and email.
   * Applies the NewPlayerCreated event.
   * @param id The id of the player.
   * @param email The email of the player.
   * @returns The newly created Player instance.
   */
  public static new(id: PlayerId, email: Email): Player {
    const player = new Player(id, email);
    player.apply(new NewPlayerCreated(id));

    return player;
  }
}
