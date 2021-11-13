#!/usr/bin/env node

import { Command } from "commander";
import createComponent from "./components";

const program = new Command();

program
  .command("component")
  .description(
    "Creates a component with predefined additional modules (optional)"
  )
  .action(createComponent);

program.parse(process.argv);
