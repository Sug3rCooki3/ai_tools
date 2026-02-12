import type { CommandRegistration } from "../core/command.js";
import { registerHelloCommand } from "./hello.js";
import { registerImageCommand } from "./images.js";
import { registerResearchCommand } from "./research.js";

export const commands: CommandRegistration[] = [registerHelloCommand, registerImageCommand, registerResearchCommand];
