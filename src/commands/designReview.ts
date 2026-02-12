import { Command } from "commander";
import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CommandRegistration } from "../core/command.js";

type DesignReviewOptions = {
  model: string;
  viewport: string;
  fullPage: boolean;
  wait: string;
  prompt: string;
  screenshotsDir: string;
  reviewsDir: string;
};

const DEFAULT_SCREENSHOTS_DIR = "screenshots";
const DEFAULT_REVIEWS_DIR = "reviews";

const toFileSafeTimestamp = (iso: string): string => {
  return iso.replace(/[:.]/g, "-");
};

const ensureDir = async (dirPath: string): Promise<string> => {
  await fs.mkdir(dirPath, { recursive: true });
  return dirPath;
};

const parseViewport = (value: string): { width: number; height: number } => {
  const match = /^(\d{2,5})x(\d{2,5})$/.exec(value.trim());
  if (!match) {
    throw new Error("Viewport must be in WIDTHxHEIGHT format, e.g. 1280x720.");
  }
  return {
    width: Number.parseInt(match[1], 10),
    height: Number.parseInt(match[2], 10),
  };
};

const normalizeUrl = (value: string): string => {
  const url = new URL(value);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("URL must start with http:// or https://");
  }
  return url.toString();
};

const buildReviewMarkdown = (input: {
  url: string;
  createdAt: string;
  model: string;
  screenshotFile: string;
  feedback: string;
}): string => {
  const lines: string[] = [];

  lines.push(`# Design Review: ${input.url}`);
  lines.push("");
  lines.push(`- Date: ${input.createdAt}`);
  lines.push(`- Model: ${input.model}`);
  lines.push(`- Screenshot: ${input.screenshotFile}`);
  lines.push("");
  lines.push("## Feedback");
  lines.push("");
  lines.push(input.feedback.trim() || "(no feedback returned)");
  lines.push("");

  return lines.join("\n");
};

export const registerDesignReviewCommand: CommandRegistration = (program: Command) => {
  program
    .command("design-review <url>")
    .description("Capture a website screenshot and request Gemini design feedback")
    .option("-m, --model <model>", "Gemini model", "gemini-2.5-flash")
    .option("-v, --viewport <size>", "Viewport size WIDTHxHEIGHT", "1280x720")
    .option("--full-page", "Capture full page", true)
    .option("--no-full-page", "Capture viewport only")
    .option("-w, --wait <ms>", "Wait time before screenshot (ms)", "1500")
    .option("--prompt <prompt>", "Custom feedback prompt", "Review the UI design. Focus on hierarchy, typography, color, layout, and accessibility. Provide concise, actionable feedback.")
    .option("--screenshots-dir <dir>", "Directory for screenshots", DEFAULT_SCREENSHOTS_DIR)
    .option("--reviews-dir <dir>", "Directory for feedback", DEFAULT_REVIEWS_DIR)
    .action(async (url: string, options: DesignReviewOptions) => {
      dotenv.config();

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set in the environment or .env file.");
      }

      const targetUrl = normalizeUrl(url);
      const viewport = parseViewport(options.viewport);
      const waitMs = Math.max(0, Number.parseInt(options.wait, 10) || 0);

      const screenshotsPath = await ensureDir(path.join(process.cwd(), options.screenshotsDir));
      const reviewsPath = await ensureDir(path.join(process.cwd(), options.reviewsDir));

      const createdAt = new Date().toISOString();
      const timestamp = toFileSafeTimestamp(createdAt);
      const screenshotFilename = `${timestamp}__screenshot.png`;
      const screenshotFile = path.join(screenshotsPath, screenshotFilename);

      const browser = await chromium.launch();
      const page = await browser.newPage({ viewport });
      await page.goto(targetUrl, { waitUntil: "networkidle" });
      if (waitMs > 0) {
        await page.waitForTimeout(waitMs);
      }
      await page.screenshot({ path: screenshotFile, fullPage: options.fullPage });
      await browser.close();

      const imageBuffer = await fs.readFile(screenshotFile);
      const imageBase64 = imageBuffer.toString("base64");

      const client = new GoogleGenerativeAI(apiKey);
      const model = client.getGenerativeModel({ model: options.model });
      const result = await model.generateContent([
        { text: options.prompt },
        { inlineData: { data: imageBase64, mimeType: "image/png" } },
      ]);

      const feedback = result.response.text();
      const reviewFilename = `${timestamp}__design-review.md`;
      const reviewFile = path.join(reviewsPath, reviewFilename);
      const reviewMarkdown = buildReviewMarkdown({
        url: targetUrl,
        createdAt,
        model: options.model,
        screenshotFile,
        feedback,
      });

      await fs.writeFile(reviewFile, reviewMarkdown, "utf-8");

      console.log(`Saved screenshot: ${screenshotFile}`);
      console.log(`Saved feedback: ${reviewFile}`);
      console.log("");
      console.log(feedback.trim());
    });
};
