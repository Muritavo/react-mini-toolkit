import { join } from "path";

import { assertFilesCompile } from "../testUtils/ts-validation";
import { createContextFile } from "../context";

it("Generated context should be able to compile", () => {
  const mockContext = createContextFile(
    join("/root/path/to/project/src/folder/", "ContextFolder"),
    "Test"
  );
  assertFilesCompile({
    [mockContext.filepath]: mockContext.code,
  });
});
