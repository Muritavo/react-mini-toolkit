import { getDiagnosticsForText } from "../testUtils/utils";
import { FEATURES, generateOutput } from ".";
import { GENERATION_MODEL } from "./tests";
import { join } from "path";
import { STYLES_GENERATION_MODEL } from "./styles";

const mkdirSyncSpy = jest
  .spyOn(require("fs"), "mkdirSync")
  .mockImplementation(() => { });
const FEATURES_TO_TEST = FEATURES.map((f) => f.name);

const boolCombo = (size: number) => {
  const buf = Array(1 << size);
  for (let i = buf.length; i--;) {
    buf[i] = Array(size);
    for (let j = size; j--;) buf[i][j] = !!+!!(i & (1 << j));
  }
  return buf;
};

const allCombinations = boolCombo(FEATURES_TO_TEST.length);
const allFeatureCombinations = allCombinations.map((combination) =>
  FEATURES_TO_TEST.reduce((r, key, i) => ({ ...r, [key]: combination[i] }), {})
) as FeatureMap[];
const allDataCombinations = boolCombo([STYLES_GENERATION_MODEL, GENERATION_MODEL].length);
const allFeatureDataCombinations = allDataCombinations.map((combination) =>
  ["styles", "tests"].reduce((r, key, i) => ({
    ...r, [key]: (() => {
      const i2 = combination[i] ? 1 : 0;
      switch (key) {
        case "styles":
          return {
            model: STYLES_GENERATION_MODEL[i2].type
          }
        case "tests":
          return {
            model: GENERATION_MODEL[i2].type
          }
      }
    })()
  }), {})
) as FeatureData[];

function buildMockedFeatureData(featureMap: FeatureMap) {
  const map: FeatureData = {};
  map.tests = {
    businessRules: ["SOME MOCKED BUSINESS RULE", "ANOTHER ONE"],
    model: "@cypress/react",
  };
  map.styles = {
    model: "scss"
  }
  return map;
}

function testOutputWithFeatureData(
  enabledFeaturesMap: any,
  featureDataMap: FeatureData
) {
  const outputFiles = generateOutput(
    "MockComponent",
    "A component to check that everything is fine",
    enabledFeaturesMap,
    featureDataMap,
    join("/root/path/to/project/src/folder/", "MockComponent")
  );
  expect(outputFiles).toMatchSnapshot();

  const outputResult = getDiagnosticsForText(outputFiles).map(
    (o) => o.messageText
  );

  const errors = outputResult.filter((o) => {
    const a = JSON.stringify(o);
    return (
      !a.includes(`MockComponent.module.scss'`) &&
      !a.includes("README.md") &&
      !a.includes("'cypress'") &&
      !a.includes("'Cypress'") &&
      !a.includes("'JQuery'")
    );
  });
  expect(errors).toHaveLength(0);
}

it.each(allFeatureCombinations)(
  "Features for the component generation when features are enabled as %s",
  (enabledFeatures) => {
    const featureData = buildMockedFeatureData(enabledFeatures);
    if (enabledFeatures.tests || enabledFeatures.styles)
      for (let combination of allFeatureDataCombinations) {
        featureData.styles!.model = combination.styles!.model;
        featureData.tests!.model = combination.tests!.model;
        testOutputWithFeatureData(enabledFeatures, featureData);
      }
    else testOutputWithFeatureData(enabledFeatures, featureData);
  }
);
