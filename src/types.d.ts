type AvailableFeatures = "storybook" | "intl" | "tests" | "scss" | "documentation";

// The object that defines what is a feature
type FeatureControl = {
  /** The short name of the feature when showing in the inquirer UI */
  short: string;
  /** The full name with more details about the feature */
  name: AvailableFeatures;
  /** Defines if it should be preselected */
  checked: boolean;
  /**
   * Maybe the feature doesn't require more data
   * T = The inquierer can or not receive params
   * @returns M = The inquierer always returns its own data model
   * */
  inquireData?: (...args: any[]) => Promise<any>;
  /**
   * T = When generating output, it can require more data (e.g. The tests output is bound to the documentation data)
   * @returns The definition of the file and content
   */
  generateOutput: (
    ...args: any[]
  ) => { filename: string; content: string };
};
