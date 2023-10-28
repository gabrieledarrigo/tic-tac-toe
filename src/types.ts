export class Failure {
  private constructor(public readonly error: Error) {}

  public isSuccess(): this is Success<any> {
    return false;
  }

  public isFailure(): this is Failure {
    return true;
  }

  public static of(error: Error): Failure {
    return new Failure(error);
  }
}

export class Success<T> {
  private constructor(public readonly value: T) {}

  public isSuccess(): this is Success<T> {
    return true;
  }

  public isFailure(): this is Failure {
    return false;
  }

  public static of<T>(value: T): Success<T> {
    return new Success(value);
  }
}

export type Result<T> = Success<T> | Failure;
