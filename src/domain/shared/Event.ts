export abstract class Event {
  public readonly timestamp: number;

  constructor() {
    this.timestamp = Date.now();
  }
}
