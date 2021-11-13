const specs: FeatureControl<"scss"> = {
  short: "SCSS (SCSS Modules)",
  name: "scss",
  checked: false,
  generateOutput: function generateScssOutput(componentName: string) {
    return {
      filename: `${componentName}.module.scss`,
      content: ``,
    };
  },
};

export default specs;