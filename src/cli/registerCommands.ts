import { Command } from "commander";
import { commands } from "../commands/index.js";

export const registerCommands = (program: Command): void => {
  commands.forEach((register) => register(program));
};
