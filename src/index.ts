#!/usr/bin/env node

import { Command } from 'commander';
import createComponent from './component';

const program = new Command();

program
.command("component")
.action(createComponent);

program.parse(process.argv);