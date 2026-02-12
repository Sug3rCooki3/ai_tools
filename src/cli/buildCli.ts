import { Command } from "commander";
import pkg from "../../package.json" with { type: "json" };
import { registerCommands } from "./registerCommands.js";

export const buildCli = (): Command => {
  const program = new Command();

  program
    .name("aitools")
    .description("AI agent toolbelt CLI")
    .version(pkg.version);

  registerCommands(program);

  return program;
};
