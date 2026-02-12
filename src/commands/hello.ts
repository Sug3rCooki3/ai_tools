import { Command } from "commander";
import type { CommandRegistration } from "../core/command.js";

export const registerHelloCommand: CommandRegistration = (program: Command) => {
  program
    .command("hello")
    .description("Print a friendly greeting")
    .option("-n, --name <name>", "Name to greet", "friend")
    .action((options: { name: string }) => {
      console.log(`Hello, ${options.name}.`);
    });
};
