import { prompt } from "inquirer";

const specs: FeatureControl<"documentation"> = {
  short: "Pre built documentation",
  name: "documentation",
  checked: true,
  generateOutput: function generateDocumentationOutput(
    componentName: string,
    description: string,
    featureData: FeatureData
  ) {
    return {
      filename: "README.md",
      content: `# ${componentName}
      
## Description

${description}

${
  featureData.documentation!.businessRules.length &&
  `## Business rules

${featureData.documentation!.businessRules.map((r) => `- ${r}`).join("\n")}`
}
      `,
    };
  },
  inquireData: async function inquireDocumentationData() {
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
    return {
      businessRules,
    };
  },
};

export default specs;
