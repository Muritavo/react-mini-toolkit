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
    generateOutput: function generateReactIntlMessagesFile(componentFolder,
        componentName: string,
        componentDescription: string,
        features: { [key in typeof FEATURES[number]["name"]]: boolean },
        featuresConfig: FeatureData) {
        const styleComponents = new StylesBuilder()
            .withComponentName(componentName)
            .withType(featuresConfig.styles?.model)
            .withFeatureEnabled(features.styles)
            .build();

        return [
            {
                filepath: join(componentFolder, "index.tsx"),
                content: `export { default } from './${componentName}';\n`
            },
            {
                filepath: join(componentFolder, `${componentName}.tsx`),
                content: f(
                    "import React from 'react';",
                    styleComponents.import(),
                    features.intl ? `import { useIntl } from 'react-intl'
import messages from './messages'` : undefined,
                    `
/**
 * ${componentDescription}
 **/
export default function ${componentName}() {`,
                    styleComponents.componentBody(),
                    features.intl ? "    const { formatMessage } = useIntl();" : undefined,
                    `    return <>${componentName}</>;
}`
                ),
            }]

    },
};

export default specs;
