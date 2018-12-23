#!/usr/bin/env node
import execa from "execa";

(async () => {
  const { stdout } = await execa("echo", ["hello world"]);
  console.log(stdout);
})();
