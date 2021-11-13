import inquirer from "inquirer";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import TestSpecs from "./tests";
import DocumentationSpecs from "./documentation";
import SassSpecs from "./scss";
import IntlSpecs from "./intl";
import StorybookSpecs from "./storybook";

const l = require("debug")("react-mini-toolkit");

export const FEATURES: FeatureControl<AvailableFeatures>[] = [
  TestSpecs,
  SassSpecs,
  StorybookSpecs,
  IntlSpecs,
  DocumentationSpecs,
];

export default function createComponent() {
  const rootFolder = process.env.INIT_CWD || "./";
  l("Running at", rootFolder);
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the component?",
        validate: (str) =>
          /^[a-zA-Z]+$/.test(str)
            ? true
            : "The component name must have only letters",
      },
      {
        type: "input",
        name: "description",
        message:
          "Describe in a few words what is the objective of this component:",
      },
      {
        type: "checkbox",
        name: "features",
        message: "Feature to be prebuilt",
        choices: FEATURES,
      },
    ])
    .then(
      async ({
        name: componentName,
        description: componentDescription,
        features: generationFeatures,
      }) => {
        l(generationFeatures);
        l("Creating the component", componentName);
        const componentFolder = join(rootFolder, componentName);
        mkdirSync(componentFolder, { recursive: true });
        const enabledFeatures = (
          generationFeatures as (keyof Features)[]
        ).reduce((r, f) => ({ ...r, [f]: true }), {} as Features);
        const featureData = {} as FeatureData;
        for (let specs of FEATURES) {
          if (enabledFeatures[specs.name] && specs.inquireData) {
            let data!: FeatureData[keyof FeatureData];
            switch (specs.name) {
              case "documentation":
                data = await specs.inquireData();
                break;
            }
            featureData[specs.name as keyof FeatureData] = data;
          }
        }
        Object.entries(
          generateOutput(componentName, componentDescription, enabledFeatures, featureData)
        ).forEach(([filename, fileContent]) => {
          writeFileSync(join(componentFolder, filename), fileContent);
        });
      }
    );
}

type Features = { [key in typeof FEATURES[number]["name"]]: boolean };

export function generateOutput(
  componentName: string,
  componentDescription: string,
  features: Features,
  featureData: FeatureData
) {
  const files: { [filename: string]: string } = {
    "index.tsx": `export { default } from './${componentName}';\n`,
    [`${componentName}.tsx`]: generateMainFile(
      componentName,
      componentDescription,
      features
    ),
  };

  for (let specs of FEATURES) {
    if (features[specs.name as keyof Features]) {
      let output: ReturnType<
        FeatureControl<AvailableFeatures>["generateOutput"]
      >;
      switch (specs.name) {
        case "tests":
          output = specs.generateOutput(componentName, features, featureData);
          break;
        case "documentation":
          output = specs.generateOutput(componentName, componentDescription, featureData);
          break;
        case "storybook":
        case "scss":
          output = specs.generateOutput(componentName);
          break;
        default:
          output = specs.generateOutput();
          break;
      }
      files[output.filename] = output.content;
    }
  }

  return files;
}

function generateMainFile(
  componentName: string,
  componentDescription: string,
  features: { [key in typeof FEATURES[number]["name"]]: boolean }
) {
  return `import React from 'react';
${features.scss ? `import Styles from './${componentName}.module.scss';` : ""}
${
  features.intl
    ? `import { useIntl } from 'react-intl'
import messages from './messages'`
    : ""
}

/**
 * ${componentDescription}
 **/
export default function ${componentName}() {
    ${features.intl ? "const { formatMessage } = useIntl();" : ""}
    return <>${componentName}</>;
}`;
}
