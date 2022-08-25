import { prompt } from "inquirer";
import { join } from "path";

export const STYLES_GENERATION_MODEL = [
  {
    type: "scss",
    description: "SCSS (SCSS Modules)",
  },
  {
    type: "mui",
    description: "Material UI Styles",
  },
] as const;

const specs: FeatureControl<"styles"> = {
  name: "styles",
  checked: false,
  generateOutput: function generateScssOutput(
    componentFolder,
    componentName: string,
    featureConfig: FeatureData
  ) {
    switch (featureConfig.styles!.model) {
      case "mui":
        return {
          filepath: join(componentFolder, `${componentName}.styles.tsx`),
          content: `import { makeStyles } from '@material-ui/core';

const use${componentName}Styles = makeStyles({});

export default use${componentName}Styles;`,
        }
      case "scss":
        return {
          filepath: join(componentFolder, `${componentName}.module.scss`),
          content: ``,
        };
    }
  },
  inquireData: async function inquireTestsData() {
    const { model }: { model: typeof STYLES_GENERATION_MODEL[number]["description"] } =
      await prompt([
        {
          message: "Which style model to use",
          name: "model",
          type: "list",
          choices: STYLES_GENERATION_MODEL.map((a) => a.description),
        },
      ]);

    return {
      model: STYLES_GENERATION_MODEL.find((a) => a.description === model)!.type,
    };
  }
};

export default specs;
