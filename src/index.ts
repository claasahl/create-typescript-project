import execa from "execa";

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
})();
