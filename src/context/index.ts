import inquirer from "inquirer";
import { resolve } from "path";
import { writeOutputToDisk } from "../components";
const l = require("debug")("react-mini-toolkit/context");

export function createContextFile(rootFolder: string, name: string) {
  return {
    filepath: `${rootFolder}/${name}.tsx`,
    code: `import { createContext, useContext, PropsWithChildren } from "react";

export type ${name}ContextShape = {};
export const ${name}Context = createContext<${name}ContextShape>(null as any);

export default function ${name}Provider({ children }: PropsWithChildren<{}>) {
  return <${name}Context.Provider value={{}}>
      {children}
  </${name}Context.Provider>
}

export function use${name}() {
  return useContext(${name}Context);
}`,
  };
}

export default function createContext() {
  const rootFolder = process.env.INIT_CWD || resolve("./");
  l("Running at", rootFolder);
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of this context?",
        validate: (str) =>
          /^[a-zA-Z]+$/.test(str)
            ? true
            : "The component name must have only letters",
      },
    ])
    .then(async ({ name }) => {
      l("Creating the context", name);
      const ctx = createContextFile(rootFolder, name);
      writeOutputToDisk(ctx.filepath, ctx.code);
    });
}
