#!/usr/bin/env node
import execa from "execa";
import jsonfile from "jsonfile";

const PACKAGE_JSON = "package.json";
(async () => {
  await execa("npm", ["install", "typescript", "@types/node", "--save-dev"]);
  await execa("tsc", ["--init"]);

  await execa("npm", [
    "install",
    "prettier",
    "pretty-quick",
    "husky",
    "--save-dev"
  ]);
  const husky = {
    husky: {
      hooks: {
        "pre-commit": "pretty-quick --staged"
      }
    }
  };
  const pkg = jsonfile.readFileSync(PACKAGE_JSON);
  jsonfile.writeFileSync(PACKAGE_JSON, { ...husky, ...pkg });
})();
