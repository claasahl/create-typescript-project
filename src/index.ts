#!/usr/bin/env node
import execa from "execa";

(async () => {
  await execa("npm", ["install", "typescript", "@types/node", "--save-dev"]);
  await execa("tsc", ["--init"]);
})();
