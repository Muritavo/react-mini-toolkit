const specification: FeatureControl<"tests"> = {
  short: "Tests (@testing-library/react)",
  name: "tests",
  checked: true,
  generateOutput: function generateTestsFile(
    componentName: string,
    features: { [k in AvailableFeatures]: boolean },
    featureData: FeatureData
  ) {
    const businessRules = featureData.documentation?.businessRules;
    const whereToImportTheComponentFrom = features.storybook
      ? `import { InitialImplementation as Component } from './${componentName}.stories';`
      : `import Component from './${componentName}';`;
    const componentRender = features.intl
      ? `<IntlProvider locale="pt-br">
            <Component/>
        </IntlProvider>`
      : `<Component/>`;
    const content = `import React from 'react';
import { render } from '@testing-library/react';
${features.intl ? "import { IntlProvider } from 'react-intl';" : ""}
${whereToImportTheComponentFrom}

function renderScreen(props: React.ComponentProps<typeof Component>) {
  return render(${componentRender});
}

it('Should at least render :)', () => {
    renderScreen({});
})

${
  !!businessRules?.length
    ? businessRules.map((r) => `it.todo("${r}");`).join("\n")
    : ""
}`;
    return {
      content,
      filename: `${componentName}.test.tsx`,
    };
  },
};

export default specification;
