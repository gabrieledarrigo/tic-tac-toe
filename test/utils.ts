/* eslint-disable @typescript-eslint/no-explicit-any */
type NonMockableTypes =
  | number
  | boolean
  | string
  | symbol
  | bigint
  | Date
  | RegExp
  | Generator;

type MockedFn<A extends any[], R> = ((...args: A) => R) | jest.Mock<R, A>;

type MockObject<T> = {
  [K in keyof T]?: MockOverrides<T[K]>;
};

type MockOverrides<T> = T extends NonMockableTypes
  ? T
  : T extends Array<infer ItemType>
    ? MockOverrides<ItemType>[]
    : T extends InstanceType<any>
      ? MockObject<T>
      : T extends (...args: infer Args) => infer ReturnType
        ? MockedFn<Args, ReturnType>
        : T extends object
          ? MockObject<T>
          : never;

export function createMock<T extends object>(overrides?: MockOverrides<T>): T {
  return (overrides || {}) as T;
}
