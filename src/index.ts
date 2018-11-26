import execa from "execa";
import fetch from "node-fetch";
import fs from "fs";

(async () => {
  await execa("npm", ["install", "typescript", "@types/node", "--save-dev"]);
  await execa("tsc", [
    "--sourceMap",
    "--outDir",
    "./build",
    "--strict",
    "--noImplicitAny",
    "--strictNullChecks",
    "--strictFunctionTypes",
    "--strictPropertyInitialization",
    "--noImplicitThis",
    "--alwaysStrict",
    "--noUnusedLocals",
    "--noUnusedParameters",
    "--noImplicitReturns",
    "--noFallthroughCasesInSwitch",
    "--init"
  ]);
  await execa("npm", [
    "install",
    "prettier",
    "pretty-quick",
    "husky",
    "--save-dev"
  ]);

  const stream = fs.createWriteStream(".gitignore");
  stream.write("build/\r\n");
  const gitignore_io = await fetch("https://www.gitignore.io/api/node");
  gitignore_io.body.pipe(stream);
})();
