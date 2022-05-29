import { join } from "path";

export function replaceUpperCaseBySpace(componentName: string) {
  return componentName.replace(/(?=[A-Z])/g, " ").trim();
}

const specs: FeatureControl<"storybook"> = {
  short: "Storybook",
  name: "storybook",
  checked: false,
  generateOutput: function generateStorybookFile(
    componentFolder,
    componentName: string
  ) {
    const content = `import React from 'react';
import ${componentName} from "./${componentName}";
    
export default {
    component: ${componentName},
    title: "${replaceUpperCaseBySpace(componentName)}"
}

export const InitialImplementation = (args: any) => <${componentName} {...args}/>;
InitialImplementation.args = {} as Partial<React.ComponentProps<typeof ${componentName}>>`;
    return {
      filepath: join(componentFolder, `${componentName}.stories.tsx`),
      content,
    };
  },
};

export default specs;
