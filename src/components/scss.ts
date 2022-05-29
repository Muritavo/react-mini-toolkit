import { join } from "path";

const specs: FeatureControl<"scss"> = {
  short: "SCSS (SCSS Modules)",
  name: "scss",
  checked: false,
  generateOutput: function generateScssOutput(
    componentFolder,
    componentName: string
  ) {
    return {
      filepath: join(componentFolder, `${componentName}.module.scss`),
      content: ``,
    };
  },
};

export default specs;
