#!/usr/bin/env node

import { Command } from "commander";
import createComponent from "./components";
import createContext from "./context";

const program = new Command();

program
  .command("component")
  .description(
    "Creates a component with predefined additional modules (optional)"
  )
  .action(createComponent);

program
  .command("context")
  .description("Creates a context with a custom boilerplate")
  .action(createContext);

program.parse(process.argv);
