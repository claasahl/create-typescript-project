#!/usr/bin/env node
import execa from "execa";
import path from "path";
import fs from "fs";
import fetch from "node-fetch";
import * as git from "isomorphic-git";
import chalk from "chalk";
import jsonfile from "jsonfile";

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
  start: "ts-node src/hello-world.ts"
};

(async () => {
  git.plugins.set("fs", fs);
  await git.init({ dir });

  process.stdout.write(`Bootstrapping ${chalk.magenta("package.json")} ... `);
  await execa("npm", ["init", "--yes"]);
  const packageFile = path.resolve(dir, "package.json");
  const packageJson = await jsonfile.readFile(packageFile);
  packageJson.scripts = { ...packageJson.scripts, ...scripts };
  await jsonfile.writeFile(packageFile, { ...packageJson, husky });
  process.stdout.write("Done\r\n");

  process.stdout.write(`Installing ${chalk.magenta("typescript")} ... `);
  await execa("npm", [
    "install",
    "typescript",
    "@types/node",
    "ts-node",
    "--save-dev"
  ]);
  await execa("tsc", ["--init", "--outDir", "build"]);
  process.stdout.write("Done\r\n");

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
  process.stdout.write("Done\r\n");

  process.stdout.write(`Bootstrapping ${chalk.magenta(".gitignore")} ... `);
  const dest = fs.createWriteStream(".gitignore");
  const res = await fetch("https://gitignore.io/api/node");
  dest.write("build/\r\n\r\n");
  res.body.pipe(dest);
  process.stdout.write("Done\r\n");

  process.stdout.write(
    `Bootstrapping ${chalk.magenta("'hello world'-sample")} ... `
  );
  fs.mkdirSync(dir + "/src");
  fs.writeFileSync(
    dir + "/src/hello-world.ts",
    '// happy coding 👻\r\nconsole.log("hello world");'
  );
  process.stdout.write("Done\r\n");

  process.stdout.write(`Staging ${chalk.magenta("files")} ... `);
  await git.add({ dir, filepath: ".gitignore" });
  await git.add({ dir, filepath: "package.json" });
  await git.add({ dir, filepath: "package-lock.json" });
  await git.add({ dir, filepath: "tsconfig.json" });
  await git.add({ dir, filepath: "src/hello-world.ts" });
  process.stdout.write("Done\r\n");

  process.stdout.write("\r\nHappy hacking! 👽 👻 😃");
})();
