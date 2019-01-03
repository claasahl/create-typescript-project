#!/usr/bin/env node
"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var dir = process.cwd();
var packageFile = path_1.default.resolve(dir, "package.json");
if (packageFile) {
  console.log("Found package.json:", packageFile);
} else {
  console.log("Did not find package.json");
}
//# sourceMappingURL=index.js.map
