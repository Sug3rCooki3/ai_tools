import { Command } from "commander";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "node:fs/promises";
import path from "node:path";
import type { CommandRegistration } from "../core/command.js";

type ImageOptions = {
  model: string;
  size: string;
  count: string;
  prompt: string;
};

const IMAGES_DIR = "images";

const toFileSafeTimestamp = (iso: string): string => {
  return iso.replace(/[:.]/g, "-");
};

const ensureImagesDir = async (): Promise<string> => {
  const imagesPath = path.join(process.cwd(), IMAGES_DIR);
  await fs.mkdir(imagesPath, { recursive: true });
  return imagesPath;
};

export const registerImageCommand: CommandRegistration = (program: Command) => {
  program
    .command("images")
    .description("Generate cat images and save them to images/")
    .option("-m, --model <model>", "Image model", "gpt-image-1")
    .option("-s, --size <size>", "Image size", "1024x1024")
    .option("-n, --count <count>", "Number of images", "1")
    .option("--prompt <prompt>", "Prompt override", "cats")
    .action(async (options: ImageOptions) => {
      dotenv.config();

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OPENAI_API_KEY is not set in the environment or .env file.");
      }

      const count = Math.max(1, Math.min(10, Number.parseInt(options.count, 10) || 1));
      const promptBase = options.prompt?.trim() || "cats";
      const prompt = /cat/i.test(promptBase) ? promptBase : `cats, ${promptBase}`;
      const client = new OpenAI({ apiKey });

      const response = await client.images.generate({
        model: options.model,
        prompt,
        size: options.size as unknown as "1024x1024",
        n: count,
      });

      const imagesPath = await ensureImagesDir();
      const createdAt = new Date().toISOString();
      const timestamp = toFileSafeTimestamp(createdAt);

      const data = response.data ?? [];
      if (data.length === 0) {
        console.log("No images returned.");
        return;
      }

      const savedFiles: string[] = [];
      for (const [index, item] of data.entries()) {
        const filename = `${timestamp}__cat_${index + 1}.png`;
        const filePath = path.join(imagesPath, filename);

        if (item.b64_json) {
          const buffer = Buffer.from(item.b64_json, "base64");
          await fs.writeFile(filePath, buffer);
          savedFiles.push(filePath);
          continue;
        }

        if (item.url) {
          const imageResponse = await fetch(item.url);
          if (!imageResponse.ok) {
            continue;
          }
          const arrayBuffer = await imageResponse.arrayBuffer();
          await fs.writeFile(filePath, Buffer.from(arrayBuffer));
          savedFiles.push(filePath);
        }
      }

      if (savedFiles.length === 0) {
        console.log("No image data to save.");
        return;
      }

      savedFiles.forEach((filePath) => {
        console.log(`Saved: ${filePath}`);
      });
    });
};
