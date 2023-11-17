/**
 * Represents an email address.
 */
export class Email {
  private readonly REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  private constructor(public readonly value: string) {
    if (!this.isEmail(value)) {
      throw new Error("Invalid email address");
    }
  }

  /**
   * Creates an Email instance with the specified value.
   * @param value - The email address.
   * @returns An Email instance.
   * @throws Error if the value is not a valid email address.
   */
  public static of(value: string): Email {
    return new Email(value);
  }

  private isEmail(value: string): boolean {
    return this.REGEX.test(value);
  }
}
