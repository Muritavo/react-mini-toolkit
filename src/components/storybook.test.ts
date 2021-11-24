import { replaceUpperCaseBySpace } from "./storybook";

it("Should replace with space", () => {
  expect(replaceUpperCaseBySpace("SomeComponent")).toEqual("Some Component");
});
