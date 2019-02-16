#!/usr/bin/env node
import execa from "execa";
import init from "init-package-json";
import path from "path";
import fs from "fs";
import fetch from "node-fetch";
import * as git from "isomorphic-git";

const HOME = process.env.HOME || ".";
// a path to a promzard module.  In the event that this file is
// not found, one will be provided for you.
const initFile = path.resolve(HOME, ".npm-init");

// the dir where we're doin stuff.
const dir = process.cwd();

// extra stuff that gets put into the PromZard module's context.
// In npm, this is the resolved config object.  Exposed as 'config'
// Optional.
const configData = { yes: true, silent: true };

// Any existing stuff from the package.json file is also exposed in the
// PromZard module as the `package` object.  There will also be free
// vars for:
// * `filename` path to the package.json file
// * `basename` the tip of the package dir
// * `dirname` the parent of the package dir

init(dir, initFile, configData, function(_er, data) {
  // the data's already been written to {dir}/package.json
  // now you can do stuff with it
  const packageFile = path.resolve(dir, "package.json");
  const husky = {
    hooks: {
      "pre-commit": "pretty-quick --staged"
    }
  };
  const scripts = {
    ...data.scripts,
    prepare: "tsc",
    build: "tsc",
    start: "ts-node src/hello-world.ts"
  };
  fs.writeFileSync(
    packageFile,
    JSON.stringify({ ...data, scripts, husky }, null, 2)
  );

  (async () => {
    await execa("npm", ["install", "typescript", "@types/node", "--save-dev"]);
    await execa("tsc", ["--init", "--outDir", "build"]);
    await execa("npm", [
      "install",
      "prettier",
      "pretty-quick",
      "husky",
      "ts-node",
      "--save-dev"
    ]);

    const dest = fs.createWriteStream(".gitignore");
    const res = await fetch("https://gitignore.io/api/node");
    res.body.pipe(dest);

    fs.mkdirSync(dir + "/src");
    fs.writeFileSync(
      dir + "/src/hello-world.ts",
      `// happy coding 👻
      console.log("hello world");`
    );

    git.plugins.set("fs", fs);
    await git.init({ dir });
    await git.add({ dir, filepath: ".gitignore" });
    await git.add({ dir, filepath: "package.json" });
    await git.add({ dir, filepath: "package-lock.json" });
    await git.add({ dir, filepath: "tsconfig.json" });
    await git.add({ dir, filepath: "src/hello-world.ts" });
    await git.commit({
      dir,
      message: "Initial Commit 👻",
      author: { name: "create-typescript-project", email: "no-email@inter.net" }
    });
  })();
});
