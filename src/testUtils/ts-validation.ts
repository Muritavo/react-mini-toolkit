import { getDiagnosticsForText } from "../testUtils/utils";

export function assertFilesCompile(outputFiles: {
    [fileName: string]: string
}) {
  const outputResult = getDiagnosticsForText(outputFiles).map(
    (o) => o.messageText
  );

  const errors = outputResult.filter((o) => {
    const a = JSON.stringify(o);
    return (
      !a.includes(`MockComponent.module.scss'`) &&
      !a.includes("README.md") &&
      !a.includes("'cypress'") &&
      !a.includes("'Cypress'") &&
      !a.includes("'JQuery'")
    );
  });
  expect(errors).toHaveLength(0);
}
