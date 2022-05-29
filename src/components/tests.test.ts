import { join } from "path";
import Tests from "./tests";

const resolveSpy = jest.spyOn(require("path"), "resolve");
const mkdirSyncSpy = jest.spyOn(require("fs"), "mkdirSync");
it("Should generate a different path", () => {
  resolveSpy.mockImplementationOnce(() => "root/path/to/project/src/folder/");
  mkdirSyncSpy.mockImplementation(() => {});
  const result = Tests.generateOutput(
    join("root/path/to/project/src/folder/", "TestComponent"),
    "TestComponent",
    { tests: true } as FeatureMap,
    {
      tests: {
        businessRules: [],
        model: "@cypress/react",
      },
    } as FeatureData
  );
  expect(result.filepath).toContain("cypress/integration");
});
