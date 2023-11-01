const config = {
  clearMocks: true,
  resetMocks: true,
  resetModules: true,
  restoreMocks: true,
  preset: "ts-jest",
  rootDir: "./src",
  setupFilesAfterEnv: ["<rootDir>/../test/setup.ts"],
};

module.exports = config;
