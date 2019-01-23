#!/usr/bin/env node
import execa from "execa";

(async () => {
  await execa("tsc");
})();
