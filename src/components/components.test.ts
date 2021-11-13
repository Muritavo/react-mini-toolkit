import { generateOutput } from "./";

it("Should generate documentation correctly", () => {
  const MOCK_BUSINESS_RULE =
    "Should write this business rule to the Readme and test";
  const outputFiles = generateOutput(
    "MockComponent",
    "A component to check that everything is fine",
    {
      documentation: true,
      intl: false,
      scss: false,
      storybook: false,
      tests: true,
    },
    {
      documentation: {
        businessRules: [MOCK_BUSINESS_RULE],
      },
    }
  );
  const readmeOutput = outputFiles["README.md"];
  const testOutput = outputFiles["MockComponent.test.tsx"];
  expect(readmeOutput).toBeDefined();
  expect(readmeOutput).toContain(MOCK_BUSINESS_RULE);
  expect(testOutput).toContain(MOCK_BUSINESS_RULE);
});
