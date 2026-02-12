#!/usr/bin/env node

import { buildCli } from "./cli/buildCli.js";

const cli = buildCli();
cli.parse(process.argv);
