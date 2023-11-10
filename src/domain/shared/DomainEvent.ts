/**
 * Base class for domain events.
 */
export abstract class DomainEvent {
  public readonly timestamp: number;

  constructor() {
    this.timestamp = Date.now();
  }
}
