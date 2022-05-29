import { join } from "path";

const specs: FeatureControl<"intl"> = {
  short: "Intl messages",
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
