import { generateOutput } from "./";

it("Should generate documentation correctly", () => {
  const MOCK_BUSINESS_RULE =
    "Should write this business rule to the Readme and test";
  const outputFiles = generateOutput(
    "MockComponent",
    "A component to check that everything is fine",
    {
      intl: false,
      scss: false,
      storybook: false,
      tests: true,
    },
    {
      tests: {
        businessRules: [MOCK_BUSINESS_RULE],
      },
    }
  );
  const testOutput = outputFiles["MockComponent.test.tsx"];
  expect(testOutput).toContain(MOCK_BUSINESS_RULE);
});
