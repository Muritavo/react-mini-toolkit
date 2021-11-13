const specs: FeatureControl = {
  short: "Intl messages",
  name: "intl",
  checked: false,
  generateOutput: function generateReactIntlMessagesFile() {
    const content = `import { defineMessages } from 'react-intl';

export default defineMessages({})`;
    return {
      filename: "messages.ts",
      content,
    };
  },
};

export default specs;