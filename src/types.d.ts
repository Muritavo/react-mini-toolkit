type AvailableFeatures = "storybook" | "intl" | "tests" | "styles" | "entry";

type FileSpec = { filepath: string; content: string }

// The object that defines what is a feature
type FeatureControl<E extends AvailableFeatures> = {
  /** The full name with more details about the feature */
  name: E;
  /** Defines if it should be preselected */
  checked: boolean;
  /**
   * Maybe the feature doesn't require more data
   * T = The inquirer can or not receive params
   * @returns M = The inquirer always returns its own data model
   * */
  inquireData?: (...args: any[]) => Promise<FeatureData[AvailableFeatures]>;
  /**
   * T = When generating output, it can require more data (e.g. The tests output is bound to the documentation data)
   * @returns The definition of the file and content
   */
  generateOutput: (componentFolder: string, ...args: any[]) => FileSpec | FileSpec[];
};

type FeatureData = {
  tests?: {
    model: typeof import("./components/tests")["GENERATION_MODEL"][number]["type"];
    businessRules: string[];
  };
  styles?: {
    model: typeof import("./components/styles")['STYLES_GENERATION_MODEL'][number]['type']
  }
  entry: {
    model: typeof import("./components/entry")['ENTRY_GENERATION_MODEL'][number]['type']
  }
};
type FeatureMap = {
  [k in AvailableFeatures]: boolean;
};
