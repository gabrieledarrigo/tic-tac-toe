beforeAll(() => {
  jest.useFakeTimers().setSystemTime(new Date());
});

afterAll(() => {
  jest.useRealTimers();
});
