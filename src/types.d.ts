type AvailableFeatures = "storybook" | "intl" | "tests" | "scss";

// The object that defines what is a feature
type FeatureControl<E extends AvailableFeatures> = {
  /** The short name of the feature when showing in the inquirer UI */
  short: string;
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
  generateOutput: (
    ...args: any[]
  ) => { filename: string; content: string };
};

type FeatureData = {
  tests?: {
    businessRules: string[]
  }
}
type FeatureMap = {
  [k in AvailableFeatures]: boolean;
}