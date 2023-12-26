#!/usr/bin/env node

import { readdirSync, mkdirSync, cpSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { intro, outro, cancel, text, select } from "@clack/prompts";

intro("Creating your new overlay source...");

const currentDirectory = process.cwd();
const directory = await text({
  message: "Where should we create the source?",
  placeholder: "./dots-source",
  validate(value) {
    if (value.length === 0) return `Value is required!`;
  },
});

const sourceTemplate = await select({
  message: "Which template would you like to use?",
  options: [
    { value: "source-ts", label: "TypeScript" },
    { value: "source-js", label: "JavaScript" },
  ],
});

const destDirectory = resolve(
  directory.startsWith("/") ? "" : currentDirectory,
  directory
);

try {
  mkdirSync(destDirectory, {
    recursive: true,
  });
} catch {
  cancel("Unable to make directory!");
  process.exit(1);
}

const files = readdirSync(destDirectory);

if (files.length > 0) {
  cancel("Directory is not empty!");
  process.exit(1);
}

try {
  const sourceDirectory = dirname(
    process.platform === "win32"
      ? import.meta.url.slice(8)
      : import.meta.url.slice(7)
  );
  const templatePath = join(sourceDirectory, "templates", sourceTemplate);
  cpSync(decodeURI(templatePath), decodeURI(destDirectory), {
    recursive: true,
  });
} catch (e) {
  console.debug(e);
  cancel("Unable to copy files!");
  process.exit(1);
}

outro("All done!");
