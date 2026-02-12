import { Command } from "commander";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "node:fs/promises";
import path from "node:path";
import type { CommandRegistration } from "../core/command.js";

type ResearchOptions = {
  model: string;
  offline: boolean;
  allowDomain: string[];
};

type ResponseCreateParams = Parameters<OpenAI["responses"]["create"]>[0];

type WebSource = {
  url: string;
  title?: string;
};

type WebSearchCallItem = {
  type: "web_search_call";
  action?: {
    sources?: WebSource[];
  };
};

const LIBRARY_DIR = "library";

const collect = (value: string, previous: string[]): string[] => {
  return previous.concat(value);
};

const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || "research";
};

const toFileSafeTimestamp = (iso: string): string => {
  return iso.replace(/[:.]/g, "-");
};

const uniqueSources = (sources: WebSource[]): WebSource[] => {
  const seen = new Set<string>();
  const results: WebSource[] = [];
  sources.forEach((source) => {
    if (!seen.has(source.url)) {
      seen.add(source.url);
      results.push(source);
    }
  });
  return results;
};

const getSourcesFromOutput = (output: unknown): WebSource[] => {
  if (!Array.isArray(output)) {
    return [];
  }

  const sources: WebSource[] = [];
  output.forEach((item) => {
    const typed = item as WebSearchCallItem;
    if (typed.type === "web_search_call" && typed.action?.sources) {
      sources.push(...typed.action.sources);
    }
  });

  return uniqueSources(sources);
};

const buildMarkdown = (query: string, createdAt: string, model: string, text: string, sources: WebSource[]): string => {
  const lines: string[] = [];

  lines.push(`# Research: ${query}`);
  lines.push("");
  lines.push(`- Date: ${createdAt}`);
  lines.push(`- Model: ${model}`);
  lines.push("- Tool: web_search");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(text.trim() || "(no response text)");
  lines.push("");
  lines.push("## Sources");
  lines.push("");

  if (sources.length === 0) {
    lines.push("- (none)");
  } else {
    sources.forEach((source) => {
      const title = source.title?.trim() || source.url;
      lines.push(`- [${title}](${source.url})`);
    });
  }

  lines.push("");
  return lines.join("\n");
};

const ensureLibraryDir = async (): Promise<string> => {
  const libraryPath = path.join(process.cwd(), LIBRARY_DIR);
  await fs.mkdir(libraryPath, { recursive: true });
  return libraryPath;
};

const readIndex = async (libraryPath: string): Promise<unknown[]> => {
  const indexPath = path.join(libraryPath, "index.json");
  try {
    const raw = await fs.readFile(indexPath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const writeIndex = async (libraryPath: string, entries: unknown[]): Promise<void> => {
  const indexPath = path.join(libraryPath, "index.json");
  await fs.writeFile(indexPath, `${JSON.stringify(entries, null, 2)}\n`, "utf-8");
};

export const registerResearchCommand: CommandRegistration = (program: Command) => {
  program
    .command("research <query>")
    .description("Run an OpenAI web search and save the result to library/")
    .option("-m, --model <model>", "Model for the response", "gpt-5")
    .option("--offline", "Disable live web access (cache-only)", false)
    .option("--allow-domain <domain>", "Allow-list domain (repeatable)", collect, [])
    .action(async (query: string, options: ResearchOptions) => {
      dotenv.config();

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OPENAI_API_KEY is not set in the environment or .env file.");
      }

      const client = new OpenAI({ apiKey });

      const tool = { type: "web_search" } as Record<string, unknown>;
      if (options.allowDomain.length > 0) {
        tool.filters = { allowed_domains: options.allowDomain };
      }
      if (options.offline) {
        tool.external_web_access = false;
      }

      const request = {
        model: options.model,
        tools: [tool],
        tool_choice: "auto",
        include: ["web_search_call.action.sources"],
        input: query,
      } as unknown as ResponseCreateParams;

      const response = (await client.responses.create(request as any)) as {
        output?: unknown;
        output_text?: string;
        model?: string;
      };

      const createdAt = new Date().toISOString();
      const libraryPath = await ensureLibraryDir();
      const slug = slugify(query);
      const filename = `${toFileSafeTimestamp(createdAt)}__${slug}.md`;
      const filePath = path.join(libraryPath, filename);
      const sources = getSourcesFromOutput(response.output);
      const markdown = buildMarkdown(
        query,
        createdAt,
        response.model ?? options.model,
        response.output_text ?? "",
        sources
      );

      await fs.writeFile(filePath, markdown, "utf-8");

      const indexEntries = await readIndex(libraryPath);
      indexEntries.push({
        id: filename.replace(/\.md$/, ""),
        query,
        file: path.join(LIBRARY_DIR, filename),
        createdAt,
        model: response.model ?? options.model,
        sources,
      });
      await writeIndex(libraryPath, indexEntries);

      console.log(`Saved: ${filePath}`);
    });
};
