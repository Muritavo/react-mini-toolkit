import { existsSync, mkdirSync } from "fs";
import { prompt } from "inquirer";
import { join, resolve } from "path";

export const GENERATION_MODEL = [
  {
    type: "@testing-library/react",
    description: "@testing-library/react (Usefull for unit testing)",
  },
  {
    type: "@cypress/react",
    description: "@cypress/react         (Usefull for e2e)",
  },
] as const;

const specification: FeatureControl<"tests"> = {
  name: "tests",
  checked: true,
  generateOutput: function generateTestsFile(
    componentFolder: string,
    componentName: string,
    features: { [k in AvailableFeatures]: boolean },
    featureData: FeatureData
  ) {
    const whichLibraryToUse = (function () {
      const componentSuffix = featureData.entry.model === "compact" || features.storybook === true ? "" : ".view";
      switch (featureData.tests?.model) {
        case "@testing-library/react":
          return {
            import: `import { render } from '@testing-library/react';`,
            callToRender: "render",
            callToTest: "it.todo",
            importComp: `./${componentName}${componentSuffix}`,
          };
        case "@cypress/react":
          return {
            import: `import { mount } from 'cypress/react';`,
            callToRender: "mount",
            callToTest: "it",
            importComp: `${componentFolder.split("src/")[1]}/${componentName}${componentSuffix}`,
          };
        default:
          throw new Error(
            `The generation for model ${featureData.tests?.model} is not implemented yet`
          );
      }
    })();
    const businessRules = featureData.tests?.businessRules;
    const whereToImportTheComponentFrom = features.storybook
      ? `import { InitialImplementation as Component } from '${whichLibraryToUse.importComp}.stories';`
      : `import Component from '${whichLibraryToUse.importComp}';`;
    const componentRender = features.intl
      ? `<IntlProvider locale="pt-br">
            <Component {...props}/>
        </IntlProvider>`
      : `<Component {...props}/>`;
    const content = `import React from 'react';
${whichLibraryToUse.import}
${features.intl ? "import { IntlProvider } from 'react-intl';" : ""}
${whereToImportTheComponentFrom}

function renderScreen(props: React.ComponentProps<typeof Component>) {
  return ${whichLibraryToUse.callToRender}(${componentRender});
}

it('Should at least render :)', () => {
    renderScreen({});
})

${!!businessRules?.length
        ? businessRules
          .map((r) => `${whichLibraryToUse.callToTest}("${r}");`)
          .join("\n")
        : ""
      }`;
    const filename = (() => {
      switch (featureData.tests?.model) {
        case "@cypress/react":
          const currentDir = componentFolder;
          if (!currentDir.includes("src"))
            throw new Error(
              `The destination folder is not a subdirectory of 'src' (Destination folder: ${currentDir}), this is an unexpected usage of model ${featureData.tests?.model}`
            );
          const cypressRelativeDir = currentDir.replace(
            "src",
            join("cypress", "integration")
          );

          if (!existsSync(cypressRelativeDir))
            mkdirSync(cypressRelativeDir, { recursive: true });
          return join(cypressRelativeDir, `${componentName}.test.tsx`);
        case "@testing-library/react":
          return join(componentFolder, `${componentName}.test.tsx`);
        default:
          throw new Error(
            `There is no filename defined for model ${featureData.tests?.model}`
          );
      }
    })();
    return {
      content,
      filepath: filename,
    };
  },
  inquireData: async function inquireTestsData() {
    const businessRules: string[] = [];
    let lastAnswer: string | undefined = undefined;
    let firstTime = true;
    do {
      if (lastAnswer) businessRules.push(lastAnswer);
      const result = await prompt([
        {
          message: firstTime
            ? `The business rules this component should be covering ${require("chalk").green(
              "(Click Enter/Return to finish)"
            )}:\n   `
            : " ",
          name: "business-rule",
          type: "input",
        },
      ]);
      lastAnswer = result["business-rule"];
      firstTime = false;
    } while (lastAnswer !== "");

    const { model }: { model: typeof GENERATION_MODEL[number]["description"] } =
      await prompt([
        {
          message: "Which library to use for testing",
          name: "model",
          type: "list",
          choices: GENERATION_MODEL.map((a) => a.description),
        },
      ]);

    return {
      businessRules,
      model: GENERATION_MODEL.find((a) => a.description === model)!.type,
    };
  },
};

export default specification;
