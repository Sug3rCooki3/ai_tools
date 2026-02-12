import type { CommandRegistration } from "../core/command.js";
import { registerHelloCommand } from "./hello.js";
import { registerDesignReviewCommand } from "./designReview.js";
import { registerImageCommand } from "./images.js";
import { registerResearchCommand } from "./research.js";

export const commands: CommandRegistration[] = [
	registerHelloCommand,
	registerDesignReviewCommand,
	registerImageCommand,
	registerResearchCommand,
];
