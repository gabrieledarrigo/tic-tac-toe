import { DomainEvent } from "./DomainEvent";

export abstract class AggregateRoot {
  private readonly domainEvents: DomainEvent[] = [];

  public apply(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  public pullDomainEvents(): DomainEvent[] {
    return this.domainEvents;
  }
}
