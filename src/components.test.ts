import { getDiagnosticsForText } from "./testUtils/utils";
import { FEATURES, generateOutput, replaceUpperCaseBySpace } from "./component";

const FEATURES_TO_TEST = FEATURES.map(f => f.name);

const boolCombo = (size: number) => {
    const buf = Array(1 << size)
    for (let i = buf.length; i--;) {
        buf[i] = Array(size)
        for (let j = size; j--;)
            buf[i][j] = !!+!!(i & 1 << j)
    }
    return buf
}

const allCombinations = boolCombo(FEATURES_TO_TEST.length);
const allFeatureCombinations = allCombinations.map((combination) => (FEATURES_TO_TEST.reduce((r, key, i) => ({ ...r, [key]: combination[i] }), {})));

it.each(allFeatureCombinations)("Features for the component generation when features are enabled as %s", (enabledFeatures) => {
    const outputFiles = generateOutput("MockComponent", "A component to check that everything is fine", enabledFeatures as any);
    expect(outputFiles).toMatchSnapshot();

    const outputResult = getDiagnosticsForText(outputFiles);
    const errors = outputResult.filter(o => !JSON.stringify(o.messageText).includes(`MockComponent.module.scss'`));
    expect(errors).toHaveLength(0);
})

it("Should replace with space", () => {
    expect(replaceUpperCaseBySpace("SomeComponent")).toEqual("Some Component");
})