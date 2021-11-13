const specs: FeatureControl = {
  short: "Pre built documentation",
  name: "documentation",
  checked: true,
  generateOutput: function generateDocumentationOutput() {
    return {
      filename: "README.md",
      content: ``,
    };
  },
  inquireData: async function inquireDocumentationData() {
    const data: DocumentationData = {};
    return data;
  },
};

export type DocumentationData = {};
export default specs;