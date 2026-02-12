import { Command } from "commander";

export type CommandRegistration = (program: Command) => void;
