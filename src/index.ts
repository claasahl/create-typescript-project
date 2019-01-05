#!/usr/bin/env node
import path from "path";
import fs from "fs";

const dir = process.cwd();
const packageFile = path.resolve(dir, "package.json");
if (packageFile && fs.existsSync(packageFile)) {
  console.log("Resolved 'package.json':", packageFile);
} else {
  console.log("Did not resolve 'package.json'.");
}

if (fs.existsSync(packageFile)) {
  console.log("'package.json' exists.");
} else {
  console.log("'package.json' does not exist.");
}
