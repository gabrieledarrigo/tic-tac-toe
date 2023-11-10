import { AggregateRoot } from "./AggregateRoot";
import { DomainEvent } from "./DomainEvent";

describe("AggregateRoot", () => {
  class TestEvent extends DomainEvent {}
  class TestAggregateRoot extends AggregateRoot {}

  describe("apply", () => {
    it("should add the event to the domain events", () => {
      const aggregateRoot = new TestAggregateRoot();
      const event = new TestEvent();

      aggregateRoot.apply(event);

      expect(aggregateRoot.pullDomainEvents()).toEqual([event]);
    });
  });

  describe("pullDomainEvents", () => {
    it("should return an empty array if no events have been applied", () => {
      const aggregateRoot = new TestAggregateRoot();

      expect(aggregateRoot.pullDomainEvents()).toEqual([]);
    });

    it("should return all applied events", () => {
      const aggregateRoot = new TestAggregateRoot();
      const event1 = new TestEvent();
      const event2 = new TestEvent();

      aggregateRoot.apply(event1);
      aggregateRoot.apply(event2);

      expect(aggregateRoot.pullDomainEvents()).toEqual([event1, event2]);
    });
  });
});
