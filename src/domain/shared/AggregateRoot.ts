import { DomainEvent } from "./DomainEvent";

/**
 * Base class for all aggregate roots in the domain.
 * An aggregate root is an entity that is responsible for enforcing consistency
 * and invariants within a boundary of the domain model.
 */
export abstract class AggregateRoot {
  private readonly domainEvents: DomainEvent[] = [];

  /**
   * Applies a domain event to the aggregate root.
   * @param event The domain event to apply.
   */
  public apply(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  /**
   * Returns an array of domain events that have been recorded by the aggregate root.
   * @returns An array of domain events.
   */
  public pullDomainEvents(): DomainEvent[] {
    return this.domainEvents;
  }
}
