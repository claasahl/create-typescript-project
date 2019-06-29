#!/usr/bin/env node
import execa from "execa";
import path from "path";
import fs from "fs";
import fetch from "node-fetch";
import * as git from "isomorphic-git";
import chalk from "chalk";
import jsonfile from "jsonfile";
import { EOL } from "os";

git.plugins.set("fs", fs);

// the dir where we're doin stuff.
const dir = process.cwd();

const husky = {
  hooks: {
    "pre-commit": "pretty-quick --staged"
  }
};
const scripts = {
  prepare: "tsc",
  build: "tsc",
  start: "ts-node src/index.ts"
};

async function initializeGitRepository(): Promise<void> {
  try {
    await git.currentBranch({ dir });
    // ... probably already a git repository
  } catch {
    // ... probably not a git repository
    await git.init({ dir });
  }
}

async function bootstrapPackageJson(): Promise<void> {
  process.stdout.write(`Bootstrapping ${chalk.magenta("package.json")} ... `);
  await execa("npm", ["init", "--yes"]);
  const packageFile = path.resolve(dir, "package.json");
  const packageJson = await jsonfile.readFile(packageFile);
  packageJson.scripts = { ...packageJson.scripts, ...scripts };
  await jsonfile.writeFile(packageFile, { ...packageJson, husky });
  process.stdout.write("Done" + EOL);
}
async function installTypescript(): Promise<void> {
  process.stdout.write(`Installing ${chalk.magenta("typescript")} ... `);
  await execa("npm", [
    "install",
    "typescript",
    "@types/node",
    "ts-node",
    "--save-dev"
  ]);
  await execa("tsc", ["--init", "--outDir", "build"]);
  process.stdout.write("Done" + EOL);
}

async function automatedCodeFormatting(): Promise<void> {
  process.stdout.write(
    `Installing ${chalk.magenta("prettier / pretty-quick")} ... `
  );
  await execa("npm", [
    "install",
    "prettier",
    "pretty-quick",
    "husky",
    "--save-dev"
  ]);
  process.stdout.write("Done" + EOL);
}

async function bootstrapGitignore(): Promise<void> {
  process.stdout.write(`Bootstrapping ${chalk.magenta(".gitignore")} ... `);
  const dest = fs.createWriteStream(".gitignore");
  const res = await fetch("https://gitignore.io/api/node,macos");
  dest.write("build/\r\n\r\n");
  res.body.pipe(dest);
  process.stdout.write("Done" + EOL);
}

async function bootstrapSampleCode(): Promise<void> {
  process.stdout.write(
    `Bootstrapping ${chalk.magenta("'hello world'-sample")} ... `
  );
  fs.mkdirSync(dir + "/src");
  fs.writeFileSync(
    dir + "/src/index.ts",
    "// happy coding 👻" + EOL + 'console.log("hello world");'
  );
  process.stdout.write("Done" + EOL);
}

async function stageFiles(): Promise<void> {
  process.stdout.write(`Staging ${chalk.magenta("files")} ... `);
  await git.add({ dir, filepath: ".gitignore" });
  await git.add({ dir, filepath: "package.json" });
  await git.add({ dir, filepath: "package-lock.json" });
  await git.add({ dir, filepath: "tsconfig.json" });
  await git.add({ dir, filepath: "src/index.ts" });
  process.stdout.write("Done" + EOL);
}

async function happyHacking(): Promise<void> {
  process.stdout.write(EOL + "Happy hacking! 👽 👻 😃" + EOL);
}

(async () => {
  await initializeGitRepository();
  await bootstrapPackageJson();
  await installTypescript();
  await automatedCodeFormatting();
  await bootstrapGitignore();
  await bootstrapSampleCode();
  await stageFiles();
  await happyHacking();
})();
