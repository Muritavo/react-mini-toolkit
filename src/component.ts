import inquirer from 'inquirer';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const l = require('debug')('react-mini-toolkit');

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
        choices: [{
            short: "Tests (@testing-library/react)",
            name: "tests",
            checked: false
        }, {
            short: "SCSS (SCSS Modules)",
            name: "scss",
            checked: false
        }]
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