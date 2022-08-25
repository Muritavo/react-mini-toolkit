import { prompt } from "inquirer";
import { join } from "path";
import { FEATURES } from ".";
import StylesBuilder from "../builder/styles";
import { f } from "../utility/fileGenerator";

export const ENTRY_GENERATION_MODEL = [
    {
        type: "compact",
        description: "Single component implementation file",
    },
    {
        type: "extended",
        description: "Multiple files for implementation (View, Logic, Typings)",
    },
] as const;

/**
 * This implementation controls how the main files from a component are generated
 */
const specs: FeatureControl<"entry"> = {
    name: "entry",
    checked: false,
    inquireData: async function inquireEntryConfig() {
        const { model }: { model: typeof ENTRY_GENERATION_MODEL[number]["description"] } =
            await prompt([
                {
                    message: "Which style model to use",
                    name: "model",
                    type: "list",
                    choices: ENTRY_GENERATION_MODEL.map((a) => a.description),
                },
            ]);

        return {
            model: ENTRY_GENERATION_MODEL.find((a) => a.description === model)!.type,
        };
    },
    generateOutput: function generateReactIntlMessagesFile(componentFolder,
        componentName: string,
        componentDescription: string,
        features: { [key in typeof FEATURES[number]["name"]]: boolean },
        featuresConfig: FeatureData) {

        switch (featuresConfig.entry.model) {
            case "extended":
                return [
                    {
                        filepath: join(componentFolder, "index.tsx"),
                        content: `export { default } from './${componentName}.logic';\n`
                    }, {
                        filepath: join(componentFolder, `${componentName}.logic.tsx`),
                        content: `import React from 'react';
import View from "./${componentName}.view";
import { ${componentName}Props } from "./${componentName}.types";

export default function ${componentName}Logic(props: ${componentName}Props) {
    return <View/>;
}`,
                    }, {
                        filepath: join(componentFolder, `${componentName}.view.tsx`),
                        content: MainViewFile(componentName, componentDescription, features, featuresConfig),
                    }, {
                        filepath: join(componentFolder, `${componentName}.types.ts`),
                        content: `export type ${componentName}Props = {};
export type ${componentName}ViewProps = {};
`,
                    }
                ]
            case "compact":
                return [
                    {
                        filepath: join(componentFolder, "index.tsx"),
                        content: `export { default } from './${componentName}';\n`
                    },
                    {
                        filepath: join(componentFolder, `${componentName}.tsx`),
                        content: MainViewFile(componentName, componentDescription, features, featuresConfig),
                    }]
        }



    },
};

function MainViewFile(componentName: string,
    componentDescription: string,
    features: { [key in typeof FEATURES[number]["name"]]: boolean },
    featuresConfig: FeatureData) {
    const mode = featuresConfig.entry.model;
    const styleComponents = new StylesBuilder()
        .withComponentName(componentName)
        .withType(featuresConfig.styles?.model)
        .withFeatureEnabled(features.styles)
        .build();


    const ViewFunctionName = mode === "compact" ? componentName : `${componentName}View`
    const props = mode === "compact" ? {
        import: undefined,
        props: ""
    } : {
        import: `import { ${componentName}ViewProps } from "./${componentName}.types";`,
        props: `props: ${componentName}ViewProps`
    }

    return f(
        "import React from 'react';",
        props.import,
        styleComponents.import(),
        features.intl ? `import { useIntl } from 'react-intl'
import messages from './messages'` : undefined,
        `
/**
 * ${componentDescription}
 **/
export default function ${ViewFunctionName}(${props.props}) {`,
        styleComponents.componentBody(),
        features.intl ? "    const { formatMessage } = useIntl();" : undefined,
        `    return <>${componentName}</>;
}`
    )
}

export default specs;
