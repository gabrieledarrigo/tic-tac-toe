import { Game } from "../entities";

export interface Games {
  create(): Promise<Game>;
}
