import { Email } from "../values/Email";
import { PlayerId } from "../values/PlayerId";

/**
 * Represents a player in the game.
 */
export class Player {
  /**
   * Creates an instance of Player.
   * @constructor
   * @param id - The unique identifier of the player.
   * @param email - The email address of the player.
   */
  constructor(public readonly id: PlayerId, public readonly email: Email) {}
}
