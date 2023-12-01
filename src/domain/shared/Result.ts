/**
 * Represents a failure result with an associated error.
 */
export class Failure {
  private constructor(public readonly error: Error) {}

  public isSuccess(): this is Success<unknown> {
    return false;
  }

  public isFailure(): this is Failure {
    return true;
  }

  public unwrap(): never {
    throw this.error;
  }

  public unwrapOrElse<O>(fn: (error: Error) => O): O {
    return fn(this.error);
  }

  public static of(error: Error): Failure {
    return new Failure(error);
  }
}

/**
 * Represents a successful result with a value of type T.
 */
export class Success<T> {
  private constructor(public readonly value: T) {}

  public isSuccess(): this is Success<T> {
    return true;
  }

  public isFailure(): this is Failure {
    return false;
  }

  public unwrap(): T {
    return this.value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public unwrapOrElse<O>(_fn: (error: Error) => O): T {
    return this.unwrap();
  }

  public static of<T>(value: T): Success<T> {
    return new Success(value);
  }
}

/**
 * Represents the result of an operation that can either succeed with a value of type T,
 * or fail with a generic Failure object.
 */
export type Result<T> = Success<T> | Failure;
