# aitools

Clean, extensible CLI foundation for AI agent tools.

## Quick start

```bash
npm install
npm run dev -- hello --name "Ada"
npm run dev -- research "latest on agentic search"
```

## Build and run

```bash
npm run build
npm run start -- hello --name "Ada"
```

## Research tool

Create a `.env` file with your OpenAI API key:

```bash
OPENAI_API_KEY=your_key_here
```

Run a web search and save results to `library/`:

```bash
npm run dev -- research "latest on agentic search"
```

## Adding a command

1. Create a file in `src/commands` that exports a `CommandRegistration`.
2. Register it in `src/commands/index.ts`.

Example:

```ts
import { Command } from "commander";
import type { CommandRegistration } from "../core/command.js";

export const registerPingCommand: CommandRegistration = (program: Command) => {
  program
    .command("ping")
    .description("Check liveness")
    .action(() => {
      console.log("pong");
    });
};
```
