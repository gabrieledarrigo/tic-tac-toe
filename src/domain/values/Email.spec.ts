import { Email } from "./Email";

describe("Email", () => {
  describe("of", () => {
    it("should create an Email instance with the specified value", () => {
      const emailValue = "test@example.com";
      const email = Email.of(emailValue);

      expect(email.value).toBe(emailValue);
    });

    it("should throw an error if the value is not a valid email address", () => {
      const invalidEmailValue = "invalid-email";

      expect(() => Email.of(invalidEmailValue)).toThrowError(
        "Invalid email address",
      );
    });
  });
});
