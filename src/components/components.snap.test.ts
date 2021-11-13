import { getDiagnosticsForText } from "../testUtils/utils";
import { FEATURES, generateOutput } from ".";

const FEATURES_TO_TEST = FEATURES.map((f) => f.name);

const boolCombo = (size: number) => {
  const buf = Array(1 << size);
  for (let i = buf.length; i--; ) {
    buf[i] = Array(size);
    for (let j = size; j--; ) buf[i][j] = !!+!!(i & (1 << j));
  }
  return buf;
};

const allCombinations = boolCombo(FEATURES_TO_TEST.length);
const allFeatureCombinations = allCombinations.map((combination) =>
  FEATURES_TO_TEST.reduce((r, key, i) => ({ ...r, [key]: combination[i] }), {})
) as FeatureMap[];

function buildMockedFeatureData(featureMap: FeatureMap) {
  const map: FeatureData = {};
  if (featureMap.documentation)
    map.documentation = {
      businessRules: ["SOME MOCKED BUSINESS RULE", "ANOTHER ONE"],
    };
  return map;
}

it.each(allFeatureCombinations)(
  "Features for the component generation when features are enabled as %s",
  (enabledFeatures) => {
    const outputFiles = generateOutput(
      "MockComponent",
      "A component to check that everything is fine",
      enabledFeatures as any,
      buildMockedFeatureData(enabledFeatures)
    );
    expect(outputFiles).toMatchSnapshot();

    const outputResult = getDiagnosticsForText(outputFiles).map(
      (o) => o.messageText
    );
    const errors = outputResult.filter((o) => {
      const a = JSON.stringify(o);
      !a.includes(`MockComponent.module.scss'`) && !a.includes("README.md");
    });
    expect(errors).toHaveLength(0);
  }
);
