import { generateOutput, writeOutputToDisk } from "./";
import { existsSync, writeFileSync } from "fs";
jest.mock("fs");

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

it("Should not write files to disk when they exists", () => {
  writeOutputToDisk("some/folder", "somefile.tsx", "somecontent");
  expect(writeFileSync).toHaveBeenCalledTimes(1);
  jest.clearAllMocks();
  (existsSync as jest.Mock).mockImplementation(() => true);
  writeOutputToDisk("another/folder", "anotherFile.tsx", "another content");
  expect(writeFileSync).toHaveBeenCalledTimes(0);
});
