import inquirer from 'inquirer';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const l = require('debug')('react-mini-toolkit');

export const FEATURES = [{
    short: "Tests (@testing-library/react)",
    name: "tests",
    checked: true
}, {
    short: "SCSS (SCSS Modules)",
    name: "scss",
    checked: false
}, {
    short: "Storybook",
    name: "storybook",
    checked: false
}, {
    short: "Intl messages",
    name: "intl",
    checked: false
}] as const

export default function createComponent() {
    const rootFolder = process.env.INIT_CWD || './';
    l("Running at", rootFolder);
    inquirer.prompt([{
        type: "input",
        name: "name",
        message: "What is the name of the component?",
        validate: (str) => /[a-zA-Z]+/.test(str) ? true : "The component name must have only letters"
    }, {
        type: "input",
        name: "description",
        message: "Describe in a few words what is the objective of this component:"
    }, {
        type: "checkbox",
        name: "features",
        message: "Feature to be prebuilt",
        choices: FEATURES
    }]).then(({ name: componentName, description: componentDescription, features: generationFeatures }) => {
        l(generationFeatures)
        l("Creating the component", componentName);
        const componentFolder = join(rootFolder, componentName);
        mkdirSync(componentFolder, { recursive: true });
        writeFileSync(join(componentFolder, `index.tsx`), `export { default } from './${componentName}';\n`);
        writeFileSync(join(componentFolder, `${componentName}.tsx`), `import React from 'react';
${generationFeatures.includes('scss') ? `import Styles from './${componentName}.module.scss';\n` : ''}
/**
 * ${componentDescription}
 **/
export default function ${componentName}() {
    return <>${componentName}</>;
}`);
        if (generationFeatures.includes('tests'))
            writeFileSync(join(componentFolder, `${componentName}.test.tsx`), `import React from 'react';
import { render } from '@testing-library/react';
import Component from './${componentName}';

it('Should at least render :)', () => {
    render(<Component/>);
})`);
        if (generationFeatures.includes('scss'))
            writeFileSync(join(componentFolder, `${componentName}.module.scss`), ``);
    })
}

type Features = { [key in typeof FEATURES[number]['name']]: boolean };

export function generateOutput(componentName: string, componentDescription: string, features: Features) {
    const files: { [filename: string]: string } = {};

    files['index.tsx'] = `export { default } from './${componentName}';\n`;
    files[`${componentName}.tsx`] = generateMainFile(componentName, componentDescription, features);
    if (features.tests)
        files[`${componentName}.test.tsx`] = generateTestsFile(componentName, features);
    if (features.scss)
        files[`${componentName}.module.scss`] = ``;
    if (features.storybook)
        files[`${componentName}.stories.tsx`] = generateStorybookFile(componentName);
    if (features.intl)
        files[`messages.ts`] = generateReactIntlMessagesFile();

    return files;
}

export function generateReactIntlMessagesFile() {
    return `import { defineMessages } from 'react-intl';
    
export default defineMessages({})`;
}

export function replaceUpperCaseBySpace(componentName: string) {
    return componentName.replace(/(?=[A-Z])/g, " ").trim();
}

function generateStorybookFile(componentName: string) {
    return `import React from 'react';
import ${componentName} from "./${componentName}";
    
export default {
    component: ${componentName},
    title: "${replaceUpperCaseBySpace(componentName)}"
}

export const InitialImplementation = (...args: any) => <${componentName} {...args}/>;`;
}

function generateTestsFile(componentName: string, features: Features) {
    const whereToImportTheComponentFrom = features.storybook ? `import { InitialImplementation as Component } from './${componentName}.stories';` : `import Component from './${componentName}';`;
    const componentRender = features.intl ? `<IntlProvider locale="pt-br">
        <Component/>
    </IntlProvider>` : `<Component/>`
    return `import React from 'react';
import { render } from '@testing-library/react';
${features.intl ? "import { IntlProvider } from 'react-intl';" : ""}
${whereToImportTheComponentFrom}

it('Should at least render :)', () => {
    render(${componentRender});
})`;
}

function generateMainFile(componentName: string, componentDescription: string, features: { [key in typeof FEATURES[number]['name']]: boolean }) {
    return `import React from 'react';
${features.scss ? `import Styles from './${componentName}.module.scss';` : ''}
${features.intl ? `import { useIntl } from 'react-intl'
import messages from './messages'` : ''}

/**
 * ${componentDescription}
 **/
export default function ${componentName}() {
    ${features.intl ? "const { formatMessage } = useIntl();" : ""}
    return <>${componentName}</>;
}`;
}