import { AggregateRoot } from "./AggregateRoot";
import { DomainEvent } from "./DomainEvent";

describe("AggregateRoot", () => {
  describe("apply", () => {
    class TestEvent extends DomainEvent {}
    class TestAggregateRoot extends AggregateRoot {}

    it("should add the event to the domain events", () => {
      const aggregateRoot = new TestAggregateRoot();
      const event = new TestEvent();

      aggregateRoot.apply(event);

      expect(aggregateRoot.pullDomainEvents()).toEqual([event]);
    });
  });
});
