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

async function initializeGitRepository(dir: string): Promise<void> {
  try {
    await git.currentBranch({ dir });
    // ... probably already a git repository
  } catch {
    // ... probably not a git repository
    await git.init({ dir });
  }
}

async function bootstrapPackageJson(dir: string): Promise<void> {
  const baseJson = {
    scripts: { prepare: "tsc", build: "tsc", start: "ts-node src/index.ts" },
    husky: {
      hooks: {
        "pre-commit": "pretty-quick --staged"
      }
    }
  };

  process.stdout.write(
    `Bootstrapping ${chalk.magentaBright("package.json")} ... `
  );
  await execa("npm", ["init", "--yes"]);
  const packageFile = path.resolve(dir, "package.json");
  const packageJson = await jsonfile.readFile(packageFile);
  Object.assign(packageJson, baseJson);
  await jsonfile.writeFile(packageFile, packageJson);
  process.stdout.write("Done" + EOL);
}

async function installTypescript(nodeVersion?: string): Promise<void> {
  process.stdout.write(`Installing ${chalk.magentaBright("typescript")} ... `);
  await execa("npm", [
    "install",
    "typescript",
    nodeVersion ? `@types/node@${nodeVersion}` : "@types/node",
    "ts-node",
    "--save-dev"
  ]);
  await execa("npx", ["tsc", "--init", "--outDir", "build"]);
  process.stdout.write("Done" + EOL);
}

async function automatedCodeFormatting(): Promise<void> {
  process.stdout.write(
    `Installing ${chalk.magentaBright("prettier / pretty-quick")} ... `
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

async function installedManagedDependencies(
  nodeVersion?: string
): Promise<void> {
  process.stdout.write(
    `Installing ${chalk.magentaBright("managed dependencies")} ... `
  );
  await execa("npm", [
    "install",
    nodeVersion
      ? `create-typescript-project-dependencies@nodejs-v${nodeVersion}`
      : "create-typescript-project-dependencies",
    "--save-dev"
  ]);
  await execa("npx", ["tsc", "--init", "--outDir", "build"]);
  process.stdout.write("Done" + EOL);
}

async function bootstrapGitignore(): Promise<void> {
  process.stdout.write(
    `Bootstrapping ${chalk.magentaBright(".gitignore")} ... `
  );
  const dest = fs.createWriteStream(".gitignore");
  const res = await fetch("https://gitignore.io/api/node,macos");
  dest.write("build/\r\n\r\n");
  res.body.pipe(dest);
  process.stdout.write("Done" + EOL);
}

async function bootstrapSampleCode(dir: string): Promise<void> {
  process.stdout.write(
    `Bootstrapping ${chalk.magentaBright("'hello world'-sample")} ... `
  );
  fs.mkdirSync(dir + "/src");
  fs.writeFileSync(
    dir + "/src/index.ts",
    "// happy coding 👻" + EOL + 'console.log("hello world");'
  );
  process.stdout.write("Done" + EOL);
}

async function stageFiles(dir: string): Promise<void> {
  process.stdout.write(`Staging ${chalk.magentaBright("files")} ... `);
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
  const matchedVersion = process.version.match(/v?([0-9]+)\..*/);
  const nodeVersion = matchedVersion ? matchedVersion[1] : undefined;
  const dir = process.cwd();
  const managed = process.argv.length > 2 && process.argv[2] === "--managed";
  await initializeGitRepository(dir);
  await bootstrapPackageJson(dir);
  if (managed) {
    await installedManagedDependencies(nodeVersion);
  } else {
    await installTypescript(nodeVersion);
    await automatedCodeFormatting();
  }
  await bootstrapGitignore();
  await bootstrapSampleCode(dir);
  await stageFiles(dir);
  await happyHacking();
})();
