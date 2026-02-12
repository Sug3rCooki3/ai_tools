# aitools

Clean, extensible CLI foundation for AI agent tools.

## Quick start

```bash
npm install
npm run dev -- hello --name "Ada"
npm run dev -- research "latest on agentic search"
npm run dev -- images -n 2
npm run dev -- design-review https://example.com
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

## Image tool

The image tool uses OpenAI to generate cat images and saves them to `images/`.

```bash
npm run dev -- images -n 2
```

Options:

```bash
npm run dev -- images -n 4 --size 1024x1024 --prompt "cats wearing helmets"
```

## Design review tool

The design review tool captures a website screenshot with Playwright and sends it to Gemini.

Add your Gemini API key:

```bash
GEMINI_API_KEY=your_key_here
```

Install Playwright browsers and system dependencies:

```bash
npx playwright install
sudo env "PATH=$PATH" npx playwright install-deps
```

Run a review and save the screenshot to `screenshots/` and feedback to `reviews/`:

```bash
npm run dev -- design-review https://example.com
```

Options:

```bash
npm run dev -- design-review https://example.com \
  --viewport 1440x900 \
  --full-page \
  --prompt "Audit layout, typography, contrast, and motion."
```

## All commands

```bash
npm run dev -- hello --name "Ada"
npm run dev -- research "latest on agentic search"
npm run dev -- images -n 2
npm run dev -- design-review https://example.com
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
