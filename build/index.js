#!/usr/bin/env node
"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var dir = process.cwd();
var packageFile = path_1.default.resolve(dir, "package.json");
if (packageFile && fs_1.default.existsSync(packageFile)) {
  console.log("Resolved 'package.json':", packageFile);
} else {
  console.log("Did not resolve 'package.json'.");
}
if (fs_1.default.existsSync(packageFile)) {
  console.log("'package.json' exists.");
} else {
  console.log("'package.json' does not exist.");
}
//# sourceMappingURL=index.js.map
