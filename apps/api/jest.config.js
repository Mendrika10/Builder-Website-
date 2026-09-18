/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: [".e2e-spec.ts$", ".service.spec.ts$"],
  moduleFileExtensions: ["js", "json", "ts"],
};
