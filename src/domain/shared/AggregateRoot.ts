import { Event } from "./Event";

export abstract class AggregateRoot {
  private readonly domainEvents: Event[] = [];

  public apply(event: Event): void {
    this.domainEvents.push(event);
  }

  public getDomainEvents(): Event[] {
    return this.domainEvents;
  }
}
