import { join } from "path";

const specs: FeatureControl<"intl"> = {
  name: "intl",
  checked: false,
  generateOutput: function generateReactIntlMessagesFile(componentFolder) {
    const content = `import { defineMessages } from 'react-intl';

export default defineMessages({})`;
    return {
      filepath: join(componentFolder, "messages.ts"),
      content,
    };
  },
};

export default specs;
