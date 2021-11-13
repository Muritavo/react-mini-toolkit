const specification: FeatureControl = {
  short: "Tests (@testing-library/react)",
  name: "tests",
  checked: true,
  generateOutput: function generateTestsFile(
    componentName: string,
    features: { [k in FeatureControl["name"]]: boolean }
  ) {
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

it('Should at least render :)', () => {
    render(${componentRender});
})`;
    return {
      content,
      filename: `${componentName}.test.tsx`,
    };
  },
};

export default specification;
