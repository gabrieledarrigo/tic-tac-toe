import { AggregateRoot } from "./AggregateRoot";
import { Event } from "./Event";

describe("AggregateRoot", () => {
  describe("apply", () => {
    class TestEvent extends Event {}
    class TestAggregateRoot extends AggregateRoot {}

    it("should add the event to the domain events", () => {
      const aggregateRoot = new TestAggregateRoot();
      const event = new TestEvent();

      aggregateRoot.apply(event);

      expect(aggregateRoot.getDomainEvents()).toEqual([event]);
    });
  });
});
