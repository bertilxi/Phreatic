module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsConfig: "./__tests__/tsconfig.json"
    }
  }
};
