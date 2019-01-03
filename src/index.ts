#!/usr/bin/env node
import path from "path";

const dir = process.cwd();
const packageFile = path.resolve(dir, "package.json");
if (packageFile) {
  console.log("Found package.json:", packageFile);
} else {
  console.log("Did not find package.json");
}
